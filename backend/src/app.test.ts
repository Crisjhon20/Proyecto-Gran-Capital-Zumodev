import { describe, expect, it } from 'vitest'
import app from './app.js'

describe('API base', () => {
  it('responde el estado de salud', async () => {
    const response = await app.request('/health')
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({ status: 'ok', service: 'grancapital-backend' })
  })
})
