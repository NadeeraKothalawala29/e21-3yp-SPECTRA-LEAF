import {
  CreateTableCommand,
  DeleteTableCommand,
  DescribeTableCommand,
  waitUntilTableExists,
} from '@aws-sdk/client-dynamodb';
import bcrypt from 'bcryptjs';
import { rawClient, TableNames, ddb } from '../config/db';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { User, Device, Batch, Reading } from '../types';

async function tableExists(name: string) {
  try {
    await rawClient.send(new DescribeTableCommand({ TableName: name }));
    return true;
  } catch {
    return false;
  }
}

async function dropIfExists(name: string) {
  if (await tableExists(name)) {
    console.log(`[seed] Dropping ${name}`);
    await rawClient.send(new DeleteTableCommand({ TableName: name }));
    await new Promise((r) => setTimeout(r, 500));
  }
}

async function createReadingsTable() {
  await rawClient.send(
    new CreateTableCommand({
      TableName: TableNames.readings,
      BillingMode: 'PAY_PER_REQUEST',
      AttributeDefinitions: [
        { AttributeName: 'DEVICE_ID', AttributeType: 'S' },
        { AttributeName: 'TIMESTAMP', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'DEVICE_ID', KeyType: 'HASH' },
        { AttributeName: 'TIMESTAMP', KeyType: 'RANGE' },
      ],
    })
  );
  await waitUntilTableExists(
    { client: rawClient, maxWaitTime: 30 },
    { TableName: TableNames.readings }
  );
}

async function createSimpleTable(name: string, pk: string) {
  await rawClient.send(
    new CreateTableCommand({
      TableName: name,
      BillingMode: 'PAY_PER_REQUEST',
      AttributeDefinitions: [{ AttributeName: pk, AttributeType: 'S' }],
      KeySchema: [{ AttributeName: pk, KeyType: 'HASH' }],
    })
  );
  await waitUntilTableExists(
    { client: rawClient, maxWaitTime: 30 },
    { TableName: name }
  );
}

async function seedUsers() {
  const users: Array<Omit<User, 'passwordHash'> & { password: string }> = [
    {
      userId: 'user-officer-1',
      username: 'officer1',
      password: 'pass123',
      role: 'OFFICER',
      factoryId: 'FAC-001',
    },
    {
      userId: 'user-manager-1',
      username: 'manager1',
      password: 'pass123',
      role: 'MANAGER',
      factoryId: 'FAC-001',
    },
    {
      userId: 'user-gm-1',
      username: 'gm1',
      password: 'pass123',
      role: 'GENERAL_MANAGER',
      factoryId: 'FAC-HQ',
    },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const { password, ...rest } = u;
    await ddb.send(
      new PutCommand({
        TableName: TableNames.users,
        Item: { ...rest, passwordHash } satisfies User,
      })
    );
    console.log(`[seed] user ${u.username} (${u.role})`);
  }
}

async function seedDevices() {
  const devices: Device[] = [
    { deviceId: 'DEV-001', factoryId: 'FAC-001', name: 'Fermenter Line A' },
    { deviceId: 'DEV-002', factoryId: 'FAC-002', name: 'Fermenter Line B' },
  ];
  for (const d of devices) {
    await ddb.send(new PutCommand({ TableName: TableNames.devices, Item: d }));
    console.log(`[seed] device ${d.deviceId}`);
  }
}

