import { describe, it, expect } from 'vitest'
import { BmadError, type ErrorCode } from './errors'
import { AxiosError } from 'axios'

describe('BmadError', () => {
  it('should create error with code and message', () => {
    const error = new BmadError('PARSE_ERROR', 'Test error message')
    expect(error.code).toBe('PARSE_ERROR')
    expect(error.message).toBe('Test error message')
    expect(error.name).toBe('BmadError')
  })

  it('should create error with optional file and details', () => {
    const error = new BmadError(
      'VALIDATION_ERROR',
      'Validation failed',
      'test.yaml',
      ['Field is required', 'Invalid format']
    )
    expect(error.file).toBe('test.yaml')
    expect(error.details).toEqual(['Field is required', 'Invalid format'])
  })

  it('should transform Axios response error to BmadError', () => {
    const axiosError = {
      response: {
        data: {
          error: {
            code: 'FILE_NOT_FOUND' as ErrorCode,
            message: 'File not found',
            file: 'missing.yaml',
          },
        },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {},
      },
      isAxiosError: true,
      name: 'AxiosError',
      message: 'Request failed with status code 404',
    } as AxiosError

    const bmadError = BmadError.fromAxios(axiosError)
    expect(bmadError.code).toBe('FILE_NOT_FOUND')
    expect(bmadError.message).toBe('File not found')
    expect(bmadError.file).toBe('missing.yaml')
  })

  it('should transform Axios network error to NETWORK_ERROR', () => {
    const axiosError = {
      isAxiosError: true,
      name: 'AxiosError',
      message: 'Network Error',
    } as AxiosError

    const bmadError = BmadError.fromAxios(axiosError)
    expect(bmadError.code).toBe('NETWORK_ERROR')
    expect(bmadError.message).toBe('Network Error')
  })
})

describe('ErrorCode type', () => {
  it('should include all expected error codes', () => {
    const codes: ErrorCode[] = [
      'PARSE_ERROR',
      'FILE_NOT_FOUND',
      'VALIDATION_ERROR',
      'NETWORK_ERROR',
    ]
    expect(codes).toHaveLength(4)
  })
})
