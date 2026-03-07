import express from 'express'
import request from 'supertest'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import type { Router } from 'express'
import type { Epic } from '../lib/types.js'

vi.mock('../lib/bmad-reader.js', () => {
  return {
    __esModule: true,
    getEpics: vi.fn(),
    getEpicById: vi.fn(),
  }
})

let createEpicsRouter: (projectRoot: string) => Router
let getEpicsMock: any
let getEpicByIdMock: any

beforeAll(async () => {
  const mod = await import('./epics.js')
  createEpicsRouter = mod.createEpicsRouter
  const reader = await import('../lib/bmad-reader.js')
  getEpicsMock = reader.getEpics
  getEpicByIdMock = reader.getEpicById
})

describe('Epics Router', () => {
  it('GET /api/epics - returns array', async () => {
    const sampleEpics: Epic[] = [
      { id: 'epic-1', title: 'Epic One', description: '', storyIds: [] },
    ]
    getEpicsMock.mockResolvedValue(sampleEpics)

    const app = express()
    app.use('/api/epics', createEpicsRouter(process.cwd()))

    const res = await request(app).get('/api/epics')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body).toEqual(sampleEpics)
  })

  it('GET /api/epics/:id - returns an epic object', async () => {
    const epic: Epic = { id: 'epic-1', title: 'Epic One', description: '', storyIds: [] }
    getEpicByIdMock.mockResolvedValue(epic)

    const app = express()
    app.use('/api/epics', createEpicsRouter(process.cwd()))

    const res = await request(app).get('/api/epics/epic-1')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id', epic.id)
  })

  it('GET /api/epics/:id with invalid ID returns 400', async () => {
    getEpicByIdMock.mockResolvedValue(undefined)

    const app = express()
    app.use('/api/epics', createEpicsRouter(process.cwd()))

    const res = await request(app).get('/api/epics/invalid-id')
    expect(res.status).toBe(400)
  })

  it('GET /api/epics/:id with non-existent ID returns 404', async () => {
    getEpicByIdMock.mockResolvedValue(undefined)

    const app = express()
    app.use('/api/epics', createEpicsRouter(process.cwd()))

    const res = await request(app).get('/api/epics/epic-999')
    expect(res.status).toBe(404)
  })
})
