import {Construct} from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cognito from "aws-cdk-lib/aws-cognito";

export class TodosApiGateway extends Construct {
    constructor(scope: Construct, id: string, props: {
        userPool: cognito.UserPool,
        addTodoLambda: lambda.Function,
        getTodosLambda: lambda.Function
    }) {
        super(scope, id);

        const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, `${id}-authorizer`, { //(1)
            cognitoUserPools: [props.userPool],
        });

        const api = new apigateway.RestApi(this, id);
        const todos = api.root.addResource('todos');
        todos.addMethod('POST', new apigateway.LambdaIntegration(props.addTodoLambda), { //(2)
            authorizer: authorizer
        });
        todos.addMethod('GET', new apigateway.LambdaIntegration(props.getTodosLambda), {
            authorizer: authorizer
        });
    }
}
