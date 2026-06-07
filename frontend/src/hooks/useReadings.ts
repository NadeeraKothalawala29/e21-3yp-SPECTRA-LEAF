'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { BatchGraphs, GraphPoint, SensorReading } from '@/types';

function num(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function normalizeReading(item: any): SensorReading {
  return {
    timestamp: item.timestamp ?? item.TIMESTAMP ?? '',
    deviceId: item.deviceId ?? item.DEVICE_ID ?? null,
    factoryId: item.factoryId ?? item.FACTORY_ID ?? null,
    batchId: item.batchId ?? item.BATCH_ID ?? null,
    temperature: num(item.temperature ?? item.TEMPERATURE),
    rgRatio: num(item.rgRatio ?? item.RG_RATIO ?? item.color ?? item.COLOR),
    mq137: num(item.mq137 ?? item.MQ137 ?? item.mq135 ?? item.MQ135),
    tgs2620: num(item.tgs2620 ?? item.TGS2620),
    tgs822: num(item.tgs822 ?? item.TGS822),
  };
}

function normalizePoints(items: any[] | undefined): GraphPoint[] {
  return (items ?? []).map((p) => ({
    timestamp: p.timestamp ?? p.TIMESTAMP ?? '',
    value: Number(p.value ?? p.VALUE ?? 0),
  }));
}

export function useFactoryReadings(factoryId: string, intervalMs = 30_000, limit = 20) {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!factoryId) {
      setReadings([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function load() {
      try {
        const res = await api.get(`/factories/${factoryId}/readings`, { params: { limit } });
        const payload = res.data?.data ?? res.data?.readings ?? res.data ?? [];
        if (!cancelled) setReadings((Array.isArray(payload) ? payload : []).map(normalizeReading));
      } catch {
        if (!cancelled) setReadings([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const timer = window.setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [factoryId, intervalMs, limit]);

  return { readings, loading };
}

export function useBatchGraphs(batchId: string | null) {
  const [graphs, setGraphs] = useState<BatchGraphs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!batchId) {
      setGraphs(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await api.get(`/batches/${batchId}/graphs`);
        const payload = res.data?.data ?? res.data ?? {};
        if (!cancelled) {
          setGraphs({
            temperature: normalizePoints(payload.temperature),
            rgRatio: normalizePoints(payload.rgRatio ?? payload.color),
            mq137: normalizePoints(payload.mq137 ?? payload.mq135),
            tgs2620: normalizePoints(payload.tgs2620),
            tgs822: normalizePoints(payload.tgs822),
          });
        }
      } catch {
        if (!cancelled) {
          setGraphs({
            temperature: [],
            rgRatio: [],
            mq137: [],
            tgs2620: [],
            tgs822: [],
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [batchId]);

  return { graphs, loading };
}
