import { APIGatewayProxyEvent } from 'aws-lambda';
import { putSession } from '../../ddbActions';
import { ddbPut } from '../../services/dynamodbServices';
import { extractDataFromRequest, successResponse } from '../../utils';
import { RecordSessionInput, schema } from './schema';

export const handler = async(event: APIGatewayProxyEvent) => {

  try {
    const { body, courseId,  userId } = extractDataFromRequest<RecordSessionInput>(event, schema);
    
    console.log('recordSession: userId', userId);

    console.log('recordSession: courseId', courseId);

    console.log('recordSession: sessionId', body.sessionId);

    console.log('recordSession: body', body);

    const response = await ddbPut(putSession(userId, courseId, body));

    console.log('recordSession: response', response);

    return successResponse(201);
  } catch (e) {
    throw e;
  }
}