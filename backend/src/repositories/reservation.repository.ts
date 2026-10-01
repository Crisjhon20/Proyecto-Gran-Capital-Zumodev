import { getPool } from '../config/database.js'
import type { PoolClient } from 'pg'

export async function hasOverlappingReservation(roomId: number, entry: Date, exit: Date) {
  const result = await getPool().query(
    `SELECT 1 FROM reserva
     WHERE habitacion_id = $1
       AND estado = 'confirmada'
       AND fecha_entrada < $3
       AND fecha_salida > $2
     LIMIT 1`,
    [roomId, entry, exit],
  )
  return Boolean(result.rowCount)
}

export async function createReservation(clientId: number, roomId: number, entry: Date, exit: Date) {
  const result = await getPool().query(
    `INSERT INTO reserva (id_reserva, cliente_id, habitacion_id, fecha_entrada, fecha_salida, estado)
     VALUES ((SELECT COALESCE(MAX(id_reserva), 0) + 1 FROM reserva), $1, $2, $3, $4, 'confirmada')
     RETURNING *`,
    [clientId, roomId, entry, exit],
  )
  return result.rows[0]
}

export async function listClientReservations(clientId: number) {
  const result = await getPool().query(
    `SELECT r.*, h.cama, h.precio
     FROM reserva r
     JOIN habitacion h ON h.id_habitacion = r.habitacion_id
     WHERE r.cliente_id = $1
     ORDER BY r.fecha_creacion DESC, r.id_reserva DESC`,
    [clientId],
  )
  return result.rows
}

export async function findReservationById(id: number) {
  const result = await getPool().query(
    `SELECT r.*, h.cama, h.precio
     FROM reserva r
     JOIN habitacion h ON h.id_habitacion = r.habitacion_id
     WHERE r.id_reserva = $1`,
    [id],
  )
  return result.rows[0]
}

export async function cancelReservation(id: number, clientId: number) {
  const result = await getPool().query(
    `UPDATE reserva
     SET estado = 'cancelada', fecha_cancelacion = CURRENT_TIMESTAMP
     WHERE id_reserva = $1 AND cliente_id = $2 AND estado = 'confirmada'
     RETURNING *`,
    [id, clientId],
  )
  return result.rows[0]
}

type ReservationUpdate = {
  roomId: number
  entry: Date
  exit: Date
}

export async function updateReservation(
  id: number,
  actorId: number,
  isAdmin: boolean,
  changes: ReservationUpdate,
) {
  const client = await getPool().connect()

  try {
    await client.query('BEGIN')
    const current = await client.query(
      'SELECT * FROM reserva WHERE id_reserva = $1 FOR UPDATE',
      [id],
    )

    if (!current.rowCount) {
      await client.query('ROLLBACK')
      return { status: 'not_found' as const }
    }

    const reservation = current.rows[0]
    if (!isAdmin && reservation.cliente_id !== actorId) {
      await client.query('ROLLBACK')
      return { status: 'forbidden' as const }
    }

    if (reservation.estado !== 'confirmada') {
      await client.query('ROLLBACK')
      return { status: 'not_editable' as const }
    }

    const room = await client.query(
      `SELECT 1 FROM habitacion
       WHERE id_habitacion = $1 AND disponibilidad = 'disponible'`,
      [changes.roomId],
    )
    if (!room.rowCount) {
      await client.query('ROLLBACK')
      return { status: 'room_unavailable' as const }
    }

    const overlap = await client.query(
      `SELECT 1 FROM reserva
       WHERE id_reserva <> $1
         AND habitacion_id = $2
         AND estado = 'confirmada'
         AND fecha_entrada < $4
         AND fecha_salida > $3
       LIMIT 1`,
      [id, changes.roomId, changes.entry, changes.exit],
    )
    if (overlap.rowCount) {
      await client.query('ROLLBACK')
      return { status: 'overlap' as const }
    }

    const updated = await client.query(
      `UPDATE reserva
       SET habitacion_id = $1, fecha_entrada = $2, fecha_salida = $3
       WHERE id_reserva = $4
       RETURNING *`,
      [changes.roomId, changes.entry, changes.exit, id],
    )

    await client.query('COMMIT')
    return { status: 'updated' as const, reservation: updated.rows[0] }
  } catch (error) {
    await rollback(client)
    throw error
  } finally {
    client.release()
  }
}

async function rollback(client: PoolClient) {
  try {
    await client.query('ROLLBACK')
  } catch {
    // Preserve the original database error.
  }
}
