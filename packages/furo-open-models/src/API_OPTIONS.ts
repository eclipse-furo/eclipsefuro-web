import { IApiOptions } from './Fetcher';

/**
 * To set the API OPTIONS you should update this const, before you create new services
 */
export const API_OPTIONS: IApiOptions = {
  serverAddr: '',
  ApiBaseURL: '/api',
  headers: new Headers({ 'Content-Type': 'application/json' }),
  // timeout: 3000
  PreserveProtoNames: false,
};
