import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class HttpManager {
  private static instance: AxiosInstance | null = null;
  private static readonly defaultOptions: AxiosRequestConfig = {
    data: new FormData(),
  };

  public static getInstance(options: AxiosRequestConfig = {}): AxiosInstance {
    if (!HttpManager.instance) {
      HttpManager.instance = axios.create({
        ...HttpManager.defaultOptions,
        ...options,
      });
    }
    return HttpManager.instance;
  }
}

export default HttpManager;
