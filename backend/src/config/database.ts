import { Pool } from 'pg'
import { getEnv } from './env.js'

let pool: Pool | undefined

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: getEnv().DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
    })
  }

  return pool
}
