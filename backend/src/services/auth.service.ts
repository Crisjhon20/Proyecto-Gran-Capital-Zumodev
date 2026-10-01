import { AppError } from '../errors/app-error.js'
import { createClient, findClientByUsername } from '../repositories/client.repository.js'
import { comparePassword, hashPassword } from '../security/password.js'
import { createToken } from '../security/jwt.js'

export async function registerClient(usuario: string, contrasena: string) {
  if (await findClientByUsername(usuario)) {
    throw new AppError(409, 'USERNAME_ALREADY_EXISTS', 'El usuario ya existe')
  }

  const client = await createClient(usuario, await hashPassword(contrasena))
  return client
}

export async function login(usuario: string, contrasena: string) {
  const client = await findClientByUsername(usuario)
  if (!client || !(await comparePassword(contrasena, client.contrasena))) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Usuario o contrasena incorrectos')
  }

  const token = await createToken({
    sub: String(client.identificador),
    username: client.usuario,
    perfil: client.perfil,
  })

  return { token, usuario: client.usuario, perfil: client.perfil }
}

export async function revokeToken(token: string, jti: string, expiresAt: number) {
  await import('../config/database.js').then(({ getPool }) =>
    getPool().query(
      `INSERT INTO revoked_tokens (id, jti, expires_at)
       VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM revoked_tokens), $1, TO_TIMESTAMP($2))
       ON CONFLICT (jti) DO NOTHING`,
      [jti, expiresAt],
    ),
  )
}
