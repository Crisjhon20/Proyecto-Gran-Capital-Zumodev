import { z } from 'zod'

export const registerSchema = z.object({
  usuario: z.string().trim().min(1).max(15).regex(/^[A-Za-z0-9]+$/),
  contrasena: z.string().min(8).max(60).regex(/^[A-Za-z0-9]+$/),
})

export const loginSchema = registerSchema
