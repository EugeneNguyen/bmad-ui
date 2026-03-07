import express from 'express'
import request from 'supertest'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import type { Router } from 'express'
import type { SprintStatus } from '../lib/types.js'

vi.mock('../lib/bmad-reader.js', () => {
  return {
    __esModule: true,
    getSprintStatus: vi.fn(),
  }
})

let createSprintRouter: (projectRoot: string) => Router
let getSprintStatusMock: any

beforeAll(async () => {
  const mod = await import('./sprint.js')
  createSprintRouter = mod.createSprintRouter
  const reader = await import('../lib/bmad-reader.js')
  getSprintStatusMock = reader.getSprintStatus
})

describe('Sprint Router', () => {
  it('GET /api/sprint - returns sprint status', async () => {
    const sprint: SprintStatus = {
      sprintId: 'default',
      name: 'Sprint 1',
      stories: [],
      lastUpdated: new Date().toISOString(),
    }
    getSprintStatusMock.mockResolvedValue(sprint)

    const app = express()
    app.use('/api/sprint', createSprintRouter(process.cwd()))

    const res = await request(app).get('/api/sprint')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('sprintId', sprint.sprintId)
  })
})
