// import * as core from "@aws-cdk/core";
// import { Function, Runtime, Code } from "@aws-cdk/aws-lambda";
// import { LambdaIntegration } from "@aws-cdk/aws-apigateway";

// export const lambda = (serviceRef: core.Construct) => {
//   const handler = new Function(serviceRef, "SenecaHandler", {
//     runtime: Runtime.NODEJS_12_X,
//     code: Code.fromAsset("src"),
//     handler: "handler.main",
//   });
//   const recordSession = new LambdaIntegration(handler);
// }
export const noop = () => {}