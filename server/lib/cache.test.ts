import { describe, it, expect, beforeEach } from 'vitest'
import { get, set, clear, has } from './cache.js'

describe('cache', () => {
  beforeEach(() => {
    clear()
  })

  describe('get and set', () => {
    it('should store and retrieve a value', () => {
      set('test-key', { data: 'value' })
      expect(get('test-key')).toEqual({ data: 'value' })
    })

    it('should return undefined for non-existent key', () => {
      expect(get('non-existent')).toBeUndefined()
    })

    it('should overwrite existing value', () => {
      set('key', 'first')
      set('key', 'second')
      expect(get('key')).toBe('second')
    })

    it('should store complex objects', () => {
      const complex = {
        id: 'story-1',
        title: 'Test',
        nested: {
          items: [1, 2, 3],
        },
      }
      set('complex', complex)
      expect(get('complex')).toEqual(complex)
    })

    it('should store arrays', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }]
      set('array', arr)
      expect(get('array')).toEqual(arr)
    })

    it('should store null values', () => {
      set('null-key', null)
      expect(get('null-key')).toBeNull()
    })
  })

  describe('clear', () => {
    it('should remove all cached values', () => {
      set('key1', 'value1')
      set('key2', 'value2')
      clear()
      expect(get('key1')).toBeUndefined()
      expect(get('key2')).toBeUndefined()
    })

    it('should be safe to call on empty cache', () => {
      expect(() => clear()).not.toThrow()
    })
  })

  describe('has', () => {
    it('should return true for existing key', () => {
      set('exists', 'value')
      expect(has('exists')).toBe(true)
    })

    it('should return false for non-existent key', () => {
      expect(has('missing')).toBe(false)
    })

    it('should return true for key with null value', () => {
      set('null-key', null)
      expect(has('null-key')).toBe(true)
    })
  })
})
