import { APIGatewayProxyEvent } from 'aws-lambda';
import { getCourseStatsQuery } from '../../ddbActions';
import { ddbQuery } from '../../services/dynamodbServices';
import { CourseStats, Stats } from '../../types';
import { extractDataFromRequest, successResponse } from '../../utils';
import { GetCourseStatsInput, schema } from './schema';


const getAverageScore = (totalScore: number, numberOfScores: number): number =>
  totalScore/numberOfScores;


export const handler = async(event: APIGatewayProxyEvent) => {

  try {
    const { courseId, userId } = extractDataFromRequest<GetCourseStatsInput>(event, schema);

    console.log('getCourseStats: userId', userId);

    console.log('getCourseStats: courseId', courseId);

    const response = await ddbQuery<Stats>(getCourseStatsQuery(userId, courseId));

    // I'm not sure if looking for a courseId that you have no stats should return 404 or default stats, I chose to go with default
    const courseStats: CourseStats = {
      totalModulesStudied: 0,
      averageScore: 0,
      timeStudied: 0,
    }

    // TODO: This will return default values if the user id doesn't exist, we might want to handle that differently
    

    console.log('getCourseStats: response', response);

    // TODO: Move the aggregation data functionality to its own function
    // This filter is here because I've created a lot of "noisy" data where those info could be undefined
    // TODO: remove the filter once ddb data is clean and do the operation directly on response;
    const validEntries = response.filter(({totalModulesStudied, averageScore, timeStudied}) => 
        totalModulesStudied !== undefined && averageScore !== undefined && timeStudied !== undefined
    );

    if (validEntries.length > 0) {
        validEntries.forEach(({totalModulesStudied, averageScore, timeStudied}) => {
          courseStats.totalModulesStudied += Number(totalModulesStudied);
          courseStats.averageScore += Number(averageScore);
          courseStats.timeStudied += Number(timeStudied);
        });

        // I assumed the `avarageScore` is normalised and avg can be calculated by mean avg
        courseStats.averageScore = getAverageScore(courseStats.averageScore, validEntries.length);
    }

    console.log('getCourseStats: courseStats', courseStats);
    
    return successResponse(200, courseStats);
  } catch (e) {
    throw e;
  }
}