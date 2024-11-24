import { type IApiOptions } from '@furo/open-models/dist/Fetcher';

/**
 * Set the API OPTIONS.
 */
export const API_OPTIONS: IApiOptions = {
  serverAddr: '', // Set the serverAddr, if you need to address the API on a different host.
  ApiBaseURL: '/api',
  headers: new Headers({ 'Content-Type': 'application/json' }),
  timeout: 3000, // Timeout for requests.
  PreserveProtoNames: false,
};
