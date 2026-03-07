import matter from 'gray-matter'
import { BmadParseError } from '../errors.js'
import type { ParsedMarkdown } from '../types.js'

/**
 * Parse Markdown content with YAML frontmatter
 * @param content - Markdown string with optional YAML frontmatter
 * @returns Object with frontmatter and body
 * @throws BmadParseError if frontmatter YAML is malformed
 */
export function parseMarkdown(content: string): ParsedMarkdown {
  try {
    const { data, content: body } = matter(content)
    return { frontmatter: data, body }
  } catch (error) {
    throw new BmadParseError('markdown', error as Error)
  }
}
