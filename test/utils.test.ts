import { datatype, random } from 'faker';
import { extractDataFromRequest } from '../src/utils';
import { getAPIGatewayEvent } from './fixtures';

describe('utils', () => {

  it(`should extract the values correctly when calling 'extractDataFromRequest'`, () => {

    const headerValue = random.word();

    // TODO: just realised while testing the function doesn't do a deep validation (hence using a lib for it)
    const schema = {
      body: {
        number: 'number',
        string: 'string',
        boolean: 'boolean',
        array: 'object',
        object: 'object',
      }, 
      headers: {
        'test': 'testHeader',
      },
      pathParams: [
        'param1',
        'param2'
      ]
    }

    const requestBody = {
      number: datatype.number(),
      string: random.word(),
      boolean: datatype.boolean(),
      array: [],
      object: {},
    }

    const param1Val = random.word();
    const param2Val = random.word();

    const event = getAPIGatewayEvent({
      body: JSON.stringify(requestBody),
      headers: {
        test: headerValue,
      },
      pathParameters: {
        param1: param1Val,
        param2: param2Val,
      }
    })
    
    const { body, testHeader, param1, param2 } = extractDataFromRequest(event, schema);

    expect(body).toEqual(requestBody);
    expect(testHeader).toEqual(headerValue);
    expect(param1).toEqual(param1Val);
    expect(param2).toEqual(param2Val);
  });
});