import { clearSession, getSession } from '../auth/session'
import type { ApiError } from '../types/api'

const configuredApiUrl = import.meta.env.PUBLIC_API_URL?.trim()
const API_URL = (configuredApiUrl || 'http://localhost:3000').replace(/\/$/, '')

function assertProductionApiUrl() {
  if (typeof window === 'undefined') return
  const localBrowser = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)
  if (!localBrowser && (!configuredApiUrl || /localhost|127\.0\.0\.1/.test(API_URL))) {
    throw new Error('PUBLIC_API_URL debe apuntar a la URL publica del backend en produccion')
  }
}

export class ApiRequestError extends Error {
  constructor(public readonly status: number, public readonly payload: ApiError) {
    super(payload.message || 'No se pudo completar la solicitud')
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  assertProductionApiUrl()
  const session = getSession()
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (session?.token) headers.set('Authorization', `Bearer ${session.token}`)

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const payload = await response.json().catch(() => ({})) as T & ApiError

  if (response.status === 401 && !path.includes('/auth/login')) {
    clearSession()
    if (typeof window !== 'undefined') window.location.assign('/login?expired=1')
  }

  if (!response.ok) throw new ApiRequestError(response.status, payload)
  return payload as T
}
