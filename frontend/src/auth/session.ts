import type { Session } from '../types/auth'

export const SESSION_KEY = 'grancapital.auth'

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    clearSession()
    return null
  }
}

export function saveSession(session: Session) {
  if (typeof window !== 'undefined') window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(SESSION_KEY)
}

export function isAuthenticated() {
  return Boolean(getSession()?.token)
}
