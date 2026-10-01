import type { Reservation } from '../types/reservation'
import { apiRequest } from './api-client'

export async function listReservations() {
  return apiRequest<{ data: Reservation[] }>('/api/reservations/history')
}

export async function createReservation(payload: { habitacionId: number; fechaEntrada: string; fechaSalida: string }) {
  return apiRequest<{ data: Reservation }>('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateReservation(id: number, payload: Partial<{ habitacionId: number; fechaEntrada: string; fechaSalida: string }>) {
  return apiRequest<{ data: Reservation }>(`/api/reservations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function cancelReservation(id: number) {
  return apiRequest<{ data: Reservation }>(`/api/reservations/${id}/cancel`, { method: 'PATCH' })
}
