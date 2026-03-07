import express from 'express'
import request from 'supertest'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import type { Router } from 'express'

vi.mock('../lib/bmad-reader.js', () => {
  return {
    __esModule: true,
    refreshCache: vi.fn(),
  }
})

let createRefreshRouter: (projectRoot: string) => Router
let refreshCacheMock: any

beforeAll(async () => {
  const mod = await import('./refresh.js')
  createRefreshRouter = mod.createRefreshRouter
  const reader = await import('../lib/bmad-reader.js')
  refreshCacheMock = reader.refreshCache
})

describe('Refresh Router', () => {
  it('POST /api/refresh - clears cache', async () => {
    refreshCacheMock.mockResolvedValue(undefined)

    const app = express()
    app.use('/api/refresh', createRefreshRouter(process.cwd()))

    const res = await request(app).post('/api/refresh')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message')
  })
})
