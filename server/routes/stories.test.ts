import express from 'express'
import request from 'supertest'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import type { Router } from 'express'
import type { Story } from '../lib/types.js'

vi.mock('../lib/bmad-reader.js', () => {
  return {
    __esModule: true,
    getStories: vi.fn(),
    getStoryById: vi.fn(),
  }
})

let createStoriesRouter: (projectRoot: string) => Router
let getStoriesMock: any
let getStoryByIdMock: any

beforeAll(async () => {
  const mod = await import('./stories.js')
  createStoriesRouter = mod.createStoriesRouter
  const reader = await import('../lib/bmad-reader.js')
  getStoriesMock = reader.getStories
  getStoryByIdMock = reader.getStoryById
})

describe('Stories Router', () => {
  it('GET /api/stories - returns array', async () => {
    const sampleStories: Story[] = [
      {
        id: '1-1-test',
        title: 'Test Story',
        description: '',
        status: 'ready',
        epicId: 'epic-1',
        acceptanceCriteria: [],
      },
    ]
    getStoriesMock.mockResolvedValue(sampleStories)

    const app = express()
    app.use('/api/stories', createStoriesRouter(process.cwd()))

    const res = await request(app).get('/api/stories')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body).toEqual(sampleStories)
  })

  it('GET /api/stories/:id - returns a story object', async () => {
    const story: Story = {
      id: '1-1-test',
      title: 'Test Story',
      description: '',
      status: 'ready',
      epicId: 'epic-1',
      acceptanceCriteria: [],
    }
    getStoryByIdMock.mockResolvedValue(story)

    const app = express()
    app.use('/api/stories', createStoriesRouter(process.cwd()))

    const res = await request(app).get('/api/stories/1-1-test')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id', story.id)
  })

  it('GET /api/stories/:id with invalid ID returns 400', async () => {
    getStoryByIdMock.mockResolvedValue(undefined)

    const app = express()
    app.use('/api/stories', createStoriesRouter(process.cwd()))

    const res = await request(app).get('/api/stories/not-a-valid-id')
    expect(res.status).toBe(400)
  })

  it('GET /api/stories/:id with non-existent ID returns 404', async () => {
    getStoryByIdMock.mockResolvedValue(undefined)

    const app = express()
    app.use('/api/stories', createStoriesRouter(process.cwd()))

    const res = await request(app).get('/api/stories/9999-9999-nonexistent')
    expect(res.status).toBe(404)
  })
})
