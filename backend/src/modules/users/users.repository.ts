import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, TableNames } from '../../config/db';
import { User } from '../../types';

export const usersRepository = {
  async getById(userId: string): Promise<User | null> {
    const res = await ddb.send(
      new GetCommand({ TableName: TableNames.users, Key: { userId } })
    );
    return (res.Item as User) ?? null;
  },

  async getByUsername(username: string): Promise<User | null> {
    const res = await ddb.send(
      new ScanCommand({
        TableName: TableNames.users,
        FilterExpression: 'username = :u',
        ExpressionAttributeValues: { ':u': username },
      })
    );
    const item = res.Items?.[0];
    return (item as User) ?? null;
  },

  async create(user: User): Promise<User> {
    await ddb.send(new PutCommand({ TableName: TableNames.users, Item: user }));
    return user;
  },

  async list(): Promise<User[]> {
    const res = await ddb.send(new ScanCommand({ TableName: TableNames.users }));
    return (res.Items as User[]) ?? [];
  },
};
