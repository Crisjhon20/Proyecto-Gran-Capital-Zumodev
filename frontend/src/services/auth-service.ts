import { clearSession, saveSession } from '../auth/session'
import type { AuthUser, Session } from '../types/auth'
import { apiRequest } from './api-client'

export async function login(usuario: string, contrasena: string) {
  const response = await apiRequest<{ data: Session }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usuario, contrasena }),
  })
  saveSession(response.data)
  return response.data
}

export async function register(usuario: string, contrasena: string) {
  return apiRequest<{ data: { identificador: number; usuario: string; perfil: string } }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ usuario, contrasena }),
  })
}

export async function getMe() {
  return apiRequest<{ data: AuthUser }>('/api/auth/me')
}

export async function logout() {
  try {
    await apiRequest('/api/auth/logout', { method: 'POST' })
  } finally {
    clearSession()
  }
}
