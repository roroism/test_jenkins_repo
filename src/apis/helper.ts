import { store } from '@app/src/store';
import { AxiosRequestConfig } from 'axios';
import { APIList, APIListParams } from './helper.model';

/**
 * Generate RESTful API header with auth token.
 */
export function getAuthHeader() {
  return {
    'X-Access-Token': store.getState().appAuth.token,
  };
}

export function createAuthConfig(config: AxiosRequestConfig = {}) {
  return {
    ...config,
    headers: {
      ...config.headers,
      'X-Access-Token': store.getState().appAuth.token,
    },
  };
}

export const DEFAULT_API_RES: APIList<any> = {
  data: [],
  pages: {
    current: 1,
    hasNext: false,
    hasPrev: false,
    next: 1,
    prev: 1,
    total: 1,
  },
  items: {
    begin: 0,
    end: 0,
    total: 0,
  },
};

export const stringifyParams = (params: APIListParams) => {
  return {
    ...params,
    filter: JSON.stringify(params.filter),
  };
};
