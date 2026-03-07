import { BmadParseError } from '../errors.js'

/**
 * Parse JSON content string into a JavaScript object
 * @param content - JSON string to parse
 * @returns Parsed object
 * @throws BmadParseError if JSON is malformed
 */
export function parseJson(content: string): object {
  try {
    return JSON.parse(content)
  } catch (error) {
    throw new BmadParseError('json', error as Error)
  }
}
