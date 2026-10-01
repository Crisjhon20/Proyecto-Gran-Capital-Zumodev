import { listRooms } from '../services/room-service'
import { listReservations, updateReservation } from '../services/reservation-service'
import { reservationFormSchema } from '../validators/reservation.validators'
import { getErrorMessage } from '../utils/errors'
import { formatMoney } from '../utils/formatters'

const id = Number(new URLSearchParams(window.location.search).get('id'))
const form = document.querySelector<HTMLFormElement>('#edit-reservation-form')
const select = document.querySelector<HTMLSelectElement>('#habitacionId')
const error = document.querySelector<HTMLElement>('#form-error')
const success = document.querySelector<HTMLElement>('#form-success')
async function load() {
  try {
    const [rooms, reservations] = await Promise.all([listRooms({ disponibilidad: 'disponible' }), listReservations()])
    const reservation = reservations.data.find((item) => item.id_reserva === id)
    if (!reservation || reservation.estado !== 'confirmada') throw new Error('La reserva no puede modificarse')
    if (select) select.innerHTML = rooms.data.map((room) => `<option value="${room.id_habitacion}" ${room.id_habitacion === reservation.habitacion_id ? 'selected' : ''}>Habitación ${room.id_habitacion} · ${room.cama} · ${formatMoney(room.precio)}</option>`).join('')
    const entry = document.querySelector<HTMLInputElement>('#fechaEntrada'); const exit = document.querySelector<HTMLInputElement>('#fechaSalida')
    if (entry) entry.value = reservation.fecha_entrada.slice(0, 10); if (exit) exit.value = reservation.fecha_salida.slice(0, 10)
  } catch (requestError) { if (error) { error.textContent = getErrorMessage(requestError); error.classList.remove('hidden') } }
}
form?.addEventListener('submit', async (event) => { event.preventDefault(); error?.classList.add('hidden'); const data = new FormData(form); const result = reservationFormSchema.safeParse({ habitacionId: data.get('habitacionId'), fechaEntrada: data.get('fechaEntrada'), fechaSalida: data.get('fechaSalida') }); if (!result.success) { if (error) { error.textContent = result.error.issues[0]?.message || 'Revisa los datos'; error.classList.remove('hidden') }; return } const button = form.querySelector<HTMLButtonElement>('button[type="submit"]'); if (button) { button.disabled = true; button.textContent = 'Guardando...' }; try { await updateReservation(id, result.data); if (success) { success.textContent = 'Cambios guardados correctamente.'; success.classList.remove('hidden') }; setTimeout(() => window.location.assign('/reservations/history'), 700) } catch (requestError) { if (error) { error.textContent = getErrorMessage(requestError); error.classList.remove('hidden') }; if (button) { button.disabled = false; button.textContent = 'Guardar cambios →' } } })
load()
