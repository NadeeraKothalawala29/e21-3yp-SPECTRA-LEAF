import { Request, Response, NextFunction } from 'express';
import { batchRepository } from '../batch/batch.repository';
import { readingsRepository } from '../readings/readings.repository';

export const factoriesController = {
  async batches(req: Request, res: Response, next: NextFunction) {
    try {
      const { factoryId } = req.params;
      const batches = await batchRepository.listByFactory(factoryId);

      const enriched = await Promise.all(
        batches.map(async (b) => {
          const latest = await readingsRepository.latestForBatch(b.batchId);
          const color = latest
            ? (latest.colorR + latest.colorG + latest.colorB) / 3
            : null;
          return {
            batchId: b.batchId,
            lastTimestamp: b.completedAt ?? b.startedAt ?? b.createdAt,
            latestTemperature: latest?.temperature ?? null,
            latestColor: color,
            latestMq135: latest?.mq137 ?? null,
            glp: b.goodLeafPercentage ?? null,
            price: b.sellingPrice ?? null,
          };
        })
      );

      res.json({ success: true, data: enriched });
    } catch (e) {
      next(e);
    }
  },

  async readings(req: Request, res: Response, next: NextFunction) {
    try {
      const { factoryId } = req.params;
      const limit = Math.min(parseInt(String(req.query.limit ?? '20'), 10) || 20, 100);

      const raw = await readingsRepository.listByFactory(factoryId, limit);

      const result = raw
        .slice()
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)
        .map((r) => ({
          timestamp: r.timestamp,
          deviceId: r.deviceId,
          factoryId,
          batchId: r.batchId ?? '',
          temperature: r.temperature,
          color: (r.colorR + r.colorG + r.colorB) / 3,
          mq135: r.mq137,
        }));

      res.json({ success: true, data: result });
    } catch (e) {
      next(e);
    }
  },
};
