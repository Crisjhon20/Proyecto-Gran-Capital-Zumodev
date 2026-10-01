import { clearSession, getSession } from '../auth/session'
import type { ApiError } from '../types/api'

const API_URL = (import.meta.env.PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '')

export class ApiRequestError extends Error {
  constructor(public readonly status: number, public readonly payload: ApiError) {
    super(payload.message || 'No se pudo completar la solicitud')
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
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
