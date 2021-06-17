import { random } from 'faker';
import { getCourseStatsQuery, putSession, getSession as getSessionCmd } from '../src/ddbActions';
import { getSession } from './fixtures';

const TableName = 'stats';

describe('The dynamoDB actions', () => {

  it(`should return the correct 'QueryCommand' when calling 'getCourseStatsQuery'`, () => {
    const userId = random.word();
    const courseId = random.word();
    
    const query = getCourseStatsQuery(userId, courseId);

    expect(query.input).toEqual({
      TableName,
      KeyConditionExpression: 'userId = :userId AND begins_with(statsId, :courseId)',
      ExpressionAttributeValues: { ':userId': { 'S': userId }, ':courseId': {'S': `${courseId}:` } }
    });
  });

  it(`should return the correct 'PutItemCommand' when calling 'putSession'`, () => {
    const userId = random.word();
    const courseId = random.word();
    const session = getSession();
    
    const query = putSession(userId, courseId, session);

    expect(query.input).toEqual({
      TableName,
      Item: {
        userId: {S: userId},
        statsId: {S: `${courseId}:${session.sessionId}` },
        averageScore: {N: session.averageScore.toString()},
        sessionId: {S: session.sessionId},
        timeStudied: {N: session.timeStudied.toString()},
        totalModulesStudied: {N: session.totalModulesStudied.toString()},
      }
    });
  });

  it(`should return the correct 'GetItemCommand' when calling 'getSession'`, () => {
    const userId = random.word();
    const courseId = random.word();
    const sessionId = random.word();
    
    const query = getSessionCmd(userId, courseId, sessionId);

    expect(query.input).toEqual({
      TableName,
      Key: {
        'userId': {S: userId},
        'statsId': {S: `${courseId}:${sessionId}` }
      },
    });
  });
    
});
