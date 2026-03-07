import { describe, it, expect } from 'vitest'

describe('API Client', () => {
  it('should export api instance', async () => {
    const { api } = await import('./api')
    expect(api).toBeDefined()
  })

  it('should have correct baseURL', async () => {
    const { api } = await import('./api')
    expect(api.defaults.baseURL).toBe('/api')
  })

  it('should have correct timeout configuration', async () => {
    const { api } = await import('./api')
    expect(api.defaults.timeout).toBe(5000)
  })

  it('should have response interceptor configured', async () => {
    const { api } = await import('./api')
    expect(api.interceptors.response.handlers).toHaveLength(1)
  })
})
