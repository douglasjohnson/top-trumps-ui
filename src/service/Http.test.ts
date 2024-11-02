import Http from './Http';
import { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

describe('Http', () => {
  let fulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  let initialConfig: InternalAxiosRequestConfig;
  beforeEach(() => {
    const request = Http.interceptors.request;
    // @ts-expect-error handlers not available on interface
    fulfilled = request.handlers[0].fulfilled;
    initialConfig = { headers: {} as AxiosHeaders };
  });
  afterEach(() => {
    localStorage.clear();
  });
  it('should add authentication header from token in local storage', () => {
    localStorage.setItem('token', 'SampleToken');
    const config = fulfilled(initialConfig);

    expect(config).toEqual({ headers: { Authorization: 'Bearer SampleToken' } });
  });
  it('should not add authentication header when token not available', () => {
    const config = fulfilled(initialConfig);

    expect(config).toEqual({ headers: {} });
  });
});
