import { z } from 'zod'

export const reservationFormSchema = z.object({
  habitacionId: z.coerce.number().int().positive('Selecciona una habitación'),
  fechaEntrada: z.string().min(1, 'Selecciona la entrada'),
  fechaSalida: z.string().min(1, 'Selecciona la salida'),
}).refine((value) => value.fechaEntrada < value.fechaSalida, {
  message: 'La salida debe ser posterior a la entrada',
  path: ['fechaSalida'],
})
