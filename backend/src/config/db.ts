import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { env } from './env';

// ✅ CLOUD NATIVE: The 'credentials' block is completely removed.
// AWS Lambda's IAM Role automatically injects secure, temporary keys in the background.
const client = new DynamoDBClient({
  // AWS Lambda automatically sets process.env.AWS_REGION, but keep  env fallback
  region: env.AWS_REGION || process.env.AWS_REGION || 'us-east-1',
  
  // Kept  to test with DynamoDB-Local again
  ...(env.DYNAMODB_ENDPOINT ? { endpoint: env.DYNAMODB_ENDPOINT } : {}),
});

export const ddb = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

export const rawClient = client;

export const TableNames = {
  readings: env.TABLE_READINGS,
  batches: env.TABLE_BATCHES,
  devices: env.TABLE_DEVICES,
  users: env.TABLE_USERS,
};
