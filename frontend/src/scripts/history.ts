import { cancelReservation, listReservations } from '../services/reservation-service'
import { getErrorMessage } from '../utils/errors'
import { formatDate, formatMoney } from '../utils/formatters'
import type { Reservation } from '../types/reservation'

const list = document.querySelector('#history-list')
const summary = document.querySelector('#history-summary')
const escapeHtml = (value: unknown) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char] || char)
let reservations: Reservation[] = []
function render() {
  if (summary) summary.innerHTML = [['Todas', reservations.length], ['Confirmadas', reservations.filter((x) => x.estado === 'confirmada').length], ['Canceladas', reservations.filter((x) => x.estado === 'cancelada').length]].map(([label, value]) => `<div class="soft-card p-4"><p class="eyebrow">${label}</p><strong class="mt-1 block text-2xl font-black text-[#182640]">${value}</strong></div>`).join('')
  if (!list) return
  list.innerHTML = reservations.map((item) => `<article class="soft-card grid gap-5 p-4 md:grid-cols-[190px_1fr] md:p-5"><div class="room-visual min-h-[145px]"><span class="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2 py-1 text-[9px] font-black uppercase">Habitación ${item.habitacion_id}</span></div><div><div class="flex flex-wrap items-start justify-between gap-3"><div><p class="text-[10px] font-black uppercase tracking-wider text-[#a26922]">Reserva #${item.id_reserva}</p><h2 class="mt-1 text-xl font-black text-[#182640]">Estancia Gran Capital</h2></div><span class="status-pill status-${item.estado}">${escapeHtml(item.estado)}</span></div><div class="mt-4 grid gap-3 rounded-lg bg-[#f5f7fc] p-3 text-xs sm:grid-cols-3"><div><span class="block text-[9px] font-black uppercase text-[#78849a]">Entrada</span><strong>${formatDate(item.fecha_entrada)}</strong></div><div><span class="block text-[9px] font-black uppercase text-[#78849a]">Salida</span><strong>${formatDate(item.fecha_salida)}</strong></div><div><span class="block text-[9px] font-black uppercase text-[#78849a]">Precio noche</span><strong>${formatMoney(item.precio)}</strong></div></div><div class="mt-4 flex flex-wrap justify-end gap-2">${item.estado === 'confirmada' ? `<a class="btn-secondary" href="/reservations/edit?id=${item.id_reserva}">Editar reserva</a><button class="btn-danger cancel-reservation" data-id="${item.id_reserva}">Cancelar reserva</button>` : ''}</div></div></article>`).join('') || '<div class="soft-card p-8 text-center text-sm text-[#7b879b]"><strong class="block text-base text-[#263651]">Aún no tienes reservas</strong><span class="mt-2 block">Explora una habitación y crea tu primera estancia.</span><a class="btn-primary mt-5" href="/rooms">Explorar habitaciones →</a></div>'
  document.querySelectorAll<HTMLButtonElement>('.cancel-reservation').forEach((button) => button.addEventListener('click', async () => { if (!window.confirm('¿Cancelar esta reserva?')) return; button.disabled = true; try { await cancelReservation(Number(button.dataset.id)); await load() } catch (error) { window.alert(getErrorMessage(error)); button.disabled = false } }))
}
async function load() { try { reservations = (await listReservations()).data; render() } catch (error) { if (list) list.innerHTML = `<p class="text-sm text-[#b54545]">${getErrorMessage(error)}</p>` } }
load()
