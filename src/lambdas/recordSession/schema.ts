import { LambdaSchema, Session } from "../../types";

export const schema: LambdaSchema = {
  body: {
    averageScore: 'number',
    sessionId: 'string',
    timeStudied: 'number',
    totalModulesStudied: 'number',    
  },
  pathParams: [
    'courseId',
  ],
  headers: {
    'X-User-Id': 'userId',
  }
}

export interface RecordSessionInput {
  body: Session;
  courseId: string;
  userId: string;
}
