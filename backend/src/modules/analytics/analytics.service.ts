import { batchRepository } from '../batch/batch.repository';
import { Batch } from '../../types';

function isoWeekOf(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function monthOf(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function withPrice(batches: Batch[]) {
  return batches.filter(
    (b) => b.status === 'COMPLETED' && typeof b.sellingPrice === 'number'
  );
}

export const analyticsService = {
  async forFactory(factoryId: string) {
    const batches = await batchRepository.listByFactory(factoryId);
    return this.computeAnalytics(batches);
  },

  async forAll() {
    const batches = await batchRepository.listAll();
    return this.computeAnalytics(batches);
  },

  computeAnalytics(batches: Batch[]) {
    const priced = withPrice(batches);

    const totalBatches = batches.length;
    const totalRevenue = priced.reduce((s, b) => s + (b.sellingPrice ?? 0), 0);
    const averagePrice =
      priced.length === 0 ? 0 : totalRevenue / priced.length;
    const highestSellingBatch =
      priced.length === 0
        ? null
        : priced.reduce((a, b) =>
            (a.sellingPrice ?? 0) >= (b.sellingPrice ?? 0) ? a : b
          );

    const priceVariation = priced
      .slice()
      .sort(
        (a, b) =>
          new Date(a.completedAt ?? 0).getTime() -
          new Date(b.completedAt ?? 0).getTime()
      )
      .map((b) => ({
        batchId: b.batchId,
        sellingPrice: b.sellingPrice ?? 0,
        completedAt: b.completedAt,
      }));

    const weeklyMap = new Map<string, number>();
    const monthlyMap = new Map<string, number>();
    for (const b of priced) {
      if (!b.completedAt) continue;
      const d = new Date(b.completedAt);
      const wk = isoWeekOf(d);
      const mo = monthOf(d);
      weeklyMap.set(wk, (weeklyMap.get(wk) ?? 0) + (b.sellingPrice ?? 0));
      monthlyMap.set(mo, (monthlyMap.get(mo) ?? 0) + (b.sellingPrice ?? 0));
    }
    const weeklyProfit = Array.from(weeklyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, profit]) => ({ week, profit }));
    const monthlyProfit = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, profit]) => ({ month, profit }));

    const profitDistribution = priced
      .slice()
      .sort((a, b) => (b.sellingPrice ?? 0) - (a.sellingPrice ?? 0))
      .slice(0, 5)
      .map((b) => ({ batchId: b.batchId, value: b.sellingPrice ?? 0 }));

    return {
      totalBatches,
      totalRevenue,
      averagePrice,
      highestSellingBatch,
      priceVariation,
      weeklyProfit,
      monthlyProfit,
      profitDistribution,
    };
  },

  async mostSellingBatch(factoryId?: string) {
    const batches = factoryId
      ? await batchRepository.listByFactory(factoryId)
      : await batchRepository.listAll();
    const priced = withPrice(batches);
    if (priced.length === 0) return null;
    return priced.reduce((a, b) =>
      (a.sellingPrice ?? 0) >= (b.sellingPrice ?? 0) ? a : b
    );
  },

  async factoryOverview() {
    const batches = await batchRepository.listAll();
    const byFactory = new Map<string, Batch[]>();
    for (const b of batches) {
      const arr = byFactory.get(b.factoryId) ?? [];
      arr.push(b);
      byFactory.set(b.factoryId, arr);
    }
    const factories = Array.from(byFactory.entries()).map(([factoryId, list]) => {
      const priced = withPrice(list);
      const totalRevenue = priced.reduce((s, b) => s + (b.sellingPrice ?? 0), 0);
      const top = priced.length
        ? priced.reduce((a, b) =>
            (a.sellingPrice ?? 0) >= (b.sellingPrice ?? 0) ? a : b
          )
        : null;
      return {
        factoryId,
        totalBatches: list.length,
        totalRevenue,
        topBatch: top,
      };
    });

    const topBatches = withPrice(batches)
      .sort((a, b) => (b.sellingPrice ?? 0) - (a.sellingPrice ?? 0))
      .slice(0, 3);

    return { factories, topBatches };
  },
};
