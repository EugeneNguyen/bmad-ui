import { AxiosError } from 'axios'

export type ErrorCode = 'PARSE_ERROR' | 'FILE_NOT_FOUND' | 'VALIDATION_ERROR' | 'NETWORK_ERROR'

export class BmadError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public file?: string,
    public details?: string[]
  ) {
    super(message)
    this.name = 'BmadError'
  }

  static fromAxios(error: AxiosError): BmadError {
    if (error.response) {
      const data = error.response.data as {
        error?: { code: ErrorCode; message: string; file?: string; details?: string[] }
      }
      if (data.error) {
        return new BmadError(
          data.error.code,
          data.error.message,
          data.error.file,
          data.error.details
        )
      }
    }
    return new BmadError('NETWORK_ERROR', error.message)
  }
}
