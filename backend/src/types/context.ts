import type { AuthPayload } from '../security/jwt.js'

export type AppVariables = {
  auth: AuthPayload
  token: string
}
