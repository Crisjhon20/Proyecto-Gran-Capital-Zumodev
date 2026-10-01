import { getPool } from '../config/database.js'

export type ClientRow = {
  identificador: number
  usuario: string
  contrasena: string
  perfil: 'administrador' | 'cliente'
}

export async function findClientByUsername(usuario: string) {
  const result = await getPool().query<ClientRow>(
    'SELECT identificador, usuario, contrasena, perfil FROM "RegistroDeCliente" WHERE usuario = $1',
    [usuario],
  )
  return result.rows[0]
}

export async function createClient(usuario: string, contrasena: string) {
  const result = await getPool().query<{ identificador: number; usuario: string; perfil: string }>(
    `INSERT INTO "RegistroDeCliente" (identificador, usuario, contrasena, perfil)
     VALUES ((SELECT COALESCE(MAX(identificador), 0) + 1 FROM "RegistroDeCliente"), $1, $2, 'cliente')
     RETURNING identificador, usuario, perfil`,
    [usuario, contrasena],
  )
  return result.rows[0]
}
