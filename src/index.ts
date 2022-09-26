import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import validator from '@middy/validator';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { Position } from './models';
import { findClosest } from './location';
import { parseData } from './csv';

export interface Input {
  location: Position;
}

type Event = Omit<APIGatewayProxyEvent, 'body'> & {
  body: any;
  rawBody: string;
};

export const lambdaHandler = async (
  event: Event,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event));
  const input = event.body as Input;
  const records = await parseData();
  const closest = findClosest(input.location, records);

  return {
    statusCode: 200,
    body: JSON.stringify(closest),
    headers: {
      'x-request-id': context.awsRequestId,
    },
  };
};

const eventSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        location: {
          type: 'object',
          properties: {
            longitude: { type: 'number' },
            latitude: { type: 'number' },
          },
        },
      },
      required: ['location'],
    },
  },
};

export const handler = middy()
  .use(jsonBodyParser())
  .use(validator({ eventSchema }))
  .use(httpErrorHandler())
  .handler(lambdaHandler);
