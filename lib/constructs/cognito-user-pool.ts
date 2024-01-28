import {Construct} from "constructs";
import * as cognito from 'aws-cdk-lib/aws-cognito';
import {Duration, Names} from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";

export class CognitoUserPool extends Construct {
    public userPool: cognito.UserPool;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.userPool = new cognito.UserPool(this, id, { //(1)
            signInAliases: {email: true},
            selfSignUpEnabled: false,
        });
        const callbackUrls = [];
        callbackUrls.push('http://localhost:3000');
        const domainId = this.userPool.node.addr;
        const domain = this.userPool.addDomain(`${id}-hosted-ui`, { //(2)
            cognitoDomain: {
                domainPrefix: `${domainId}-hosted-ui`
            }
        });
        const client = this.userPool.addClient(`${id}-client`, { //(3)
            oAuth: {
                flows: {
                    implicitCodeGrant: true
                },
                callbackUrls: callbackUrls,
            },
            idTokenValidity: Duration.hours(8),
            accessTokenValidity: Duration.hours(8),
        });
        new cdk.CfnOutput(this, 'CognitoSignInUrl', { //(4)
            value: domain.signInUrl(client, {
                redirectUri: callbackUrls[0]
            }),
        });
    }
}