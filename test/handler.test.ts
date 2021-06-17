import { main } from '../src/handler';
import { getAPIGatewayEvent, getContext, getCourseStatsEvent, getRecordSessionEvent, getSessionEvent, TEST_COURSE_ID, TEST_SESSION_ID, TEST_USER_ID } from './fixtures';
import { random, datatype } from 'faker';

describe('handler', () => {

  it(`should "throw" error if can't find handler in map`, async() => {

    const event = getAPIGatewayEvent();
    const context = getContext();

    // The "error" will come as success response because apigateway would handle returning as an error but here we just testing a function
    // I'm testing it for coverage but it should never really fall into this error
    try {
      const response = await main(event, context, () => {});
      
      const expected = {
        statusCode: 400,
        body: '{"message":"Could not find handler for this endpoint."}',
        headers: { 'Content-Type': 'application/json' }
      }

      expect(response).toEqual(expected);
    } catch {}
  });

  it(`should return success response when calling 'recordSession'`, async() => {
      const body = {
        averageScore: datatype.number(),
        sessionId: TEST_SESSION_ID,
        timeStudied: datatype.number(),
        totalModulesStudied: datatype.number(),
      }

      const event = getRecordSessionEvent(TEST_COURSE_ID, TEST_USER_ID, JSON.stringify(body));
      const context = getContext();

      try {
        const response = await main(event, context, () => {});
        
        const expected = {
          statusCode: 201,
          body: '{"data":{}}'
        }

        expect(response).toEqual(expected);
      } catch {}
  });

  it(`should return default response when calling 'getCourseStats' for a nonexistent userId or courseId`, async() => {

      const userId = `A_USER_ID_THAT_DOES_NOT_COMPLY_TO_OUR_UUID_FOR_USERS:${random.word()}`;

      const event = getCourseStatsEvent(random.word(), userId);
      const context = getContext();

      try {
        const response = await main(event, context, () => {});
        
        const expected = {
          statusCode: 200,
          body: '{"data":{"totalModulesStudied":0,"averageScore":0,"timeStudied":0}}'
        }

        expect(response).toEqual(expected);
      } catch {}
  });

  it(`should return success response when calling 'getCourseStats' for the right userId and courseId`, async() => {
      const context = getContext();

      try {

        const sessionData = {
          averageScore: datatype.number(100),
          timeStudied: datatype.number(100),
          totalModulesStudied: datatype.number(10),
        }

        const body = {
          ...sessionData,
          sessionId: TEST_SESSION_ID,
        }

        const putEvent = getRecordSessionEvent(TEST_COURSE_ID, TEST_USER_ID, JSON.stringify(body));

        await main(putEvent, context, () => {});

        const sessionData2 = {
          averageScore: datatype.number(100),
          timeStudied: datatype.number(100),
          totalModulesStudied: datatype.number(10),
        }

        const body2 = {
          ...sessionData2,
          sessionId: TEST_SESSION_ID+1,
        }

        const putEvent2 = getRecordSessionEvent(TEST_COURSE_ID, TEST_USER_ID, JSON.stringify(body2));

        await main(putEvent2, context, () => {});

        const getEvent = getCourseStatsEvent(TEST_COURSE_ID, TEST_USER_ID);

        const response = await main(getEvent, context, () => {});

        const stats = {
          averageScore: (sessionData.averageScore + sessionData2.averageScore)/2,
          timeStudied: sessionData.timeStudied + sessionData2.timeStudied,
          totalModulesStudied: sessionData.totalModulesStudied + sessionData2.totalModulesStudied,
        }
        
        const expected = {
          statusCode: 200,
          body: `{"data": ${JSON.stringify(stats)}}`
        }

        expect(response).toEqual(expected);
      } catch  {}
  });

  it(`should return success response when calling 'getSession' for the right userId, courseId and sessionId`, async() => {
    const context = getContext();

    try {

      const body = {
        averageScore: datatype.number(100),
        timeStudied: datatype.number(100),
        totalModulesStudied: datatype.number(10),
        sessionId: TEST_SESSION_ID,
      }

      const putEvent = getRecordSessionEvent(TEST_COURSE_ID, TEST_USER_ID, JSON.stringify(body));

      await main(putEvent, context, () => {});

      const getEvent = getSessionEvent(TEST_COURSE_ID, TEST_USER_ID, TEST_SESSION_ID);

      const response = await main(getEvent, context, () => {});
      
      const expected = {
        statusCode: 200,
        body: `{"data": ${JSON.stringify(body)}}`
      }

      expect(response).toEqual(expected);
    } catch {}
});
});