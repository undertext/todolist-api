import {Construct} from "constructs";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class TodoListTable extends Construct {
    public table: dynamodb.TableV2;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.table = new dynamodb.TableV2(this, id, {
            partitionKey: {name: 'PK', type: dynamodb.AttributeType.STRING},
            sortKey: {name: 'SK', type: dynamodb.AttributeType.STRING},
        });
    }
}
