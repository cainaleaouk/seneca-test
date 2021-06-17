import * as core from "@aws-cdk/core";
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { apigateway } from "../resources/apigateway";


export class SenecaService extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id);

    const table = new dynamodb.Table(this, 'Stats', {
      partitionKey: {
        name: 'userId',
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: 'statsId',
        type: dynamodb.AttributeType.STRING
      },
      tableName: 'stats',
      removalPolicy: core.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    const { lambda } = apigateway(this);

    // TODO: Could use different lambda handlers to control table access (needs to refactor the lambdas config first)
    table.grantReadWriteData(lambda);
  }
}

