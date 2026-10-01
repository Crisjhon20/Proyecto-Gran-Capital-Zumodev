import { z } from 'zod'

export const credentialsSchema = z.object({
  usuario: z.string().trim().min(1, 'Ingresa tu usuario').max(15, 'Máximo 15 caracteres').regex(/^[A-Za-z0-9]+$/, 'Solo se permiten letras y números'),
  contrasena: z.string().min(8, 'Mínimo 8 caracteres').max(60, 'Máximo 60 caracteres').regex(/^[A-Za-z0-9]+$/, 'Solo se permiten letras y números'),
})

export const registerFormSchema = credentialsSchema.extend({
  confirmacion: z.string(),
}).refine((value) => value.contrasena === value.confirmacion, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmacion'],
})
