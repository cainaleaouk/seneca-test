import { DynamoDBClient, QueryCommand, PutItemCommand, QueryOutput, AttributeValue, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { BaseResponse, Optional } from "../types";
import { unmarshall }  from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });

// TODO: Replace this for `import { unmarshall }  from "@aws-sdk/util-dynamodb";`
const transformResponse = <T>(response: QueryOutput): T => {
    return response.Items?.map((item) => {
      const flattenedResponse = Object.keys(item).reduce((res, ddbKey) => {
        const attrValue = item[ddbKey];
        const attrValueKey = Object.keys(attrValue)[0] as keyof AttributeValue;
        return {
          ...res,
          [ddbKey]: attrValue[attrValueKey],
        }
      }, {}) as T & BaseResponse;

      console.log('transformResponse: flattenedResponse', flattenedResponse);

      const [courseId, sessionId] = flattenedResponse.statsId.split(':');
      console.log('transformResponse: courseId', courseId);
      console.log('transformResponse: sessionId', sessionId);

      return {
        ...flattenedResponse,
        courseId,
        sessionId,
      }
    }) as unknown as T & BaseResponse;
}

export const ddbGet = async<T>(query: GetItemCommand): Promise<Optional<T>> => {
  console.log('ddbGet: query', query);
  try {
    // const response = await ddbDocClient.send(query);
    const response = await client.send(query);
    console.log('ddbGet: response', response);
    return response.Item && unmarshall(response.Item) as unknown as T;
  } catch (e) {
    console.log('ddbGet: error', e);
    throw e;
  }
}

export const ddbQuery = async<T>(query: QueryCommand): Promise<T[]> => {
  console.log('queryDB: query', query);
  try {
    // const response = await ddbDocClient.send(query);
    const response = await client.send(query);
    console.log('queryDB: response', response);
    return transformResponse(response);
  } catch (e) {
    console.log('queryDB: error', e);
    throw e;
  }
}

export const ddbPut = async<T>(cmd: PutItemCommand): Promise<T> => {
  console.log('putDB: query', cmd);
  try {
    // const response = await ddbDocClient.send(query);
    const response = await client.send(cmd);
    console.log('putDB: response', response);
    return {} as unknown as T;
  } catch (e) {
    console.log('putDB: error', e);
    throw e;
  }
}

// Response example:
// [ { statsId: { S: '0:0' }, userId: { S: '1' } } ]