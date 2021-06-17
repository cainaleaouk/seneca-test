import { LambdaSchema } from "../../types";

export const schema: LambdaSchema = {
  body: undefined,
  pathParams: [
    'courseId',
    'sessionId',
  ],
  headers: {
    'X-User-Id': 'userId',
  }
}

export interface GetSessionInput {
  courseId: string;
  sessionId: string;
  userId: string;
}
