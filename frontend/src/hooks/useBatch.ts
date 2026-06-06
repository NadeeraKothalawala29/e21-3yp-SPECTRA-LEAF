'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { BatchListItem, BatchSummary, FactoryDashboard } from '@/types';

function getArrayPayload<T>(payload: unknown, key: string): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.data)) return record.data as T[];
    if (Array.isArray(record[key])) return record[key] as T[];
  }
  return [];
}

function getObjectPayload<T>(payload: unknown, fallback: T): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return ((payload as { data?: T }).data ?? fallback) as T;
  }
  return (payload as T) ?? fallback;
}

export function useFactoryBatches(factoryId: string | null, pollMs = 3_000) {
  const [batches, setBatches] = useState<BatchListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!factoryId) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/factories/${factoryId}/batches`);
      
      // Ensure the payload is parsed as an object, in case AWS Lambda returns it as a string
      const payload = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      
      // Explicitly extract the batches array from the payload
      const extractedBatches = Array.isArray(payload?.batches) 
        ? payload.batches 
        : Array.isArray(payload?.data) 
          ? payload.data 
          : Array.isArray(payload) 
            ? payload 
            : [];
            
      setBatches(extractedBatches);
      setError(null);
    } catch (e: any) {
      setBatches([]);
      setError(e.response?.data?.error ?? e.response?.data?.message ?? 'Failed to load batches');
    } finally {
      setLoading(false);
    }
  }, [factoryId]);

  useEffect(() => {
    load();
    if (pollMs && factoryId) {
      const id = setInterval(load, pollMs);
      return () => clearInterval(id);
    }
  }, [load, pollMs, factoryId]);

  return { batches, loading, error, reload: load };
}

export function useBatchSummary(batchId: string | null) {
  const [summary, setSummary] = useState<BatchSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!batchId) {
      setLoading(false);
      return;
    }
    api
      .get<{ data: BatchSummary }>(`/batches/${batchId}/summary`)
      .then((r) => setSummary(getObjectPayload<BatchSummary | null>(r.data, null)))
      .catch((e) => {
        setSummary(null);
        setError(e.response?.data?.error ?? e.response?.data?.message ?? 'Failed to load summary');
      })
      .finally(() => setLoading(false));
  }, [batchId]);

  return { summary, loading, error };
}

export function useFactoryDashboard(factoryId: string | null) {
  const [dashboard, setDashboard] = useState<FactoryDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!factoryId) {
      setLoading(false);
      return;
    }
    api
      .get(`/factories/${factoryId}/dashboard`)
      .then((r) => setDashboard(getObjectPayload<FactoryDashboard | null>(r.data, null)))
      .catch((e) => {
        setDashboard(null);
        setError(e.response?.data?.error ?? e.response?.data?.message ?? 'Failed to load dashboard');
      })
      .finally(() => setLoading(false));
  }, [factoryId]);

  return { dashboard, loading, error };
}
