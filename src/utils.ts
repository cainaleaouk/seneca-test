import { APIGatewayProxyEvent, APIGatewayProxyEventHeaders, APIGatewayProxyResult } from "aws-lambda"
import { Headers, LambdaSchema, Optional } from "./types";

export const getError = (message: string, statusCode: number = 500, data?: Record<string, any>): APIGatewayProxyResult => ({
    statusCode,
    body: JSON.stringify({
      message,
      data,
    }),
    headers: {
      'Content-Type': 'application/json', 
    },
});

export const successResponse = (statusCode: number = 200, data?: Record<string, any>): APIGatewayProxyResult => ({
    statusCode,
    body: JSON.stringify({ data }),
});

export const getUserId = (headers: Headers): Optional<string> => headers['X-User-Id'];

// TODO: There's probably a lib to deal with this, switch to using that instead.

// TODO: For now this will assume everything in the schema is required, might want to change that
// Also we don't care if the user sends extra info in the body, if we are not consuming it.
const validateBody = (body: Record<string, any>, bodySchema: Record<string, string>): boolean => {
  const schemaKeys = Object.keys(bodySchema);

  for (let i = 0; i < schemaKeys.length; i++) {
    const key = schemaKeys[i];
    const expectedValueType = bodySchema[key];
    const value = body[key];

    console.log('validateBody: key', key);
    console.log('validateBody: expectedValueType', expectedValueType);
    console.log('validateBody: value', value);
    console.log('validateBody: typeof value', typeof value);

    if (value === undefined || value && typeof value !== expectedValueType) {
      return false;
    }
  }

  return true;
}

const validateHeaders = (headersSchema:Record<string, string>, headers: APIGatewayProxyEventHeaders): {headers: Record<string, string>, isValid: boolean} => {
  console.log('validateHeaders: headersSchema', headersSchema);
  console.log('validateHeaders: headers', headers);

  const schemaKeys = Object.keys(headersSchema);

  let outHeaders: Record<string, string> = {};

  let missingHeaders: string[] = [];

  for (let i = 0; i < schemaKeys.length; i++) {
    const key = schemaKeys[i];
    const outKey = headersSchema[key];
    const value = headers[key];

    console.log('validateHeaders: key', key);
    console.log('validateHeaders: outKey', outKey);
    console.log('validateHeaders: value', value);

    if (!value) {
      missingHeaders.push(key);
      // Do continue so we can get all the wrong headers instead of returning just the first error
      continue;
    }
    outHeaders[outKey] = value;
  }

  console.log('validateHeaders: missingHeaders', missingHeaders);
  console.log('validateHeaders: outHeaders', outHeaders);
  console.log('validateHeaders: isValid', missingHeaders.length === 0);

  return {
    isValid: missingHeaders.length === 0,
    headers: missingHeaders.length === 0 ? outHeaders : missingHeaders.reduce((res, cur) => ({...res, [cur]: undefined}), {}),
  };
}

export const extractDataFromRequest = <T>(event: APIGatewayProxyEvent, schema: LambdaSchema): T => {

  const data: any = {};

  if (schema.body) {
    try {
      const { body } = event;

      if (!body) {
        throw getError("Request body is undefined.", 400);
      }

      console.log('extractDataFromRequest: body', body);
      console.log('extractDataFromRequest: typeof body', typeof body);

      const bodyObj = typeof body === 'object' ? body : JSON.parse(body);

      console.log('extractDataFromRequest: bodyObj', bodyObj);

      if (!validateBody(bodyObj, schema.body)) {
        // TODO: get info why the body fail to validate to enhance error message
        throw getError("Request body malformed.", 400);  
      }

      data.body = bodyObj;
    }
    catch(e) {
      throw e;
    }
  }

  if (schema.pathParams) {
    // TODO: doesn't need validation since the function is called by the path
    const { pathParameters } = event;

    if (!pathParameters) {
      // Should never get here, unless we setup something wrong?
      throw getError("Unexpected error with pathParameters", 500);
    }

    schema.pathParams.forEach(param => {
      data[param] = pathParameters[param];
    });
  }

  if (schema.headers) {
    const { isValid, headers } = validateHeaders(schema.headers, event.headers);
    if (!isValid) {
      throw getError("Request headers malformed", 400, headers);
    }

    Object.keys(headers).forEach(header => {
      data[header] = headers[header];
    });
  }

  return data as T;
}