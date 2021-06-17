import { APIGatewayProxyEventHeaders, APIGatewayProxyEventPathParameters } from 'aws-lambda';

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export interface BaseResponse {
  statsId: string;
  userId: string;
};

export interface Session {
  averageScore: number;
  sessionId: string;
  timeStudied: number;
  totalModulesStudied: number;
}

export type Stats = BaseResponse & Session;

export type CourseStats = Omit<Session, 'sessionId'>;

type Body = Session;

export type Job<Response> = (headers: APIGatewayProxyEventHeaders, body?: Body, pathParams?: Nullable<APIGatewayProxyEventPathParameters>,) => Promise<Response>;

export interface Headers extends APIGatewayProxyEventHeaders {
  'X-User-Id'?: string;
}

export interface LambdaSchema {
  body?: Record<string, string>; 
  pathParams?: string[];
  headers?: Record<string, string>;
}

