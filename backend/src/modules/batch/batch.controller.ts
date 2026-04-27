import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { batchService } from './batch.service';
import { batchRepository } from './batch.repository';

const createBatchSchema = z.object({
  deviceId: z.string().min(1),
});

const goodLeafSchema = z.object({
  goodLeafPercentage: z.number().min(0).max(100),
});

const priceSchema = z.object({
  sellingPrice: z.number().positive(),
});

export const batchController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const body = createBatchSchema.parse(req.body);
      const batch = await batchService.createBatch({
        factoryId: req.user.factoryId,
        deviceId: body.deviceId,
      });
      res.status(201).json({ success: true, data: batch });
    } catch (e) {
      next(e);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false });
      const batches =
        req.user.role === 'GENERAL_MANAGER'
          ? await batchService.listAll()
          : await batchService.listForFactory(req.user.factoryId);
      res.json({ success: true, data: batches });
    } catch (e) {
      next(e);
    }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const batch = await batchService.getById(req.params.id);
      res.json({ success: true, data: batch });
    } catch (e) {
      next(e);
    }
  },

  async getActiveForDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const batch = await batchService.getActiveBatchForDevice(req.params.deviceId);
      res.json({ success: true, data: batch });
    } catch (e) {
      next(e);
    }
  },

  async setGoodLeaf(req: Request, res: Response, next: NextFunction) {
    try {
      const body = goodLeafSchema.parse(req.body);
      const updated = await batchService.setGoodLeafPercentage(
        req.params.id,
        body.goodLeafPercentage
      );
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },

  async start(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await batchService.startFermentation(req.params.id);
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },

  async skipReadyPhase(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await batchService.skipReadyPhase(req.params.id);
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },

  async stop(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await batchService.stopFermentation(req.params.id);
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },

  async createPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const { batchId, factoryId, deviceId } = req.body;
      if (!batchId || !factoryId) {
        return res.status(400).json({ success: false, error: 'batchId and factoryId are required' });
      }
      const { GetCommand, PutCommand } = await import('@aws-sdk/lib-dynamodb');
      const { ddb, TableNames } = await import('../../config/db');

      const existing = await ddb.send(new GetCommand({
        TableName: TableNames.batches,
        Key: { batchId },
      }));
      if (existing.Item) {
        return res.json({ success: true, data: existing.Item });
      }
      const now = new Date().toISOString();
      const batch = { batchId, factoryId, deviceId: deviceId ?? 'DEV001', status: 'ONGOING', createdAt: now, startedAt: now };
      await ddb.send(new PutCommand({ TableName: TableNames.batches, Item: batch }));
      res.status(201).json({ success: true, data: batch });
    } catch (e) {
      next(e);
    }
  },

  async setGlpPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const glp = Number(req.body.glp);
      if (!Number.isFinite(glp) || glp < 0 || glp > 100) {
        return res.status(400).json({ success: false, error: 'glp must be 0–100' });
      }
      const batch = await batchRepository.updateGoodLeafPercentage(
        req.params.id,
        glp,
        new Date().toISOString(),
        'COMPLETED'
      );
      res.json({ success: true, data: batch });
    } catch (e) {
      next(e);
    }
  },

  async setPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const body = priceSchema.parse(req.body);
      const updated = await batchService.setSellingPrice(
        req.params.id,
        body.sellingPrice
      );
      res.json({ success: true, data: updated });
    } catch (e) {
      next(e);
    }
  },
};
