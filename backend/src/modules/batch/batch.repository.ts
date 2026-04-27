import {
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { ddb, TableNames } from '../../config/db';
import { Batch, BatchStatus } from '../../types';

export const batchRepository = {
  async getById(batchId: string): Promise<Batch | null> {
    const res = await ddb.send(
      new GetCommand({ TableName: TableNames.batches, Key: { batchId } })
    );
    return (res.Item as Batch) ?? null;
  },

  async listByFactory(factoryId: string): Promise<Batch[]> {
    const res = await ddb.send(
      new ScanCommand({
        TableName: TableNames.batches,
        FilterExpression: 'factoryId = :f',
        ExpressionAttributeValues: { ':f': factoryId },
      })
    );
    return (res.Items as Batch[]) ?? [];
  },

  async listAll(): Promise<Batch[]> {
    const res = await ddb.send(new ScanCommand({ TableName: TableNames.batches }));
    return (res.Items as Batch[]) ?? [];
  },

  async create(batch: Batch): Promise<Batch> {
    await ddb.send(new PutCommand({ TableName: TableNames.batches, Item: batch }));
    return batch;
  },

  async updateStatus(
    batchId: string,
    status: BatchStatus,
    timestamps: Partial<Pick<Batch, 'readyPhaseStartedAt' | 'startedAt' | 'completedAt'>> = {}
  ): Promise<Batch> {
    const sets: string[] = ['#s = :s'];
    const values: Record<string, unknown> = { ':s': status };
    const names: Record<string, string> = { '#s': 'status' };

    for (const [k, v] of Object.entries(timestamps)) {
      if (v !== undefined) {
        sets.push(`${k} = :${k}`);
        values[`:${k}`] = v;
      }
    }

    const res = await ddb.send(
      new UpdateCommand({
        TableName: TableNames.batches,
        Key: { batchId },
        UpdateExpression: `SET ${sets.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: 'ALL_NEW',
      })
    );
    return res.Attributes as Batch;
  },

  async updateGoodLeafPercentage(
    batchId: string,
    pct: number,
    readyPhaseStartedAt: string,
    status: BatchStatus
  ): Promise<Batch> {
    const res = await ddb.send(
      new UpdateCommand({
        TableName: TableNames.batches,
        Key: { batchId },
        UpdateExpression:
          'SET goodLeafPercentage = :p, readyPhaseStartedAt = :r, #s = :s',
        ExpressionAttributeNames: { '#s': 'status' },
        ExpressionAttributeValues: {
          ':p': pct,
          ':r': readyPhaseStartedAt,
          ':s': status,
        },
        ReturnValues: 'ALL_NEW',
      })
    );
    return res.Attributes as Batch;
  },

  async updatePrice(batchId: string, price: number): Promise<Batch> {
    const res = await ddb.send(
      new UpdateCommand({
        TableName: TableNames.batches,
        Key: { batchId },
        UpdateExpression: 'SET sellingPrice = :p',
        ExpressionAttributeValues: { ':p': price },
        ReturnValues: 'ALL_NEW',
      })
    );
    return res.Attributes as Batch;
  },
};
