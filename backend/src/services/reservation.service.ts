import { AppError } from '../errors/app-error.js'
import { findAvailableRoom } from '../repositories/room.repository.js'
import {
  cancelReservation,
  createReservation,
  hasOverlappingReservation,
  listClientReservations,
  updateReservation,
} from '../repositories/reservation.repository.js'

export async function reserveRoom(clientId: number, roomId: number, entry: Date, exit: Date) {
  if (entry < new Date(new Date().setHours(0, 0, 0, 0))) {
    throw new AppError(400, 'INVALID_ENTRY_DATE', 'La fecha de entrada no puede ser anterior a hoy')
  }

  if (!(await findAvailableRoom(roomId))) {
    throw new AppError(409, 'ROOM_NOT_AVAILABLE', 'La habitacion no esta disponible')
  }

  if (await hasOverlappingReservation(roomId, entry, exit)) {
    throw new AppError(409, 'RESERVATION_OVERLAP', 'La habitacion ya esta reservada para esas fechas')
  }

  return createReservation(clientId, roomId, entry, exit)
}

export async function getReservationHistory(clientId: number) {
  return listClientReservations(clientId)
}

export async function cancelClientReservation(id: number, clientId: number) {
  const reservation = await cancelReservation(id, clientId)
  if (!reservation) throw new AppError(404, 'RESERVATION_NOT_FOUND', 'Reserva no encontrada o no cancelable')
  return reservation
}

export async function updateClientReservation(
  id: number,
  actorId: number,
  isAdmin: boolean,
  roomId: number,
  entry: Date,
  exit: Date,
) {
  if (entry < new Date(new Date().setHours(0, 0, 0, 0))) {
    throw new AppError(400, 'INVALID_ENTRY_DATE', 'La fecha de entrada no puede ser anterior a hoy')
  }
  if (entry >= exit) {
    throw new AppError(400, 'INVALID_DATE_RANGE', 'La fecha de entrada debe ser anterior a la fecha de salida')
  }

  const result = await updateReservation(id, actorId, isAdmin, { roomId, entry, exit })
  if (result.status === 'not_found') throw new AppError(404, 'RESERVATION_NOT_FOUND', 'Reserva no encontrada')
  if (result.status === 'forbidden') throw new AppError(403, 'FORBIDDEN', 'No puedes modificar esta reserva')
  if (result.status === 'not_editable') throw new AppError(409, 'RESERVATION_NOT_EDITABLE', 'La reserva no se puede modificar')
  if (result.status === 'room_unavailable') throw new AppError(409, 'ROOM_NOT_AVAILABLE', 'La habitacion no esta disponible')
  if (result.status === 'overlap') throw new AppError(409, 'RESERVATION_OVERLAP', 'La habitacion ya esta reservada para esas fechas')
  return result.reservation
}
