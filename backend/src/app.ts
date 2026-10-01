import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { getEnv } from './config/env.js'
import { errorHandler } from './middleware/error.middleware.js'
import { authRoutes } from './routes/auth.routes.js'
import { reservationRoutes } from './routes/reservation.routes.js'
import { roomRoutes } from './routes/room.routes.js'

export const app = new Hono()

app.onError(errorHandler)
app.use('*', logger())
app.use('*', cors({ origin: getEnvSafe().FRONTEND_ORIGIN }))

app.get('/health', (c) => c.json({ status: 'ok', service: 'grancapital-backend' }))
app.route('/api/auth', authRoutes)
app.route('/api/rooms', roomRoutes)
app.route('/api/reservations', reservationRoutes)

function getEnvSafe() {
  try {
    return getEnv()
  } catch {
    return { FRONTEND_ORIGIN: 'http://localhost:5173' }
  }
}

export default app
