'use strict'

import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { Nullable } from './types';
import { getError } from './utils';

import { handler as getSession } from './lambdas/getSession';
import { handler as getCourseStats } from './lambdas/getCourseStats';
import { handler as recordSession } from './lambdas/recordSession';

type LambdaHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

type HandlersMap = {[path: string]: { [method: string]: LambdaHandler }};

const handlers: HandlersMap = {
  '/courses/courseId/sessions/sessionId': {
    GET:  getSession,
  },
  '/courses/courseId': {
    GET: getCourseStats,
    POST: recordSession,
  }
}

const getRoute = (path: string, pathParams: Nullable<APIGatewayProxyEventPathParameters>): string => {

  let route = path;

  if (pathParams) {
    Object.keys(pathParams).forEach((key) => {
      const value = pathParams[key]!;
      route = route.replace(value, key);   
    });
  }

  return route;
}

export const getHandler = (
  method: string,
  path: string, 
  pathParams: Nullable<APIGatewayProxyEventPathParameters>
) => {
  console.log('method', method);
  console.log('path', path);
  console.log('pathParams', pathParams);
  console.log('route', getRoute(path, pathParams));

  const handler = handlers[getRoute(path, pathParams)];
  return handler && handler[method];
}


export const main: APIGatewayProxyHandler = async (event) => {
  console.log('Received event', event);

  try { 
    const { httpMethod, path, pathParameters } = event;
    const handler = getHandler(httpMethod, path, pathParameters);

    // it should never get here because apigatway would error first
    if (!handler) {
      throw getError(`Could not find handler for this endpoint.`, 400);
    }

    const response = await handler(event);
    return response;
  } catch (e) {
    return e;
  } 
};
