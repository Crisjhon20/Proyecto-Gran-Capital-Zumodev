import { z } from 'zod'

export const roomFilterSchema = z.object({
  cama: z.enum(['individual', 'doble', 'matrimonial', 'king']).optional(),
  precioMin: z.coerce.number().positive().optional(),
  precioMax: z.coerce.number().positive().optional(),
  disponibilidad: z.enum(['disponible', 'no disponible']).optional(),
  frigobar: z.enum(['si', 'no']).optional(),
  aire_acondicionado: z.enum(['si', 'no']).optional(),
  televisor: z.enum(['si', 'no']).optional(),
  bano_privado: z.enum(['si', 'no']).optional(),
})

export const roomUpdateSchema = z.object({
  cama: z.enum(['individual', 'doble', 'matrimonial', 'king']).optional(),
  precio: z.coerce.number().positive().optional(),
  disponibilidad: z.enum(['disponible', 'no disponible']).optional(),
  frigobar: z.enum(['si', 'no']).optional(),
  aire_acondicionado: z.enum(['si', 'no']).optional(),
  televisor: z.enum(['si', 'no']).optional(),
  bano_privado: z.enum(['si', 'no']).optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: 'Debe enviar al menos un campo para actualizar',
})
