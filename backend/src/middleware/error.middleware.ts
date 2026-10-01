import type { ErrorHandler } from 'hono'
import { AppError } from '../errors/app-error.js'

export const errorHandler: ErrorHandler = (error, c) => {
  if (error instanceof AppError) {
    return c.json({ error: error.code, message: error.message }, error.status as 400)
  }

  console.error(error)
  return c.json({ error: 'INTERNAL_SERVER_ERROR', message: 'Error interno del servidor' }, 500)
}
