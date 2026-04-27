import bcrypt from 'bcryptjs';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, TableNames } from '../config/db';
import { User } from '../types';

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

async function restoreUsers() {
  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const { password, ...rest } = user;

    await ddb.send(
      new PutCommand({
        TableName: TableNames.users,
        Item: { ...rest, passwordHash } satisfies User,
      })
    );

    console.log(`[restore-users] restored ${user.username}`);
  }

  console.log('[restore-users] done');
}

restoreUsers().catch((error) => {
  console.error('[restore-users] failed', error);
  process.exit(1);
});
