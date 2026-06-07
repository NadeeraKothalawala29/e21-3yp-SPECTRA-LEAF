import { PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, TableNames } from '../../config/db';
import { Reading } from '../../types';

type AwsReadingItem = Partial<Reading> & {
  DEVICE_ID?: string;
  TIMESTAMP?: string;
  TYPE?: string;
  FACTORY_ID?: string;
  BATCH_ID?: string;
  RG_RATIO?: number;
  TEMPERATURE?: number;
  MQ137?: number;
  MQ135?: number;
  TGS2620?: number;
  TGS822?: number;
  COLOR?: number;
};

function compactDeviceId(deviceId: string) {
  return deviceId.replace(/-/g, '');
}

function uniqueDeviceIds(deviceId: string) {
  return Array.from(new Set([deviceId, compactDeviceId(deviceId)]));
}

function toReading(item: AwsReadingItem): Reading {
  return {
    deviceId: item.deviceId ?? item.DEVICE_ID ?? '',
    timestamp: item.timestamp ?? item.TIMESTAMP ?? '',
    temperature: Number(item.temperature ?? item.TEMPERATURE ?? 0),
    rgRatio: Number(item.rgRatio ?? item.RG_RATIO ?? item.COLOR ?? 0),
    mq137: Number(item.mq137 ?? item.MQ137 ?? item.MQ135 ?? 0),
    tgs2620: Number(item.tgs2620 ?? item.TGS2620 ?? 0),
    tgs822: Number(item.tgs822 ?? item.TGS822 ?? 0),
    batchId: item.batchId ?? item.BATCH_ID,
  };
}

function sortByTimestamp(readings: Reading[]) {
  return readings.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

async function queryReadings(input: {
  deviceId: string;
  limit?: number;
  scanForward: boolean;
  batchId?: string;
}) {
  const upperCaseQuery = {
    TableName: TableNames.readings,
    KeyConditionExpression: 'DEVICE_ID = :d',
    ...(input.batchId ? { FilterExpression: 'BATCH_ID = :b' } : {}),
    ExpressionAttributeValues: {
      ':d': input.deviceId,
      ...(input.batchId ? { ':b': input.batchId } : {}),
    },
    ScanIndexForward: input.scanForward,
    ...(input.limit ? { Limit: input.limit } : {}),
  };

  try {
    const res = await ddb.send(new QueryCommand(upperCaseQuery));
    return ((res.Items as AwsReadingItem[]) ?? []).map(toReading);
  } catch (error: any) {
    if (error?.name !== 'ValidationException') throw error;
  }

  const lowerCaseQuery = {
    TableName: TableNames.readings,
    KeyConditionExpression: 'deviceId = :d',
    ...(input.batchId ? { FilterExpression: 'batchId = :b' } : {}),
    ExpressionAttributeValues: {
      ':d': input.deviceId,
      ...(input.batchId ? { ':b': input.batchId } : {}),
    },
    ScanIndexForward: input.scanForward,
    ...(input.limit ? { Limit: input.limit } : {}),
  };
  const res = await ddb.send(new QueryCommand(lowerCaseQuery));
  return ((res.Items as AwsReadingItem[]) ?? []).map(toReading);
}

export const readingsRepository = {
  async create(reading: Reading): Promise<Reading> {
    await ddb.send(
      new PutCommand({
        TableName: TableNames.readings,
        Item: {
          DEVICE_ID: compactDeviceId(reading.deviceId),
          TIMESTAMP: reading.timestamp,
          TYPE: 'SENSOR',
          BATCH_ID: reading.batchId,
          RG_RATIO: reading.rgRatio,
          TEMPERATURE: reading.temperature,
          MQ137: reading.mq137,
          TGS2620: reading.tgs2620,
          TGS822: reading.tgs822,
        },
      })
    );
    return reading;
  },

  async listByDevice(deviceId: string, limit = 500): Promise<Reading[]> {
    const results = await Promise.all(
      uniqueDeviceIds(deviceId).map((id) =>
        queryReadings({ deviceId: id, scanForward: true, limit })
      )
    );
    return sortByTimestamp(results.flat()).slice(-limit);
  },

  async listByBatch(deviceId: string, batchId: string): Promise<Reading[]> {
    const results = await Promise.all(
      uniqueDeviceIds(deviceId).map((id) =>
        queryReadings({ deviceId: id, scanForward: true, batchId })
      )
    );
    return sortByTimestamp(results.flat());
  },

  async listByFactory(factoryId: string, limit = 20): Promise<Reading[]> {
    try {
      const res = await ddb.send(new ScanCommand({
        TableName: TableNames.readings,
        FilterExpression: 'FACTORY_ID = :f',
        ExpressionAttributeValues: { ':f': factoryId },
      }));
      const items = ((res.Items as AwsReadingItem[]) ?? []).map(toReading);
      return sortByTimestamp(items).slice(-limit);
    } catch {
      const res = await ddb.send(new ScanCommand({
        TableName: TableNames.readings,
        FilterExpression: 'factoryId = :f',
        ExpressionAttributeValues: { ':f': factoryId },
      }));
      const items = ((res.Items as AwsReadingItem[]) ?? []).map(toReading);
      return sortByTimestamp(items).slice(-limit);
    }
  },

  async latestForBatch(batchId: string): Promise<Reading | null> {
    try {
      const res = await ddb.send(new ScanCommand({
        TableName: TableNames.readings,
        FilterExpression: 'BATCH_ID = :b',
        ExpressionAttributeValues: { ':b': batchId },
      }));
      const items = ((res.Items as AwsReadingItem[]) ?? []).map(toReading);
      const sorted = sortByTimestamp(items);
      return sorted[sorted.length - 1] ?? null;
    } catch {
      return null;
    }
  },

  async latestForDevice(deviceId: string, limit = 20): Promise<Reading[]> {
    const results = await Promise.all(
      uniqueDeviceIds(deviceId).map((id) =>
        queryReadings({ deviceId: id, scanForward: false, limit })
      )
    );
    return sortByTimestamp(results.flat()).slice(-limit);
  },
};
