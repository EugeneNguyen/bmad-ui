import { describe, it, expect } from 'vitest'
import { validateStoryId, validateEpicId } from './validation.js'
import { BmadValidationError } from './errors.js'

describe('validation', () => {
  describe('validateStoryId', () => {
    it('should accept valid story IDs', () => {
      expect(() => validateStoryId('1-2-user-authentication')).not.toThrow()
      expect(() => validateStoryId('2-3-kanban-board')).not.toThrow()
    })

    it('should reject empty story IDs', () => {
      expect(() => validateStoryId('')).toThrow(BmadValidationError)
      expect(() => validateStoryId('   ')).toThrow(BmadValidationError)
    })

    it('should reject story IDs with path traversal', () => {
      expect(() => validateStoryId('../etc/passwd')).toThrow(BmadValidationError)
      expect(() => validateStoryId('1-2-../../secret')).toThrow(BmadValidationError)
    })

    it('should reject story IDs exceeding max length', () => {
      const longId = '1-2-' + 'a'.repeat(100)
      expect(() => validateStoryId(longId)).toThrow(BmadValidationError)
    })

    it('should reject invalid story ID formats', () => {
      expect(() => validateStoryId('invalid')).toThrow(BmadValidationError)
      expect(() => validateStoryId('story-1')).toThrow(BmadValidationError)
      expect(() => validateStoryId('1.2.user-auth')).toThrow(BmadValidationError)
    })
  })

  describe('validateEpicId', () => {
    it('should accept valid epic IDs', () => {
      expect(() => validateEpicId('epic-1')).not.toThrow()
      expect(() => validateEpicId('epic-2')).not.toThrow()
    })

    it('should reject empty epic IDs', () => {
      expect(() => validateEpicId('')).toThrow(BmadValidationError)
      expect(() => validateEpicId('   ')).toThrow(BmadValidationError)
    })

    it('should reject epic IDs with path traversal', () => {
      expect(() => validateEpicId('../etc/passwd')).toThrow(BmadValidationError)
      expect(() => validateEpicId('epic-1/../../secret')).toThrow(BmadValidationError)
    })

    it('should reject invalid epic ID formats', () => {
      expect(() => validateEpicId('invalid')).toThrow(BmadValidationError)
      expect(() => validateEpicId('epic-')).toThrow(BmadValidationError)
      expect(() => validateEpicId('1')).toThrow(BmadValidationError)
    })
  })
})
