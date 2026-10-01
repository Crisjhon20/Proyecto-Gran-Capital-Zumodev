import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware, requireRole } from '../middleware/auth.middleware.js'
import { listRooms, updateRoom } from '../repositories/room.repository.js'
import { roomFilterSchema, roomUpdateSchema } from '../schemas/room.schema.js'
import type { AppVariables } from '../types/context.js'

export const roomRoutes = new Hono<{ Variables: AppVariables }>()

roomRoutes.get('/', async (c) => c.json({ data: await listRooms() }))
roomRoutes.get('/filter', zValidator('query', roomFilterSchema), async (c) => {
  return c.json({ data: await listRooms(c.req.valid('query')) })
})

roomRoutes.patch('/:id', authMiddleware, requireRole('administrador'), zValidator('json', roomUpdateSchema), async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ error: 'INVALID_ID', message: 'Identificador invalido' }, 400)
  }

  const result = await updateRoom(id, c.req.valid('json'))
  if (result.conflict) {
    return c.json({ error: result.conflict, message: 'La habitacion tiene reservas activas' }, 409)
  }
  if (!result.room) {
    return c.json({ error: 'ROOM_NOT_FOUND', message: 'Habitacion no encontrada' }, 404)
  }
  return c.json({ data: result.room })
})
