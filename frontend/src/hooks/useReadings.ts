'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { SensorReading, BatchGraphs } from '@/types';

function getArrayPayload<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.data)) return record.data as T[];
  }
  return [];
}

function getObjectPayload<T>(payload: unknown, fallback: T): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return ((payload as { data?: T }).data ?? fallback) as T;
  }
  return (payload as T) ?? fallback;
}

export function useFactoryReadings(factoryId: string | null, pollMs = 3_000, limit = 20) {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!factoryId) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/factories/${factoryId}/readings?limit=${limit}`);
      setReadings(getArrayPayload<SensorReading>(res.data));
      setError(null);
    } catch (e: any) {
      setReadings([]);
      setError(e.response?.data?.error ?? e.response?.data?.message ?? 'Failed to load readings');
    } finally {
      setLoading(false);
    }
  }, [factoryId, limit]);

  useEffect(() => {
    load();
    if (factoryId) {
      const id = setInterval(load, pollMs);
      return () => clearInterval(id);
    }
  }, [load, pollMs, factoryId]);

  return { readings, loading, error, reload: load };
}

export function useBatchGraphs(batchId: string | null) {
  const [graphs, setGraphs] = useState<BatchGraphs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!batchId) {
      setLoading(false);
      return;
    }
    api
      .get(`/batches/${batchId}/graphs`)
      .then((r) => setGraphs(getObjectPayload<BatchGraphs | null>(r.data, null)))
      .catch((e) => {
        setGraphs(null);
        setError(e.response?.data?.error ?? e.response?.data?.message ?? 'Failed to load graphs');
      })
      .finally(() => setLoading(false));
  }, [batchId]);

  return { graphs, loading, error };
}
