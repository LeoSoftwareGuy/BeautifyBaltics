/* eslint-disable max-classes-per-file */
import * as qs from 'qs';

import {
  BadRequestApiError,
  NotFoundApiError,
  ServerErrorApiError,
  UnprocessableEntityApiError,
} from './errors';
import { StatusCodes } from './status-codes';
import { ProblemDetails, ValidationProblemDetails } from './types';
import utils from './utils';

export type ApiClientRequest = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, any>;
  headers?: Record<string, any>;
  data?: any;
  signal?: AbortSignal;
  responseType?: 'json' | 'blob';
};

export const apiClient = async <T>({
  url,
  method,
  params,
  data,
  headers,
  responseType,
  signal,
}: ApiClientRequest): Promise<T> => {
  const requestHeaders: HeadersInit = new Headers();

  if (headers?.['Content-Type'] === 'application/json') {
    requestHeaders.set('Content-Type', 'application/json');
  }

  let requestURL = url;
  if (params) requestURL = `${url}?${qs.stringify(params)}`;

  const response = await fetch(requestURL, {
    method,
    signal,
    headers: requestHeaders,
    body: headers?.['Content-Type'] === 'application/json' ? JSON.stringify(data) : data,
  });

  if (response.status >= 400 && response.status < 500) {
    const text = await response.text();
    if (response.status === StatusCodes.UnprocessableEntity) {
      const content = JSON.parse(text) as ValidationProblemDetails;
      throw new UnprocessableEntityApiError(content.errors);
    } else {
      const content = JSON.parse(text) as ProblemDetails;
      if (response.status === StatusCodes.NotFound) throw new NotFoundApiError(content.detail);
      throw new BadRequestApiError(content.detail ?? content.title);
    }
  }
  if (response.status >= 500) throw new ServerErrorApiError();

  if (responseType === 'blob') return await response.blob() as unknown as T;

  const text = await response.text();
  if (text.length === 0) return {} as T;
  return utils.convertDates(JSON.parse(text)) as T;
};
