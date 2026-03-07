import { describe, it, expect, beforeEach } from 'vitest'
import {
  readBmadFiles,
  getStories,
  getEpics,
  getSprintStatus,
  getStoryById,
  getEpicById,
  refreshCache,
} from './bmad-reader.js'
import * as cache from './cache.js'

describe('bmad-reader', () => {
  const testProjectRoot = process.cwd()

  beforeEach(() => {
    cache.clear()
  })

  describe('readBmadFiles', () => {
    it('should read sprint-status.yaml from implementation-artifacts', async () => {
        const result = await readBmadFiles(testProjectRoot)
        expect(result.sprint).toBeDefined()
        expect(result.sprint.project).toBe('bmad-ui')
      },
    )

    it('should read story files from implementation-artifacts', async () => {
      const result = await readBmadFiles(testProjectRoot)
      expect(result.stories.length).toBeGreaterThan(0)
      const story = result.stories.find((s) => s.id === '1-1-project-initialization')
      expect(story).toBeDefined()
      expect(story?.title).toContain('Project Initialization')
    })

    it('should read epic files from planning-artifacts', async () => {
      const result = await readBmadFiles(testProjectRoot)
      expect(result.epics.length).toBeGreaterThan(0)
    })

    it('should cache results', async () => {
      await readBmadFiles(testProjectRoot)
      expect(cache.has('bmad-data')).toBe(true)
    })

    it('should return cached data on subsequent calls', async () => {
      const first = await readBmadFiles(testProjectRoot)
      const second = await readBmadFiles(testProjectRoot)
      expect(first).toBe(second)
    })

    it('should throw BmadFileNotFoundError for missing directory', async () => {
      await expect(readBmadFiles('/non/existent/path')).rejects.toThrow('BMAD artifacts not found')
    })
  })

  describe('getStories', () => {
    beforeEach(async () => {
      await readBmadFiles(testProjectRoot)
    })

    it('should return all stories', async () => {
      const stories = await getStories(testProjectRoot)
      expect(Array.isArray(stories)).toBe(true)
      expect(stories.length).toBeGreaterThan(0)
    })

    it('should return stories with required fields', async () => {
      const stories = await getStories(testProjectRoot)
      const story = stories[0]
      expect(story).toHaveProperty('id')
      expect(story).toHaveProperty('title')
      expect(story).toHaveProperty('status')
      expect(story).toHaveProperty('epicId')
    })
  })

  describe('getStoryById', () => {
    beforeEach(async () => {
      await readBmadFiles(testProjectRoot)
    })

    it('should return story by id', async () => {
      const story = await getStoryById(testProjectRoot, '1-1-project-initialization')
      expect(story).toBeDefined()
      expect(story?.id).toBe('1-1-project-initialization')
    })

    it('should return undefined for non-existent story', async () => {
      const story = await getStoryById(testProjectRoot, 'non-existent')
      expect(story).toBeUndefined()
    })
  })

  describe('getEpics', () => {
    beforeEach(async () => {
      await readBmadFiles(testProjectRoot)
    })

    it('should return all epics', async () => {
      const epics = await getEpics(testProjectRoot)
      expect(Array.isArray(epics)).toBe(true)
      expect(epics.length).toBeGreaterThan(0)
    })

    it('should return epics with required fields', async () => {
      const epics = await getEpics(testProjectRoot)
      const epic = epics[0]
      expect(epic).toHaveProperty('id')
      expect(epic).toHaveProperty('title')
      expect(epic).toHaveProperty('storyIds')
    })
  })

  describe('getEpicById', () => {
    beforeEach(async () => {
      await readBmadFiles(testProjectRoot)
    })

    it('should return epic by id', async () => {
      const epic = await getEpicById(testProjectRoot, 'epic-1')
      expect(epic).toBeDefined()
      expect(epic?.id).toBe('epic-1')
    })

    it('should return undefined for non-existent epic', async () => {
      const epic = await getEpicById(testProjectRoot, 'non-existent')
      expect(epic).toBeUndefined()
    })
  })

  describe('getSprintStatus', () => {
    beforeEach(async () => {
      await readBmadFiles(testProjectRoot)
    })

    it('should return sprint status', async () => {
      const sprint = await getSprintStatus(testProjectRoot)
      expect(sprint).toBeDefined()
      expect(sprint.project).toBe('bmad-ui')
    })
  })

  describe('refreshCache', () => {
    it('should clear cache and re-read files', async () => {
      await readBmadFiles(testProjectRoot)
      expect(cache.has('bmad-data')).toBe(true)

      await refreshCache(testProjectRoot)
      expect(cache.has('bmad-data')).toBe(true)
    })
  })
})
