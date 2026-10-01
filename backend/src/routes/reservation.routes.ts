import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { reservationSchema, reservationUpdateSchema } from '../schemas/reservation.schema.js'
import { findReservationById } from '../repositories/reservation.repository.js'
import { cancelClientReservation, getReservationHistory, reserveRoom, updateClientReservation } from '../services/reservation.service.js'
import type { AppVariables } from '../types/context.js'

export const reservationRoutes = new Hono<{ Variables: AppVariables }>()
reservationRoutes.use('*', authMiddleware)

reservationRoutes.post('/', zValidator('json', reservationSchema), async (c) => {
  const body = c.req.valid('json')
  const reservation = await reserveRoom(Number(c.get('auth').sub), body.habitacionId, body.fechaEntrada, body.fechaSalida)
  return c.json({ data: reservation }, 201)
})

reservationRoutes.get('/history', async (c) => {
  return c.json({ data: await getReservationHistory(Number(c.get('auth').sub)) })
})

reservationRoutes.patch('/:id', zValidator('json', reservationUpdateSchema), async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ error: 'INVALID_ID', message: 'Identificador invalido' }, 400)
  }

  const body = c.req.valid('json')
  const isAdmin = c.get('auth').perfil === 'administrador'
  const current = await findReservationById(id)

  if (!current) {
    return c.json({ error: 'RESERVATION_NOT_FOUND', message: 'Reserva no encontrada' }, 404)
  }

  const reservation = await updateClientReservation(
    id,
    Number(c.get('auth').sub),
    isAdmin,
    body.habitacionId ?? current.habitacion_id,
    body.fechaEntrada ?? new Date(current.fecha_entrada),
    body.fechaSalida ?? new Date(current.fecha_salida),
  )
  return c.json({ data: reservation })
})

reservationRoutes.patch('/:id/cancel', async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) return c.json({ error: 'INVALID_ID', message: 'Identificador invalido' }, 400)
  return c.json({ data: await cancelClientReservation(id, Number(c.get('auth').sub)) })
})
