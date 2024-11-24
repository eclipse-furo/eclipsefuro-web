import './BusinessValidators';
import './CustomPrototypes';

interface IApiOptions {
  // leave empty to connect to the same host which delivers your files, otherwise set something like http://localhost:3000
  serverAddr: string;
  ApiBaseURL: string;
  headers?: Headers;
  timeout?: number;
}

const API_OPTIONS: IApiOptions = {
  serverAddr: '',
  ApiBaseURL: '/api',
  headers: new Headers({ 'Content-Type': 'application/json' }),
  // timeout: 3000
};

export { API_OPTIONS };
