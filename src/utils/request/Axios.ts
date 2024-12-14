import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import isFunction from 'lodash/isFunction';
import throttle from 'lodash/throttle';
import { stringify } from 'qs';

import { ContentTypeEnum } from '@/constants';
import { AxiosRequestConfigRetry, AxiosRequestConfigUrl, RequestOptions, Result } from '@/types/axios';
import { paths } from '@/types/schema';

import { AxiosCanceler } from './AxiosCancel';
import { CreateAxiosOptions } from './AxiosTransform';
import { DownloadError } from './DownloadError';

interface DownloadOptions extends RequestOptions {
  forceDownload?: boolean;
  openInNewTab?: boolean;
  revokeTimeout?: number;
}

/**
 * Axios 模块
 */
export class VAxios {
  /**
   * Axios实例句柄
   * @private
   */
  private instance: AxiosInstance;

  /**
   * Axios配置
   * @private
   */
  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.instance = axios.create(options);
    this.setupInterceptors();
  }

  /**
   * 创建Axios实例
   * @param config
   * @private
   */
  private createAxios(config: CreateAxiosOptions): void {
    this.instance = axios.create(config);
  }

  /**
   * 获取数据处理类
   * @private
   */
  private getTransform() {
    const { transform } = this.options;
    return transform;
  }

  /**
   * 获取Axios实例
   */
  getAxios(): AxiosInstance {
    return this.instance;
  }

  /**
   * 配置Axios
   * @param config
   */
  configAxios(config: CreateAxiosOptions) {
    if (!this.instance) return;
    this.createAxios(config);
  }

  /**
   * 设置公共头部信息
   * @param headers
   */
  setHeader(headers: Record<string, string>): void {
    if (!this.instance) return;
    Object.assign(this.instance.defaults.headers, headers);
  }

  /**
   * 设置拦截器
   * @private
   */
  private setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) return;

    const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } =
      transform;
    const axiosCanceler = new AxiosCanceler();

    // 请求拦截器
    this.instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      // 如果忽略取消令牌，则不会取消重复的请求
      // @ts-ignore
      const { ignoreCancelToken } = config.requestOptions;
      const ignoreCancel = ignoreCancelToken ?? this.options.requestOptions?.ignoreCancelToken;
      if (!ignoreCancel) axiosCanceler.addPending(config);

      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options) as InternalAxiosRequestConfig;
      }

      return config;
    }, undefined);

    // 请求错误处理
    if (requestInterceptorsCatch && isFunction(requestInterceptorsCatch)) {
      this.instance.interceptors.request.use(undefined, requestInterceptorsCatch);
    }

    // 响应结果处理
    this.instance.interceptors.response.use((res: AxiosResponse) => {
      if (res) axiosCanceler.removePending(res.config);
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res);
      }
      return res;
    }, undefined);

    // 响应错误处理
    if (responseInterceptorsCatch && isFunction(responseInterceptorsCatch)) {
      this.instance.interceptors.response.use(undefined, (error) => responseInterceptorsCatch(error, this.instance));
    }
  }

  /**
   * 支持 FormData 请求格式
   * @param config
   */
  supportFormData(config: AxiosRequestConfigRetry) {
    const headers = config.headers || (this.options.headers as AxiosRequestHeaders);
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];

    if (
      contentType !== ContentTypeEnum.FormURLEncoded ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === 'GET'
    ) {
      return config;
    }

    return {
      ...config,
      data: stringify(config.data, { arrayFormat: 'brackets' }),
    };
  }

  /**
   * 支持 params 序列化
   * @param config
   */
  supportParamsStringify(config: AxiosRequestConfigUrl) {
    const headers = config.headers || this.options.headers;
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];

    if (contentType === ContentTypeEnum.FormURLEncoded || !Reflect.has(config, 'params')) {
      return config;
    }

    return {
      ...config,
      paramsSerializer: (params: any) => stringify(params, { arrayFormat: 'brackets' }),
    };
  }

  get<D = any, R = D, T extends boolean = false>(
    config: AxiosRequestConfigUrl,
    options?: RequestOptions,
  ): Promise<T extends true ? D : Result<D, R>> {
    return this.request({ ...config, method: 'GET' }, options);
  }

  post<D = any, R = D, T extends boolean = false>(
    config: AxiosRequestConfigUrl,
    options?: RequestOptions,
  ): Promise<T extends true ? D : Result<D, R>> {
    return this.request({ ...config, method: 'POST' }, options);
  }

  put<D = any, R = D, T extends boolean = false>(
    config: AxiosRequestConfigUrl,
    options?: RequestOptions,
  ): Promise<T extends true ? D : Result<D, R>> {
    return this.request({ ...config, method: 'PUT' }, options);
  }

  delete<D = any, R = D, T extends boolean = false>(
    config: AxiosRequestConfigUrl,
    options?: RequestOptions,
  ): Promise<T extends true ? D : Result<D, R>> {
    return this.request({ ...config, method: 'DELETE' }, options);
  }

  patch<D = any, R = D, T extends boolean = false>(
    config: AxiosRequestConfigUrl,
    options?: RequestOptions,
  ): Promise<T extends true ? D : Result<D, R>> {
    return this.request({ ...config, method: 'PATCH' }, options);
  }

  /**
   * 上传文件封装
   * @param key 文件所属的key
   * @param file 文件
   * @param config 请求配置
   * @param options
   */
  upload<D = any, R = D, T extends boolean = false>(
    key: string,
    file: File,
    config: AxiosRequestConfigUrl,
    options?: RequestOptions,
  ): Promise<T extends true ? D : Result<D, R>> {
    const params = new FormData();
    params.append(key, file);
    return this.request(
      {
        ...config,
        method: 'POST',
        headers: {
          'Content-Type': ContentTypeEnum.FormData,
        },
        data: params,
      },
      options,
    );
  }

  /**
   * Download file from URL
   * @param config Axios request configuration
   * @param fileName Custom filename for the downloaded file (optional)
   * @param options Request options
   */

  async download(
    config: AxiosRequestConfigUrl & {
      fileName?: string;
    },
    options?: DownloadOptions,
  ): Promise<void> {
    try {
      const response = await this.request(
        {
          ...config,
          method: 'POST',
          responseType: 'blob',
        },
        { ...options, isReturnNativeResponse: true },
      );

      // Get the blob data
      const initialBlob = response.data || response;

      // Validate blob
      if (!(initialBlob instanceof Blob)) {
        throw new DownloadError('INVALID_RESPONSE', 'Response is not a blob');
      }

      // Handle potential empty response
      if (initialBlob.size === 0) {
        throw new DownloadError('EMPTY_FILE', 'Empty file received');
      }

      // Process the blob based on options
      const blob = options?.forceDownload ? new Blob([initialBlob], { type: 'application/octet-stream' }) : initialBlob;

      // Extract filename from Content-Disposition if available
      const contentDisposition = response.headers?.['content-disposition'];
      const extractedFileName = this.extractFileName(contentDisposition);

      // Determine final filename
      const finalFileName = config.fileName || extractedFileName || 'download';

      // Create safe URL
      const url = window.URL.createObjectURL(blob);

      try {
        if (options?.openInNewTab) {
          window.open(url, '_blank');
        } else {
          await this.triggerDownload(url, finalFileName);
        }
      } finally {
        // Cleanup URL with configurable timeout
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, options?.revokeTimeout ?? 100);
      }
    } catch (error) {
      throw this.enhanceError(error);
    }
  }

  private extractFileName(contentDisposition?: string): string {
    if (!contentDisposition) return '';

    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(contentDisposition);

    try {
      const encodedFileName = matches?.[1]?.replace(/['"]/g, '') ?? '';
      const decodedFileName = decodeURIComponent(encodedFileName);

      // 提取最后一个下划线后的内容
      const lastUnderscoreIndex = decodedFileName.lastIndexOf('_');
      if (lastUnderscoreIndex !== -1) {
        return decodedFileName.substring(lastUnderscoreIndex + 1);
      }

      return decodedFileName;
    } catch (error) {
      console.warn('Failed to decode filename:', error);
      const fallbackName = matches?.[1]?.replace(/['"]/g, '') ?? '';
      const lastUnderscoreIndex = fallbackName.lastIndexOf('_');
      return lastUnderscoreIndex !== -1 ? fallbackName.substring(lastUnderscoreIndex + 1) : fallbackName;
    }
  }

  private async triggerDownload(url: string, fileName: string): Promise<void> {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';

    document.body.appendChild(link);
    try {
      link.click();
    } finally {
      document.body.removeChild(link);
    }
  }

  private enhanceError(error: any): Error {
    const message = error.response?.data?.message || `Download failed: ${error.message || 'Unknown error'}`;
    const enhancedError = new DownloadError('DOWNLOAD_FAILED', message);
    enhancedError.cause = error;
    return enhancedError;
  }

  /**
   * 请求封装
   * @param config
   * @param options
   */
  request<D = any, R = D, T extends boolean = false>(
    config: AxiosRequestConfigRetry,
    options?: RequestOptions,
  ): Promise<T extends true ? D : Result<D, R>> {
    const { requestOptions } = this.options;

    if (requestOptions.throttle !== undefined && requestOptions.debounce !== undefined) {
      throw new Error('throttle and debounce cannot be set at the same time');
    }

    if (requestOptions.throttle && requestOptions.throttle.delay !== 0) {
      return new Promise((resolve) => {
        throttle(() => resolve(this.synthesisRequest(config, options)), requestOptions.throttle.delay);
      });
    }

    if (requestOptions.debounce && requestOptions.debounce.delay !== 0) {
      return new Promise((resolve) => {
        debounce(() => resolve(this.synthesisRequest(config, options)), requestOptions.debounce.delay);
      });
    }

    return this.synthesisRequest(config, options);
  }

  /**
   * 请求方法
   * @private
   */
  private async synthesisRequest<D = any, R = D, T extends boolean = false>(
    config: AxiosRequestConfigRetry,
    options?: RequestOptions,
  ): Promise<T extends true ? D : Result<D, R>> {
    let conf: CreateAxiosOptions = cloneDeep(config);
    const transform = this.getTransform();

    const { requestOptions } = this.options;

    const opt: RequestOptions = { ...requestOptions, ...options };

    const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {};
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }
    conf.requestOptions = opt;

    conf = this.supportFormData(conf);
    // 支持params数组参数格式化，因axios默认的toFormData即为brackets方式，无需配置paramsSerializer为qs，有需要可解除注释，参数参考qs文档
    // conf = this.supportParamsStringify(conf);
    return new Promise((resolve, reject) => {
      this.instance
        .request<D, AxiosResponse<Result>, T>(!config.retryCount ? conf : config)
        .then((res: AxiosResponse<Result>) => {
          if (transformRequestHook && isFunction(transformRequestHook)) {
            try {
              const ret = transformRequestHook(res, opt);
              resolve(ret as T extends true ? D : Result<D, R>);
            } catch (err) {
              reject(err || new Error('请求错误!'));
            }
            return;
          }
          resolve(res as unknown as Promise<T extends true ? D : Result<D, R>>);
        })
        .catch((e: Error | AxiosError) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt));
            return;
          }
          if (axios.isAxiosError(e)) {
            // 在这里重写Axios的错误信息
          }
          reject(e);
        });
    });
  }
}

export function urlTypeHelper(template: keyof paths, params: Record<string, string>): keyof paths {
  let url = template;
  for (const key in params) {
    url = url.replace(`{${key}}`, params[key]) as keyof paths;
  }
  return url;
}
