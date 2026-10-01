import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { loginSchema, registerSchema } from '../schemas/auth.schema.js'
import { login, registerClient, revokeToken } from '../services/auth.service.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import type { AppVariables } from '../types/context.js'

export const authRoutes = new Hono<{ Variables: AppVariables }>()

authRoutes.post('/register', zValidator('json', registerSchema), async (c) => {
  const body = c.req.valid('json')
  const client = await registerClient(body.usuario, body.contrasena)
  return c.json({ data: client }, 201)
})

authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
  const body = c.req.valid('json')
  return c.json({ data: await login(body.usuario, body.contrasena) })
})

authRoutes.use('/logout', authMiddleware)
authRoutes.post('/logout', async (c) => {
  const payload = c.get('auth')
  await revokeToken(c.get('token'), payload.jti!, payload.exp!)
  return c.json({ message: 'Sesion cerrada correctamente' })
})

authRoutes.use('/me', authMiddleware)
authRoutes.get('/me', (c) => {
  const auth = c.get('auth')
  return c.json({ data: { id: auth.sub, usuario: auth.username, perfil: auth.perfil } })
})
