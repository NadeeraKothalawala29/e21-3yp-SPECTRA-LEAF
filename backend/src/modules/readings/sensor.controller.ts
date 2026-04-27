import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ddb, TableNames } from '../../config/db';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const sensorSchema = z.object({
  DEVICE_ID: z.string().optional(),
  deviceId: z.string().optional(),
  TIMESTAMP: z.string().optional(),
  timestamp: z.string().optional(),
  FACTORY_ID: z.string().optional(),
  factoryId: z.string().optional(),
  BATCH_ID: z.string().optional(),
  batchId: z.string().optional(),
  TEMPERATURE: z.number().optional(),
  temperature: z.number().optional(),
  MQ135: z.number().optional(),
  mq135: z.number().optional(),
  COLOR: z.number().optional(),
  color: z.number().optional(),
});

export async function sensorIngest(req: Request, res: Response, next: NextFunction) {
  try {
    const body = sensorSchema.parse(req.body);

    const deviceId = (body.DEVICE_ID ?? body.deviceId ?? 'UNKNOWN').replace(/-/g, '');
    const batchId  = body.BATCH_ID  ?? body.batchId  ?? null;
    const factoryId = body.FACTORY_ID ?? body.factoryId ?? '';
    const ts = body.TIMESTAMP ?? body.timestamp ?? new Date().toISOString();
    const temp = body.TEMPERATURE ?? body.temperature ?? 0;
    const mq   = body.MQ135 ?? body.mq135 ?? 0;
    const color = body.COLOR ?? body.color ?? 0;

    // Store the reading
    await ddb.send(new PutCommand({
      TableName: TableNames.readings,
      Item: {
        DEVICE_ID: deviceId,
        TIMESTAMP: ts,
        TYPE: 'SENSOR',
        FACTORY_ID: factoryId,
        BATCH_ID: batchId,
        TEMPERATURE: temp,
        MQ135: mq,
        COLOR: color,
      },
    }));

    // Auto-create batch record in batches table if it doesn't exist
    if (batchId && factoryId) {
      const existing = await ddb.send(new GetCommand({
        TableName: TableNames.batches,
        Key: { batchId },
      }));
      if (!existing.Item) {
        await ddb.send(new PutCommand({
          TableName: TableNames.batches,
          Item: {
            batchId,
            factoryId,
            deviceId,
            status: 'ONGOING',
            createdAt: ts,
            startedAt: ts,
          },
        }));
      }
    }

    res.status(201).json({ success: true });
  } catch (e) {
    next(e);
  }
}
