import { z } from 'zod'

export const reservationSchema = z.object({
  habitacionId: z.coerce.number().int().positive(),
  fechaEntrada: z.coerce.date(),
  fechaSalida: z.coerce.date(),
}).refine((value) => value.fechaEntrada < value.fechaSalida, {
  message: 'La fecha de entrada debe ser anterior a la fecha de salida',
  path: ['fechaSalida'],
})

export const reservationUpdateSchema = z.object({
  habitacionId: z.coerce.number().int().positive().optional(),
  fechaEntrada: z.coerce.date().optional(),
  fechaSalida: z.coerce.date().optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: 'Debe enviar al menos un campo para actualizar',
})
