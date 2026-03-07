import { describe, it, expect } from 'vitest'
import { parseYaml } from './yaml.js'
import { BmadParseError } from '../errors.js'

describe('parseYaml', () => {
  it('should parse valid YAML content', () => {
    const yamlContent = `
name: test-project
version: 1.0.0
items:
  - item1
  - item2
`
    const result = parseYaml(yamlContent)
    expect(result).toEqual({
      name: 'test-project',
      version: '1.0.0',
      items: ['item1', 'item2'],
    })
  })

  it('should parse empty YAML content', () => {
    const result = parseYaml('')
    expect(result).toBeUndefined()
  })

  it('should parse YAML object with nested structure', () => {
    const yamlContent = `
development_status:
  epic-1: in-progress
  1-1-project: done
`
    const result = parseYaml(yamlContent) as { development_status: Record<string, string> }
    expect(result.development_status).toEqual({
      'epic-1': 'in-progress',
      '1-1-project': 'done',
    })
  })

  it('should throw BmadParseError for malformed YAML', () => {
    const malformedYaml = 'key: [unclosed array'
    expect(() => parseYaml(malformedYaml)).toThrow(BmadParseError)
  })

  it('should throw BmadParseError with correct error type', () => {
    const malformedYaml = 'key: [unclosed'
    
    try {
      parseYaml(malformedYaml)
      expect.fail('Should have thrown BmadParseError')
    } catch (error) {
      expect(error).toBeInstanceOf(BmadParseError)
      const parseError = error as BmadParseError
      expect(parseError.code).toBe('PARSE_ERROR')
      expect(parseError.file).toBe('yaml')
    }
  })

  it('should parse YAML with comments', () => {
    const yamlContent = `
# This is a comment
name: test
# Another comment
value: 123
`
    const result = parseYaml(yamlContent) as { name: string; value: number }
    expect(result.name).toBe('test')
    expect(result.value).toBe(123)
  })
})
