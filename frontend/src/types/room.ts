export type Room = {
  id_habitacion: number
  cama: 'individual' | 'doble' | 'matrimonial' | 'king'
  precio: string | number
  disponibilidad: 'disponible' | 'no disponible'
  frigobar: 'si' | 'no'
  aire_acondicionado: 'si' | 'no'
  televisor: 'si' | 'no'
  bano_privado: 'si' | 'no'
}
