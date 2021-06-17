import { QueryCommand, PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall }  from "@aws-sdk/util-dynamodb";
import { Session } from "./types";

/**
 * @deprecated use `getSession` instead that accesses ddb by getItem which is O(1)
 */
export const getSessionQuery = (userId: string, courseId: string, sessionId: string) => 
  new QueryCommand({
    TableName: 'stats',
    KeyConditionExpression: `userId = :userId AND statsId = :statsId`,
    ExpressionAttributeValues: {
      ':userId': {S: userId},
      ':statsId': {S: `${courseId}:${sessionId}` }
    }
  });

export const getCourseStatsQuery = (userId: string, courseId: string) => 
  new QueryCommand({
    TableName: 'stats',
    KeyConditionExpression: `userId = :userId AND begins_with(statsId, :courseId)`,
    ExpressionAttributeValues: {
      ':userId': {S: userId},
      ':courseId': {S: `${courseId}:` }
    }
  });

export const putSession = (userId: string, courseId: string, sessionData: Session) => 
  new PutItemCommand({
    TableName: 'stats',
    Item: marshall({
      userId,
      statsId: `${courseId}:${sessionData.sessionId}`,
      ...sessionData,
    })
  });

export const getSession = (userId: string, courseId: string, sessionId: string) => 
  new GetItemCommand({
    TableName: 'stats',
    Key: {
      'userId': {S: userId},
      'statsId': {S: `${courseId}:${sessionId}` }
    },
  });