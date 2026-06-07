'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { BatchListItem, BatchSummary, FactoryDashboard } from '@/types';

function num(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeBatch(item: any): BatchListItem {
  return {
    batchId: item.batchId ?? item.BATCH_ID ?? '',
    lastTimestamp: item.lastTimestamp ?? item.TIMESTAMP ?? null,
    latestTemperature: num(item.latestTemperature ?? item.TEMPERATURE),
    latestRgRatio: num(item.latestRgRatio ?? item.RG_RATIO ?? item.latestColor ?? item.COLOR),
    latestMq137: num(item.latestMq137 ?? item.MQ137 ?? item.latestMq135 ?? item.MQ135),
    latestTgs2620: num(item.latestTgs2620 ?? item.TGS2620),
    latestTgs822: num(item.latestTgs822 ?? item.TGS822),
    glp: num(item.glp ?? item.GLP),
    price: num(item.price ?? item.PRICE),
  };
}

export function useFactoryBatches(factoryId: string, intervalMs = 30_000) {
  const [batches, setBatches] = useState<BatchListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!factoryId) {
      setBatches([]);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/factories/${factoryId}/batches`);
      const payload = res.data?.data ?? res.data?.batches ?? [];
      setBatches((Array.isArray(payload) ? payload : []).map(normalizeBatch));
    } catch {
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }, [factoryId]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (active) await load();
    };
    run();
    const timer = window.setInterval(run, intervalMs);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [intervalMs, load]);

  return { batches, loading, reload: load };
}

export function useBatchSummary(batchId: string | null) {
  const [summary, setSummary] = useState<BatchSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!batchId) {
      setSummary(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await api.get(`/batches/${batchId}/summary`);
        const payload = res.data?.data ?? res.data ?? null;
        if (!cancelled) setSummary(payload);
      } catch {
        if (!cancelled) setSummary(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [batchId]);

  return { summary, loading };
}

export function useFactoryDashboard(factoryId: string) {
  const [dashboard, setDashboard] = useState<FactoryDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!factoryId) {
      setDashboard(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function load() {
      try {
        const res = await api.get(`/factories/${factoryId}/dashboard`);
        const payload = res.data?.data ?? res.data ?? null;
        if (!cancelled) setDashboard(payload);
      } catch {
        if (!cancelled) setDashboard(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [factoryId]);

  return { dashboard, loading };
}