async function seedBatches() {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const completedBatches: Batch[] = Array.from({ length: 10 }).map((_, i) => {
    const completedAt = new Date(now - (i + 1) * dayMs * 2).toISOString();
    const startedAt = new Date(now - (i + 1) * dayMs * 2 - 3 * 60 * 60 * 1000).toISOString();
    const readyAt = new Date(now - (i + 1) * dayMs * 2 - 4 * 60 * 60 * 1000).toISOString();
    const createdAt = new Date(now - (i + 1) * dayMs * 2 - 5 * 60 * 60 * 1000).toISOString();
    return {
      batchId: `BATCH-H${String(i + 1).padStart(3, '0')}`,
      factoryId: i < 7 ? 'FAC-001' : 'FAC-002',
      deviceId: i % 2 === 0 ? 'DEV-001' : 'DEV-002',
      status: 'COMPLETED',
      goodLeafPercentage: 70 + Math.floor(Math.random() * 25),
      sellingPrice: 1200 + Math.floor(Math.random() * 1800),
      createdAt,
      readyPhaseStartedAt: readyAt,
      startedAt,
      completedAt,
    };
  });

  for (const b of completedBatches) {
    await ddb.send(new PutCommand({ TableName: TableNames.batches, Item: b }));
  }

  const ongoing: Batch = {
    batchId: 'BATCH-LIVE01',
    factoryId: 'FAC-001',
    deviceId: 'DEV-001',
    status: 'ONGOING',
    goodLeafPercentage: 85,
    createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
    readyPhaseStartedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    startedAt: new Date(now - 90 * 60 * 1000).toISOString(),
  };
  await ddb.send(new PutCommand({ TableName: TableNames.batches, Item: ongoing }));
  await ddb.send(
    new PutCommand({
      TableName: TableNames.devices,
      Item: {
        deviceId: 'DEV-001',
        factoryId: 'FAC-001',
        name: 'Fermenter Line A',
        activeBatchId: ongoing.batchId,
      } satisfies Device,
    })
  );
  console.log(`[seed] batches: ${completedBatches.length} completed + 1 ongoing`);

  console.log('[seed] generating readings for live batch');
  const liveStart = new Date(ongoing.startedAt!).getTime();
  const readings: Reading[] = [];
  for (let i = 0; i < 40; i++) {
    const ts = new Date(liveStart + i * 2 * 60 * 1000).toISOString();
    readings.push({
      deviceId: ongoing.deviceId,
      timestamp: ts,
      temperature: 24 + Math.sin(i / 4) * 2 + Math.random() * 0.6,
      rgRatio: 40 + Math.sin(i / 6) * 4 + Math.random(),
      mq137: 120 + Math.cos(i / 5) * 25 + Math.random() * 5,
      tgs2620: 400 + Math.sin(i / 5) * 35 + Math.random() * 10,
      tgs822: 380 + Math.cos(i / 4) * 30 + Math.random() * 10,
      batchId: ongoing.batchId,
    });
  }
  for (const r of readings) {
    await ddb.send(
      new PutCommand({
        TableName: TableNames.readings,
        Item: {
          DEVICE_ID: r.deviceId.replace(/-/g, ''),
          TIMESTAMP: r.timestamp,
          TYPE: 'SENSOR',
          FACTORY_ID: ongoing.factoryId.replace('-', ''),
          BATCH_ID: r.batchId,
          RG_RATIO: r.rgRatio,
          TEMPERATURE: r.temperature,
          MQ137: r.mq137,
          TGS2620: r.tgs2620,
          TGS822: r.tgs822,
        },
      })
    );
  }
  console.log(`[seed] readings: ${readings.length}`);
}

async function run() {
  console.log('[seed] starting — this drops & recreates tables');

  await dropIfExists(TableNames.readings);
  await dropIfExists(TableNames.batches);
  await dropIfExists(TableNames.devices);
  await dropIfExists(TableNames.users);

  await createReadingsTable();
  await createSimpleTable(TableNames.batches, 'batchId');
  await createSimpleTable(TableNames.devices, 'deviceId');
  await createSimpleTable(TableNames.users, 'userId');

  await seedUsers();
  await seedDevices();
  await seedBatches();

  console.log('[seed] done');
  console.log('');
  console.log('Demo credentials:');
  console.log('  officer1 / pass123   (OFFICER, FAC-001)');
  console.log('  manager1 / pass123   (MANAGER, FAC-001)');
  console.log('  gm1      / pass123   (GENERAL_MANAGER, FAC-HQ)');
}

run().catch((err) => {
  console.error('[seed] failed', err);
  process.exit(1);
});
