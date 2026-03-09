/**
 * Utility functions for parsing story and epic IDs
 * @module lib/utils/story
 */

export function parseStoryId(id: string): string {
  const match = id.match(/^(\d+)-(\d+)/)
  if (!match) return id
  return `${match[1]}.${match[2]}`
}

export function parseEpicId(epicId: string): string {
  const match = epicId.match(/^epic-(\d+)/)
  if (!match) return epicId
  return match[1]
}

export function parseStoryIdObject(id: string): { epicNum: number; storyNum: number } | null {
  const match = id.match(/^(\d+)-(\d+)/)
  if (match) {
    return { epicNum: parseInt(match[1], 10), storyNum: parseInt(match[2], 10) }
  }
  return null
}
