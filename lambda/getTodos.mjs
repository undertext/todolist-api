import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const getTodos = async (event) => {

  const userId = event.requestContext.authorizer?.claims['cognito:username'] ?? 'root';
  const nextToken = event.queryStringParameters?.nextToken;

  const command = new QueryCommand({
    TableName: process.env.TODOLIST_TABLE_NAME,
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: {
      ':pk': `user#${userId}`,
    },
    Limit: 10,
    // base64 encoded string
    ExclusiveStartKey: nextToken ? JSON.parse(Buffer.from(nextToken, 'base64').toString('utf-8')) : undefined,
  });
  const result = await docClient.send(command);
  const todos = result.Items.map((item) => {
    return {
      id: item.SK,
      name: item.name,
      description: item.description,
    };
  });
  return {
    statusCode: 200,
    body: JSON.stringify({
      todos,
      nextToken: result.LastEvaluatedKey ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64') : undefined,
    }),
  };

};
