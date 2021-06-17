import { LambdaSchema } from "../../types";

export const schema: LambdaSchema = {
  body: undefined,
  pathParams: [
    'courseId',
  ],
  headers: {
    'X-User-Id': 'userId',
  }
}

export interface GetCourseStatsInput {
  courseId: string;
  userId: string;
}
