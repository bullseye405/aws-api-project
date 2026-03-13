import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  console.log('[hello.ts lambda handler]');
  const tableName = process.env.TABLE_NAME;

  const command = new UpdateCommand({
    TableName: tableName,
    Key: { id: 'site' },
    UpdateExpression: 'ADD hits :inc',
    ExpressionAttributeValues: { ':inc': 1 },
    ReturnValues: 'UPDATED_NEW',
  });

  const response = await docClient.send(command);
  const count = response.Attributes?.hits || 0;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: `Hello! You are visitor number ${count}.`,
      count,
    }),
  };
};
