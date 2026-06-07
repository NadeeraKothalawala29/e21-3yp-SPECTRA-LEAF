import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { readingsService } from './readings.service';

const ingestSchema = z
  .object({
    deviceId: z.string().min(1).optional(),
    timestamp: z.string().optional(),
    batchId: z.string().optional(),
    temperature: z.number().optional(),
    rgRatio: z.number().optional(),
    mq137: z.number().optional(),
    tgs2620: z.number().optional(),
    tgs822: z.number().optional(),
    DEVICE_ID: z.string().min(1).optional(),
    TIMESTAMP: z.string().optional(),
    BATCH_ID: z.string().optional(),
    RG_RATIO: z.number().optional(),
    COLOR: z.number().min(0).max(255).optional(),
    TEMPERATURE: z.number().optional(),
    MQ137: z.number().optional(),
    MQ135: z.number().optional(),
    TGS2620: z.number().optional(),
    TGS822: z.number().optional(),
  })
  .transform((body) => {
    return {
      deviceId: body.deviceId ?? body.DEVICE_ID ?? '',
      timestamp: body.timestamp ?? body.TIMESTAMP,
      batchId: body.batchId ?? body.BATCH_ID,
      temperature: body.temperature ?? body.TEMPERATURE ?? 0,
      rgRatio: body.rgRatio ?? body.RG_RATIO ?? body.COLOR ?? 0,
      mq137: body.mq137 ?? body.MQ137 ?? body.MQ135 ?? 0,
      tgs2620: body.tgs2620 ?? body.TGS2620 ?? 0,
      tgs822: body.tgs822 ?? body.TGS822 ?? 0,
    };
  })
  .refine((body) => body.deviceId.length > 0, {
    message: 'deviceId or DEVICE_ID is required',
  });

export const readingsController = {
  async ingest(req: Request, res: Response, next: NextFunction) {
    try {
      const body = ingestSchema.parse(req.body);
      const reading = await readingsService.ingest(body);
      res.status(201).json({ success: true, data: reading });
    } catch (e) {
      next(e);
    }
  },

  async listForDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const batchId = typeof req.query.batchId === 'string' ? req.query.batchId : undefined;
      const data = await readingsService.forDevice(req.params.deviceId, batchId);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },

  async latest(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 20;
      const data = await readingsService.latestForDevice(req.params.deviceId, limit);
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },
};
