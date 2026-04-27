import {
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { ddb, TableNames } from '../../config/db';
import { Device } from '../../types';

export const deviceRepository = {
  async getById(deviceId: string): Promise<Device | null> {
    const res = await ddb.send(
      new GetCommand({ TableName: TableNames.devices, Key: { deviceId } })
    );
    return (res.Item as Device) ?? null;
  },

  async listByFactory(factoryId: string): Promise<Device[]> {
    const res = await ddb.send(
      new ScanCommand({
        TableName: TableNames.devices,
        FilterExpression: 'factoryId = :f',
        ExpressionAttributeValues: { ':f': factoryId },
      })
    );
    return (res.Items as Device[]) ?? [];
  },

  async list(): Promise<Device[]> {
    const res = await ddb.send(new ScanCommand({ TableName: TableNames.devices }));
    return (res.Items as Device[]) ?? [];
  },

  async create(device: Device): Promise<Device> {
    await ddb.send(new PutCommand({ TableName: TableNames.devices, Item: device }));
    return device;
  },

  async setActiveBatch(deviceId: string, activeBatchId: string | null): Promise<void> {
    if (activeBatchId === null) {
      await ddb.send(
        new UpdateCommand({
          TableName: TableNames.devices,
          Key: { deviceId },
          UpdateExpression: 'REMOVE activeBatchId',
        })
      );
    } else {
      await ddb.send(
        new UpdateCommand({
          TableName: TableNames.devices,
          Key: { deviceId },
          UpdateExpression: 'SET activeBatchId = :b',
          ExpressionAttributeValues: { ':b': activeBatchId },
        })
      );
    }
  },
};
