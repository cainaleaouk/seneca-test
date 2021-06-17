import * as cdk from '@aws-cdk/core';
import { SenecaService } from './SenecaService';

export class SenecaCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new SenecaService(this, 'SenecaService');
  }
}
