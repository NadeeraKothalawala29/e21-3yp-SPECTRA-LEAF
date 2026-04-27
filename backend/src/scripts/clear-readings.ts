import { DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, TableNames } from '../config/db';

type ReadingKey = {
  DEVICE_ID?: string;
  TIMESTAMP?: string;
  deviceId?: string;
  timestamp?: string;
};

async function clearReadings() {
  console.log(`[clear-readings] scanning ${TableNames.readings}`);

  let deleted = 0;
  let lastKey: Record<string, unknown> | undefined;

  do {
    const res = await ddb.send(
      new ScanCommand({
        TableName: TableNames.readings,
        ProjectionExpression: 'DEVICE_ID, TIMESTAMP, deviceId, #ts',
        ExpressionAttributeNames: { '#ts': 'timestamp' },
        ExclusiveStartKey: lastKey,
      })
    );

    for (const item of (res.Items as ReadingKey[]) ?? []) {
      const key =
        item.DEVICE_ID && item.TIMESTAMP
          ? { DEVICE_ID: item.DEVICE_ID, TIMESTAMP: item.TIMESTAMP }
          : item.deviceId && item.timestamp
            ? { deviceId: item.deviceId, timestamp: item.timestamp }
            : null;

      if (!key) continue;

      await ddb.send(
        new DeleteCommand({
          TableName: TableNames.readings,
          Key: key,
        })
      );
      deleted += 1;
    }

    lastKey = res.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (lastKey);

  console.log(`[clear-readings] deleted ${deleted} readings`);
}

clearReadings().catch((error) => {
  console.error('[clear-readings] failed', error);
  process.exit(1);
});
