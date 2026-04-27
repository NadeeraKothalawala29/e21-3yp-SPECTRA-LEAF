import { DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, TableNames } from '../config/db';

type TableConfig = {
  label: string;
  tableName: string;
  keyFields: string[];
};

const tables: TableConfig[] = [
  {
    label: 'readings',
    tableName: TableNames.readings,
    keyFields: ['DEVICE_ID', 'TIMESTAMP'],
  },
  {
    label: 'batches',
    tableName: TableNames.batches,
    keyFields: ['batchId'],
  },
  {
    label: 'devices',
    tableName: TableNames.devices,
    keyFields: ['deviceId'],
  },
  {
    label: 'users',
    tableName: TableNames.users,
    keyFields: ['userId'],
  },
];

function keyFromItem(item: Record<string, unknown>, keyFields: string[]) {
  const key: Record<string, unknown> = {};
  for (const field of keyFields) {
    if (item[field] === undefined) return null;
    key[field] = item[field];
  }
  return key;
}

async function clearTable({ label, tableName, keyFields }: TableConfig) {
  console.log(`[clear-all] scanning ${label} (${tableName})`);

  let deleted = 0;
  let lastKey: Record<string, unknown> | undefined;

  do {
    const res = await ddb.send(
      new ScanCommand({
        TableName: tableName,
        ExclusiveStartKey: lastKey,
      })
    );

    for (const item of (res.Items as Record<string, unknown>[]) ?? []) {
      const key = keyFromItem(item, keyFields);
      if (!key) continue;

      await ddb.send(
        new DeleteCommand({
          TableName: tableName,
          Key: key,
        })
      );
      deleted += 1;
    }

    lastKey = res.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (lastKey);

  console.log(`[clear-all] deleted ${deleted} rows from ${label}`);
}

async function clearAll() {
  for (const table of tables) {
    await clearTable(table);
  }

  console.log('[clear-all] done');
}

clearAll().catch((error) => {
  console.error('[clear-all] failed', error);
  process.exit(1);
});
