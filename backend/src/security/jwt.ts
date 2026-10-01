import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { getEnv } from '../config/env.js'

export type AuthPayload = JWTPayload & {
  sub: string
  username: string
  perfil: 'administrador' | 'cliente'
}

function secret() {
  return new TextEncoder().encode(getEnv().JWT_SECRET)
}

export async function createToken(payload: Omit<AuthPayload, 'iat' | 'exp'>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setJti(crypto.randomUUID())
    .setIssuedAt()
    .setExpirationTime(getEnv().JWT_EXPIRES_IN)
    .sign(secret())
}

export async function verifyToken(token: string) {
  const result = await jwtVerify<AuthPayload>(token, secret())
  return result.payload
}
