import type { Room } from '../types/room'
import { apiRequest } from './api-client'

export type RoomFilters = Partial<Pick<Room, 'cama' | 'disponibilidad' | 'frigobar' | 'aire_acondicionado' | 'televisor' | 'bano_privado'>> & {
  precioMin?: number
  precioMax?: number
}

export type RoomUpdate = Partial<Pick<Room, 'cama' | 'disponibilidad' | 'frigobar' | 'aire_acondicionado' | 'televisor' | 'bano_privado'>> & {
  precio?: number
}

function query(filters: RoomFilters) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && String(value) !== '') params.set(key, String(value))
  })
  return params.toString()
}

export async function listRooms(filters: RoomFilters = {}) {
  const suffix = query(filters)
  const endpoint = suffix ? `/api/rooms/filter?${suffix}` : '/api/rooms'
  return apiRequest<{ data: Room[] }>(endpoint)
}

export async function updateRoom(id: number, changes: RoomUpdate) {
  return apiRequest<{ data: Room }>(`/api/rooms/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  })
}
