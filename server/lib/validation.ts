import { BmadValidationError } from './errors.js'

const STORY_ID_PATTERN = /^\d+-\d+-[a-z0-9-]+$/
const EPIC_ID_PATTERN = /^epic-\d+$/
const MAX_ID_LENGTH = 100

export function validateStoryId(id: string): void {
  if (!id || typeof id !== 'string') {
    throw new BmadValidationError('Story ID is required')
  }

  if (id.length > MAX_ID_LENGTH) {
    throw new BmadValidationError(`Story ID exceeds maximum length of ${MAX_ID_LENGTH}`)
  }

  if (id.includes('..') || id.includes('/') || id.includes('\\')) {
    throw new BmadValidationError('Story ID contains invalid characters', id)
  }

  if (!STORY_ID_PATTERN.test(id)) {
    throw new BmadValidationError(
      `Story ID must match pattern: X-Y-slug (e.g., "1-2-user-authentication")`,
      id
    )
  }
}

export function validateEpicId(id: string): void {
  if (!id || typeof id !== 'string') {
    throw new BmadValidationError('Epic ID is required')
  }

  if (id.length > MAX_ID_LENGTH) {
    throw new BmadValidationError(`Epic ID exceeds maximum length of ${MAX_ID_LENGTH}`)
  }

  if (id.includes('..') || id.includes('/') || id.includes('\\')) {
    throw new BmadValidationError('Epic ID contains invalid characters', id)
  }

  if (!EPIC_ID_PATTERN.test(id)) {
    throw new BmadValidationError(
      `Epic ID must match pattern: epic-N (e.g., "epic-1")`,
      id
    )
  }
}
