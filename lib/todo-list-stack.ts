import {Construct} from 'constructs';
import {Stack, StackProps} from 'aws-cdk-lib';
import {AddTodoToDynamodbLambda} from "./constructs/add-todo-to-dynamodb-lambda";
import {TodosApiGateway} from "./constructs/todos-api-gateway";
import {TodoListTable} from "./constructs/todolist-table";
import {CognitoUserPool} from "./constructs/cognito-user-pool";
import {GetTodosLambda} from "./constructs/get-todos-lambda";

export class TodoListStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const cognitoUserPool = new CognitoUserPool(this, 'todolist-user-pool');

        const todoListTable = new TodoListTable(this, 'todolist-table');

        const addTodoToDynamodbLambda = new AddTodoToDynamodbLambda(this, 'add-todo', {
            table: todoListTable.table,
        });
        const getTodosLambda = new GetTodosLambda(this, 'get-todos', {table: todoListTable.table});
        const todosApiGateway = new TodosApiGateway(this, 'todos-api-gateway', {
            userPool: cognitoUserPool.userPool,
            addTodoLambda: addTodoToDynamodbLambda.lambdaFunction,
            getTodosLambda: getTodosLambda.lambdaFunction
        });

    }
}
