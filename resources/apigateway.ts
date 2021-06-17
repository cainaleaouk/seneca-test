import * as core from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import { RestApi,LambdaIntegration } from "@aws-cdk/aws-apigateway";

export const apigateway = (serviceRef: core.Construct) => {
  const handler = new lambda.Function(serviceRef, "SenecaHandler", {
    runtime: lambda.Runtime.NODEJS_12_X,
    code: lambda.Code.fromAsset("src"),
    handler: "handler.main",
  });

  // TODO: This won't work rn because of how things are packaged. Refactor it so each lambda is a reusable package
  // const getSessionHandler = new lambda.Function(serviceRef, "getSessionHandler", {
  //   runtime: lambda.Runtime.NODEJS_12_X,
  //   code: lambda.Code.fromAsset("src"),
  //   handler: "lambdas/getSession/index.handler",
  // });

  const api = new RestApi(serviceRef, "seneca-api", {
    restApiName: "Seneca Service",
    description: "This service serves seneca."
  });   

  const courses = api.root.addResource("courses"); // /courses
  const courseId = courses.addResource('{courseId}'); // /courses/{courseId}
  
  const recordSession = new LambdaIntegration(handler);
  courseId.addMethod("POST", recordSession); // POST courses/{courseId}
  
  const getCourse = new LambdaIntegration(handler);
  courseId.addMethod("GET", getCourse); // GET courses/{courseId}

  const sessions = courseId.addResource('sessions'); // /courses/{courseId}/sessions/
  const sessionId = sessions.addResource('{sessionId}'); // /courses/{courseId}/sessions/{sessionId}

  const getSession = new LambdaIntegration(handler);
  sessionId.addMethod("GET", getSession);// GET courses/{courseId}/sessions/{sessionId}

  return {
    lambda: handler,
  }
}