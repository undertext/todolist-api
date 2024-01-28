import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const addTodoToDynamoDB = async (event) => {
  const timestamp = (new Date()).getTime();
  const body = JSON.parse(event.body);
  const userId = event.requestContext.authorizer?.claims['cognito:username'] ?? 'root';

  const todoItem = {
    PK: `user#${userId}`,
    SK: `todo#${timestamp}`,
    name: body.name,
    description: body.description,
  };

  const command = new PutCommand({
    TableName: process.env.TODOLIST_TABLE_NAME,
    Item: todoItem,
  });

  await docClient.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({
      id: todoItem.SK,
      name: todoItem.name,
      description: todoItem.description
    }),
  };
};
