import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import {Construct} from "constructs";

export class AddTodoToDynamodbLambda extends Construct {
    public lambdaFunction: lambda.Function;
    constructor(scope: Construct, id: string, props: { table: dynamodb.TableV2 }) { //(1)
        super(scope, id);
        this.lambdaFunction = new lambda.Function(this, id, {
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'addTodoToDynamoDB.addTodoToDynamoDB',
            environment: {
                TODOLIST_TABLE_NAME: props.table.tableName, //(2)
            },
        });
        props.table.grantWriteData(this.lambdaFunction); //(3)
    }
}
