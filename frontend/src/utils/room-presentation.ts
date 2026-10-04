import type { Room } from '../types/room'

export const roomPresentation = (room: Pick<Room, 'id_habitacion' | 'cama'>) => {
  const garden = room.cama === 'individual' || room.cama === 'doble'
  const names = {
    individual: 'Habitacion Jardin',
    doble: 'Habitacion Terraza',
    matrimonial: 'Suite Urbana',
    king: 'Suite Gran Capital',
  }

  return {
    title: names[room.cama],
    image: garden ? '/images/rooms/garden-room.svg' : '/images/rooms/city-room.svg',
    alt: `${names[room.cama]} - habitacion ${room.id_habitacion}`,
  }
}

export function roomImageById(id: number) {
  return [1, 2, 4, 9, 10].includes(id) ? '/images/rooms/garden-room.svg' : '/images/rooms/city-room.svg'
}
