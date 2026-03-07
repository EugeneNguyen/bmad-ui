import * as yaml from 'js-yaml'
import { BmadParseError } from '../errors.js'

/**
 * Parse YAML content string into a JavaScript object
 * @param content - YAML string to parse
 * @returns Parsed object or undefined for empty content
 * @throws BmadParseError if YAML is malformed
 */
export function parseYaml(content: string): object | undefined {
  try {
    return yaml.load(content) as object | undefined
  } catch (error) {
    throw new BmadParseError('yaml', error as Error)
  }
}
