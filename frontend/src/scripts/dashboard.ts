import { getMe } from '../services/auth-service'
import { listRooms } from '../services/room-service'
import { listReservations } from '../services/reservation-service'
import { getErrorMessage } from '../utils/errors'
import { formatDate, formatMoney } from '../utils/formatters'
import { roomPresentation } from '../utils/room-presentation'

const escapeHtml = (value: unknown) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char] || char)
const stats = document.querySelectorAll<HTMLElement>('#dashboard-stats > div')
const roomsTarget = document.querySelector('#dashboard-rooms')
const reservationsTarget = document.querySelector('#dashboard-reservations')

Promise.all([getMe(), listRooms({ disponibilidad: 'disponible' }), listReservations()]).then(([user, rooms, reservations]) => {
  const welcome = document.querySelector('#welcome-copy')
  if (welcome) welcome.textContent = `Hola, ${user.data.usuario}. Consulta tus habitaciones y reservas desde un solo lugar.`
  if (stats[0]) stats[0].querySelector('strong')!.textContent = String(rooms.data.length)
  if (stats[1]) stats[1].querySelector('strong')!.textContent = String(reservations.data.filter((item) => item.estado === 'confirmada').length)
  if (stats[2]) stats[2].querySelector('strong')!.textContent = user.data.perfil
  if (roomsTarget) roomsTarget.innerHTML = rooms.data.slice(0, 3).map((room) => { const presentation = roomPresentation(room); return `<article class="room-card soft-card overflow-hidden"><div class="room-visual min-h-[150px]"><img src="${presentation.image}" alt="${presentation.alt}" loading="lazy"><div class="room-visual-shade"></div><span class="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2 py-1 text-[9px] font-black uppercase">Habitación ${room.id_habitacion}</span></div><div class="p-4"><p class="text-[10px] font-black uppercase tracking-wider text-[#a26922]">Cama ${escapeHtml(room.cama)}</p><div class="mt-2 flex items-center justify-between"><h3 class="font-black text-[#182640]">${presentation.title}</h3><strong>${formatMoney(room.precio)}</strong></div><a class="btn-primary mt-4 w-full" href="/reservations/new?room=${room.id_habitacion}">Reservar →</a></div></article>` }).join('') || '<p class="text-sm text-[#7b879b]">No hay habitaciones disponibles.</p>'
  if (reservationsTarget) reservationsTarget.innerHTML = reservations.data.slice(0, 3).map((item) => `<div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f6] p-5 last:border-b-0"><div><p class="text-[10px] font-black uppercase tracking-wider text-[#a26922]">Reserva #${item.id_reserva}</p><strong class="mt-1 block text-sm text-[#25344e]">Habitación ${item.habitacion_id} · ${formatDate(item.fecha_entrada)} — ${formatDate(item.fecha_salida)}</strong></div><span class="status-pill status-${item.estado}">${escapeHtml(item.estado)}</span></div>`).join('') || '<p class="p-6 text-sm text-[#7b879b]">Todavía no tienes reservas.</p>'
}).catch((error) => {
  if (roomsTarget) roomsTarget.innerHTML = `<p class="text-sm text-[#b54545]">${getErrorMessage(error)}</p>`
  if (reservationsTarget) reservationsTarget.innerHTML = ''
})
