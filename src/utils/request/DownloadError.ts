// 自定义下载错误类型
export class DownloadError extends Error {
  constructor(
    public code: DownloadErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'DownloadError';
  }
}

// 下载错误码枚举
export type DownloadErrorCode =
  | 'INVALID_RESPONSE'
  | 'EMPTY_FILE'
  | 'DOWNLOAD_FAILED'
  | 'NETWORK_ERROR'
  | 'INVALID_FILE_TYPE';
