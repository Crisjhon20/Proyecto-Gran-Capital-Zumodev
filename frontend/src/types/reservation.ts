export type Reservation = {
  id_reserva: number
  cliente_id: number
  habitacion_id: number
  fecha_entrada: string
  fecha_salida: string
  estado: 'confirmada' | 'cancelada' | 'completada'
  fecha_creacion?: string
  fecha_cancelacion?: string
  cama?: string
  precio?: string | number
}
