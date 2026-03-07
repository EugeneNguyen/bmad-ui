import { describe, it, expect } from 'vitest'
import { parseMarkdown } from './markdown.js'
import { BmadParseError } from '../errors.js'

describe('parseMarkdown', () => {
  it('should parse markdown with YAML frontmatter', () => {
    const content = `---
title: Test Story
status: done
epicId: epic-1
---

# Story Title

This is the body content.
`
    const result = parseMarkdown(content)
    expect(result.frontmatter).toEqual({
      title: 'Test Story',
      status: 'done',
      epicId: 'epic-1',
    })
    expect(result.body).toContain('# Story Title')
  })

  it('should parse markdown without frontmatter', () => {
    const content = `# Just Markdown

No frontmatter here.`
    const result = parseMarkdown(content)
    expect(result.frontmatter).toEqual({})
    expect(result.body).toContain('Just Markdown')
  })

  it('should parse empty markdown', () => {
    const result = parseMarkdown('')
    expect(result.frontmatter).toEqual({})
    expect(result.body).toBe('')
  })

  it('should handle complex frontmatter with arrays', () => {
    const content = `---
title: Complex Story
acceptanceCriteria:
  - Criterion 1
  - Criterion 2
tags:
  - feature
  - backend
---

Body here.`
    const result = parseMarkdown(content)
    expect(result.frontmatter.title).toBe('Complex Story')
    expect(result.frontmatter.acceptanceCriteria).toEqual(['Criterion 1', 'Criterion 2'])
    expect(result.frontmatter.tags).toEqual(['feature', 'backend'])
  })

  it('should handle frontmatter with nested objects', () => {
    const content = `---
config:
  enabled: true
  settings:
    timeout: 30
---

Content.`
    const result = parseMarkdown(content)
    const config = result.frontmatter.config as {
      enabled: boolean
      settings: { timeout: number }
    }
    expect(config.enabled).toBe(true)
    expect(config.settings.timeout).toBe(30)
  })

  it('should throw BmadParseError for malformed frontmatter', () => {
    const content = `---
title: [unclosed
---

Body.`
    expect(() => parseMarkdown(content)).toThrow(BmadParseError)
  })

  it('should throw BmadParseError with correct error type', () => {
    const content = `---
invalid: [yaml
---

Body.`

    try {
      parseMarkdown(content)
      expect.fail('Should have thrown BmadParseError')
    } catch (error) {
      expect(error).toBeInstanceOf(BmadParseError)
      const parseError = error as BmadParseError
      expect(parseError.code).toBe('PARSE_ERROR')
      expect(parseError.file).toBe('markdown')
    }
  })

  it('should preserve body content exactly', () => {
    const content = `---
title: Test
---

## Heading 2

- List item 1
- List item 2

\`\`\`javascript
const x = 1
\`\`\`
`
    const result = parseMarkdown(content)
    expect(result.body).toContain('## Heading 2')
    expect(result.body).toContain('- List item 1')
    expect(result.body).toContain('const x = 1')
  })
})
