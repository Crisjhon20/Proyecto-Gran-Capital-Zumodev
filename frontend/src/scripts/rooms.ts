import { listRooms } from '../services/room-service'
import { getErrorMessage } from '../utils/errors'
import { formatMoney } from '../utils/formatters'
import type { Room } from '../types/room'
import { roomPresentation } from '../utils/room-presentation'

const escapeHtml = (value: unknown) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char] || char)
const grid = document.querySelector('#rooms-grid')
const feedback = document.querySelector<HTMLElement>('#rooms-feedback')
function render(data: Room[]) {
  if (!grid) return
  grid.innerHTML = data.map((room) => { const presentation = roomPresentation(room); return `<article class="room-card soft-card overflow-hidden"><div class="room-visual"><img src="${presentation.image}" alt="${presentation.alt}" loading="lazy"><div class="room-visual-shade"></div><span class="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2 py-1 text-[9px] font-black uppercase">Habitación ${room.id_habitacion}</span><span class="absolute right-3 top-3 z-10 rounded-full px-2 py-1 text-[9px] font-black uppercase ${room.disponibilidad === 'disponible' ? 'bg-[#e8f8f1] text-[#168660]' : 'bg-[#fff0ef] text-[#b54545]'}">${escapeHtml(room.disponibilidad)}</span></div><div class="p-4"><div class="flex items-start justify-between gap-3"><div><p class="text-[10px] font-black uppercase tracking-wider text-[#a26922]">Cama ${escapeHtml(room.cama)}</p><h3 class="mt-1 text-lg font-black text-[#182640]">${presentation.title}</h3><p class="mt-2 text-xs text-[#738099]">${room.frigobar === 'si' ? 'Frigobar · ' : ''}${room.aire_acondicionado === 'si' ? 'Aire · ' : ''}${room.televisor === 'si' ? 'TV · ' : ''}${room.bano_privado === 'si' ? 'Baño privado' : ''}</p></div><strong class="text-xl font-black text-[#182640]">${formatMoney(room.precio)}</strong></div><a href="${room.disponibilidad === 'disponible' ? `/reservations/new?room=${room.id_habitacion}` : '#'}" class="mt-4 flex w-full items-center justify-center rounded-lg py-2.5 text-xs font-black ${room.disponibilidad === 'disponible' ? 'btn-primary' : 'pointer-events-none bg-[#edf1f7] text-[#9aa5b6]'}">${room.disponibilidad === 'disponible' ? 'Reservar habitación →' : 'No disponible'}</a></div></article>` }).join('') || '<div class="soft-card p-8 text-sm text-[#7b879b] md:col-span-2 lg:col-span-3">No encontramos habitaciones con esos filtros.</div>'
}
async function load(filters = {}) {
  if (grid) grid.innerHTML = '<p class="text-sm text-[#7b879b]">Actualizando habitaciones...</p>'
  try { render((await listRooms(filters)).data); feedback?.classList.add('hidden') } catch (error) { if (feedback) { feedback.textContent = getErrorMessage(error); feedback.className = 'mt-5 rounded-lg bg-[#fff0ef] p-3 text-sm text-[#b54545]' } }
}
load()
document.querySelector<HTMLFormElement>('#room-filters')?.addEventListener('submit', (event) => { event.preventDefault(); const data = new FormData(event.currentTarget as HTMLFormElement); load({ cama: data.get('cama') || undefined, precioMin: data.get('precioMin') || undefined, precioMax: data.get('precioMax') || undefined, disponibilidad: data.get('disponibilidad') || undefined }) })
