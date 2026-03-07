/**
 * Simple in-memory cache for BMAD file data
 * Process-scoped lifetime, manual invalidation only
 */

type CacheValue = unknown

const cache = new Map<string, CacheValue>()

export function get<T = unknown>(key: string): T | undefined {
  return cache.get(key) as T | undefined
}

export function set(key: string, value: CacheValue): void {
  cache.set(key, value)
}

export function has(key: string): boolean {
  return cache.has(key)
}

export function clear(): void {
  cache.clear()
}

export function keys(): string[] {
  return Array.from(cache.keys())
}
