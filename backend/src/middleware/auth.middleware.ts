import type { MiddlewareHandler } from 'hono'
import { getPool } from '../config/database.js'
import { AppError } from '../errors/app-error.js'
import { verifyToken } from '../security/jwt.js'
import type { AppVariables } from '../types/context.js'

export const authMiddleware: MiddlewareHandler<{ Variables: AppVariables }> = async (c, next) => {
  const header = c.req.header('Authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined

  if (!token) throw new AppError(401, 'UNAUTHORIZED', 'Se requiere un token Bearer')

  try {
    const payload = await verifyToken(token)
    const jti = payload.jti

    if (!payload.sub || !payload.username || !payload.perfil || !jti) {
      throw new AppError(401, 'INVALID_TOKEN', 'El token no contiene los datos requeridos')
    }

    const revoked = await getPool().query('SELECT 1 FROM revoked_tokens WHERE jti = $1', [jti])
    if (revoked.rowCount) throw new AppError(401, 'REVOKED_TOKEN', 'El token fue revocado')

    c.set('auth', payload)
    c.set('token', token)
    await next()
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(401, 'INVALID_TOKEN', 'El token no es valido')
  }
}

export function requireRole(...roles: Array<'administrador' | 'cliente'>): MiddlewareHandler<{ Variables: AppVariables }> {
  return async (c, next) => {
    const auth = c.get('auth')
    if (!roles.includes(auth.perfil)) {
      throw new AppError(403, 'FORBIDDEN', 'No tienes permisos para realizar esta operacion')
    }
    await next()
  }
}
