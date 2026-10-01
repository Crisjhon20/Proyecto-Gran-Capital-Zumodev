import { getPool } from '../config/database.js'

export type RoomFilters = Record<string, string | number | undefined>

export async function listRooms(filters: RoomFilters = {}) {
  const conditions: string[] = []
  const values: Array<string | number> = []
  const add = (condition: string, value: string | number) => {
    values.push(value)
    conditions.push(`${condition} $${values.length}`)
  }

  if (filters.cama) add('cama =', filters.cama)
  if (filters.precioMin !== undefined) add('precio >=', filters.precioMin)
  if (filters.precioMax !== undefined) add('precio <=', filters.precioMax)
  if (filters.disponibilidad) add('disponibilidad =', filters.disponibilidad)
  if (filters.frigobar) add('frigobar =', filters.frigobar)
  if (filters.aire_acondicionado) add('aire_acondicionado =', filters.aire_acondicionado)
  if (filters.televisor) add('televisor =', filters.televisor)
  if (filters.bano_privado) add('bano_privado =', filters.bano_privado)

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const result = await getPool().query(`SELECT * FROM habitacion ${where} ORDER BY id_habitacion`, values)
  return result.rows
}

export async function findAvailableRoom(id: number) {
  const result = await getPool().query(
    'SELECT * FROM habitacion WHERE id_habitacion = $1 AND disponibilidad = \'disponible\'',
    [id],
  )
  return result.rows[0]
}

export type RoomUpdate = {
  cama?: string
  precio?: number
  disponibilidad?: string
  frigobar?: string
  aire_acondicionado?: string
  televisor?: string
  bano_privado?: string
}

export async function updateRoom(id: number, changes: RoomUpdate) {
  const fields = Object.keys(changes) as Array<keyof RoomUpdate>
  const values = fields.map((field) => changes[field])
  const assignments = fields.map((field, index) => `${field} = $${index + 1}`)

  if (changes.disponibilidad === 'no disponible') {
    const activeReservations = await getPool().query(
      `SELECT 1 FROM reserva
       WHERE habitacion_id = $1
         AND estado = 'confirmada'
         AND fecha_salida >= CURRENT_DATE
       LIMIT 1`,
      [id],
    )
    if (activeReservations.rowCount) return { conflict: 'ROOM_HAS_RESERVATIONS' as const }
  }

  const result = await getPool().query(
    `UPDATE habitacion SET ${assignments.join(', ')} WHERE id_habitacion = $${values.length + 1} RETURNING *`,
    [...values, id],
  )
  return { room: result.rows[0] }
}
