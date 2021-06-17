import { Session } from "../src/types";
import { datatype, random } from 'faker';
import { APIGatewayProxyEvent, Context } from "aws-lambda"

export const getSession = (session?: Partial<Session>): Session => ({
  averageScore: datatype.number(),
  sessionId: random.word(),
  timeStudied: datatype.number(),
  totalModulesStudied: datatype.number(),
  ...session,
});

export const getAPIGatewayEvent = (event?: Partial<APIGatewayProxyEvent>): APIGatewayProxyEvent => ({
  resource: "/assets",
  path: random.word(),
  httpMethod: 'GET',
  headers: {},
  queryStringParameters:  {
    query: "default"
  },
  pathParameters: {
    uuid: '1234'
  },
  stageVariables: {
    ENV: "test"
  },
  requestContext: {
    accountId: "1234",
    resourceId: "snmm5d",
    stage: "test-invoke-stage",
    requestId: "test-invoke-request",
    identity: {
      cognitoIdentityPoolId: null,
      accountId: "1234",
      cognitoIdentityId: null,
      caller: "1234",
      apiKey: "test-invoke-api-key",
      sourceIp: "test-invoke-source-ip",
      accessKey: "1234",
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: "arn:aws:iam::1234:user/test_user",
      userAgent: "Apache-HttpClient/4.5.x (Java/1.8.0)",
      user: "1234",
      apiKeyId: '', 
      clientCert: null, 
      principalOrgId: '',
    },
    resourcePath: random.word(),
    httpMethod: 'GET',
    apiId: "1234",
    authorizer: {
    }, 
    protocol: '', 
    path: '', 
    requestTimeEpoch: 0,
  },
  body: null,
  isBase64Encoded: false,
  multiValueHeaders: {

  },
  multiValueQueryStringParameters: null,
  ...event,
});

export const getContext = (context?: Context): Context => ({
    callbackWaitsForEmptyEventLoop: datatype.boolean(),
    functionName: random.word(),
    functionVersion: random.word(),
    invokedFunctionArn: random.word(),
    memoryLimitInMB: random.word(),
    awsRequestId: random.word(),
    logGroupName: random.word(),
    logStreamName: random.word(),
    getRemainingTimeInMillis: () => 0,
    done: (error?: Error, result?: any) => {},
    fail: (error: Error | string) => {},
    succeed: (messageOrObject: any) => {},
});

export const getCourseStatsEvent = (courseId: string, userId: string): APIGatewayProxyEvent => getAPIGatewayEvent({
    path: `/courses/${courseId}`,
    pathParameters: {
       courseId,
    },
    httpMethod: 'GET',
    headers: {
      'X-User-Id': userId,
    }
});

export const TEST_USER_ID = 'user@test.seneca';
export const TEST_COURSE_ID = 'courseId@test.seneca';
export const TEST_SESSION_ID = 'sessionId@test.seneca';

export const getRecordSessionEvent = (courseId: string, userId: string, body: string): APIGatewayProxyEvent => getAPIGatewayEvent({
  path: `/courses/${courseId}`,
  pathParameters: {
    courseId,
  },
  httpMethod: 'POST',
  headers: {
    'X-User-Id': userId,
  },
  body,
});

export const getSessionEvent = (courseId: string, userId: string, sessionId: string): APIGatewayProxyEvent => getAPIGatewayEvent({
  path: `/courses/${courseId}/sessions/${sessionId}`,
  pathParameters: {
    courseId,
    sessionId,
  },
  httpMethod: 'GET',
  headers: {
    'X-User-Id': userId,
  },
});