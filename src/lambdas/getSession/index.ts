import { extractDataFromRequest, getError, successResponse } from '../../utils';
import { GetSessionInput, schema } from './schema';
import { getSession as getSessionCmd } from '../../ddbActions';
import { ddbGet } from '../../services/dynamodbServices';
import { Session, Stats } from '../../types';
import { APIGatewayProxyEvent } from 'aws-lambda';

const getSessionFromStats = ({sessionId,totalModulesStudied,averageScore,timeStudied}: Stats): Session => ({
  sessionId,
  totalModulesStudied,
  averageScore,
  timeStudied,
})

export const handler = async(event: APIGatewayProxyEvent) => {
  try {
    const { courseId, sessionId, userId } = extractDataFromRequest<GetSessionInput>(event, schema);

    console.log('getSession: userId', userId);

    console.log('getSession: courseId', courseId);

    console.log('getSession: sessionId', sessionId);

    // TODO: update type to not use base response but the expected type
    const response = await ddbGet<Stats>(getSessionCmd(userId, courseId, sessionId));

    console.log('getSession: response', response);
    
    if (!response) {
      throw getError("Session not found.", 404);
    }

    return successResponse(200, getSessionFromStats(response));
  } catch (e) {
    throw e;
  }
}