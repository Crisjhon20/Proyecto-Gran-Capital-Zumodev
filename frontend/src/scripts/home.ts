import { listRooms } from '../services/room-service'
import { getErrorMessage } from '../utils/errors'
import { formatMoney } from '../utils/formatters'
import type { Room } from '../types/room'
import { roomPresentation } from '../utils/room-presentation'

const escapeHtml = (value: unknown) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char] || char)

function card(room: Room) {
  const available = room.disponibilidad === 'disponible'
  const presentation = roomPresentation(room)
  return `<article class="room-card soft-card overflow-hidden"><div class="room-visual"><img src="${presentation.image}" alt="${presentation.alt}" loading="lazy"><div class="room-visual-shade"></div><span class="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-[#263651]">Habitación ${room.id_habitacion}</span><span class="absolute right-3 top-3 z-10 rounded-full px-2 py-1 text-[9px] font-black uppercase ${available ? 'bg-[#e8f8f1] text-[#168660]' : 'bg-[#fff0ef] text-[#b54545]'}">${escapeHtml(room.disponibilidad)}</span></div><div class="p-4"><div class="flex items-start justify-between gap-3"><div><p class="text-[10px] font-black uppercase tracking-[.12em] text-[#a26922]">Cama ${escapeHtml(room.cama)}</p><h3 class="mt-1 text-lg font-black text-[#182640]">${presentation.title}</h3><p class="mt-2 text-xs text-[#738099]">${room.frigobar === 'si' ? 'Frigobar · ' : ''}${room.aire_acondicionado === 'si' ? 'Aire · ' : ''}${room.televisor === 'si' ? 'TV · ' : ''}${room.bano_privado === 'si' ? 'Baño privado' : ''}</p></div><p class="text-right"><strong class="block text-xl font-black text-[#182640]">${formatMoney(room.precio)}</strong><small class="text-[10px] text-[#7c879b]">por noche</small></p></div><a href="${available ? `/reservations/new?room=${room.id_habitacion}` : '#'}" class="mt-4 flex w-full items-center justify-center rounded-lg py-2.5 text-xs font-black ${available ? 'btn-primary' : 'pointer-events-none bg-[#edf1f7] text-[#9aa5b6]'}">${available ? 'Reservar habitación →' : 'No disponible'}</a></div></article>`
}

const target = document.querySelector('#home-rooms')
if (target) {
  listRooms({ disponibilidad: 'disponible' }).then(({ data }) => {
    target.innerHTML = data.slice(0, 3).map(card).join('') || '<p class="text-sm text-[#7b879b]">No hay habitaciones disponibles ahora.</p>'
  }).catch((error) => { target.innerHTML = `<p class="text-sm text-[#b54545]">${getErrorMessage(error)}</p>` })
}
