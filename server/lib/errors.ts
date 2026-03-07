/**
 * BMAD Error Types
 * Custom error classes for BMAD file parsing and processing
 */

export type ErrorCode =
  | 'PARSE_ERROR'
  | 'FILE_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'INTERNAL_ERROR'
  | 'NOT_FOUND'

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

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        file: this.file,
        details: this.details,
      },
    }
  }
}

export function getHttpStatusCode(code: ErrorCode): number {
  const statusMap: Record<ErrorCode, number> = {
    PARSE_ERROR: 500,
    FILE_NOT_FOUND: 404,
    VALIDATION_ERROR: 400,
    NETWORK_ERROR: 503,
    INTERNAL_ERROR: 500,
    NOT_FOUND: 404,
  }
  return statusMap[code] || 500
}

export function wrapError(error: unknown): BmadError {
  if (error instanceof BmadError) {
    return error
  }
  
  const message = error instanceof Error ? error.message : 'Unknown error'
  return new BmadError('INTERNAL_ERROR', message)
}

export class BmadParseError extends BmadError {
  constructor(file: string, cause: Error) {
    super('PARSE_ERROR', `Failed to parse ${file}`, file, [cause.message])
    this.name = 'BmadParseError'
  }
}

export class BmadFileNotFoundError extends BmadError {
  constructor(path: string) {
    super('FILE_NOT_FOUND', `BMAD artifacts not found at ${path}`, path)
    this.name = 'BmadFileNotFoundError'
  }
}

export class BmadValidationError extends BmadError {
  constructor(message: string, file?: string, details?: string[]) {
    super('VALIDATION_ERROR', message, file, details)
    this.name = 'BmadValidationError'
  }
}
