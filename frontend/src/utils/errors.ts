import { ApiRequestError } from '../services/api-client'

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiRequestError) return error.payload.message || 'La solicitud no pudo completarse'
  if (error instanceof Error) return error.message
  return 'Ocurrió un error inesperado'
}
