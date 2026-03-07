import { describe, it, expect } from 'vitest'
import { parseJson } from './json.js'
import { BmadParseError } from '../errors.js'

describe('parseJson', () => {
  it('should parse valid JSON content', () => {
    const jsonContent = '{"name": "test", "version": "1.0.0"}'
    const result = parseJson(jsonContent) as { name: string; version: string }
    expect(result.name).toBe('test')
    expect(result.version).toBe('1.0.0')
  })

  it('should parse JSON array', () => {
    const jsonContent = '[1, 2, 3]'
    const result = parseJson(jsonContent) as number[]
    expect(result).toEqual([1, 2, 3])
  })

  it('should parse empty JSON object', () => {
    const result = parseJson('{}')
    expect(result).toEqual({})
  })

  it('should parse nested JSON structure', () => {
    const jsonContent = JSON.stringify({
      development_status: {
        'epic-1': 'in-progress',
        '1-1-project': 'done',
      },
    })
    const result = parseJson(jsonContent) as {
      development_status: Record<string, string>
    }
    expect(result.development_status).toEqual({
      'epic-1': 'in-progress',
      '1-1-project': 'done',
    })
  })

  it('should throw BmadParseError for malformed JSON', () => {
    const malformedJson = '{"key": "value"'
    expect(() => parseJson(malformedJson)).toThrow(BmadParseError)
  })

  it('should throw BmadParseError with correct error type', () => {
    const malformedJson = '{invalid}'

    try {
      parseJson(malformedJson)
      expect.fail('Should have thrown BmadParseError')
    } catch (error) {
      expect(error).toBeInstanceOf(BmadParseError)
      const parseError = error as BmadParseError
      expect(parseError.code).toBe('PARSE_ERROR')
      expect(parseError.file).toBe('json')
    }
  })

  it('should parse JSON with null values', () => {
    const jsonContent = '{"name": null, "value": 123}'
    const result = parseJson(jsonContent) as { name: null; value: number }
    expect(result.name).toBeNull()
    expect(result.value).toBe(123)
  })
})
