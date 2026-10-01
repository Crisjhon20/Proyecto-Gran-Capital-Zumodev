import { listRooms } from '../services/room-service'
import { createReservation } from '../services/reservation-service'
import { reservationFormSchema } from '../validators/reservation.validators'
import { getErrorMessage } from '../utils/errors'
import { formatMoney } from '../utils/formatters'

const select = document.querySelector<HTMLSelectElement>('#habitacionId')
const queryRoom = new URLSearchParams(window.location.search).get('room')
const error = document.querySelector<HTMLElement>('#form-error')
const success = document.querySelector<HTMLElement>('#form-success')
listRooms({ disponibilidad: 'disponible' }).then(({ data }) => {
  if (!select) return
  select.innerHTML = '<option value="">Selecciona una habitación</option>' + data.map((room) => `<option value="${room.id_habitacion}" ${String(room.id_habitacion) === queryRoom ? 'selected' : ''}>Habitación ${room.id_habitacion} · ${room.cama} · ${formatMoney(room.precio)} por noche</option>`).join('')
}).catch((requestError) => { if (error) { error.textContent = getErrorMessage(requestError); error.classList.remove('hidden') } })

document.querySelector<HTMLFormElement>('#reservation-form')?.addEventListener('submit', async (event) => {
  event.preventDefault(); error?.classList.add('hidden'); success?.classList.add('hidden')
  const form = event.currentTarget as HTMLFormElement; const data = new FormData(form)
  const result = reservationFormSchema.safeParse({ habitacionId: data.get('habitacionId'), fechaEntrada: data.get('fechaEntrada'), fechaSalida: data.get('fechaSalida') })
  if (!result.success) { if (error) { error.textContent = result.error.issues[0]?.message || 'Revisa los datos'; error.classList.remove('hidden') }; return }
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]'); if (button) { button.disabled = true; button.textContent = 'Guardando...' }
  try { await createReservation({ habitacionId: result.data.habitacionId, fechaEntrada: result.data.fechaEntrada, fechaSalida: result.data.fechaSalida }); if (success) { success.textContent = 'Reserva confirmada. Redirigiendo a tu historial...'; success.classList.remove('hidden') }; setTimeout(() => window.location.assign('/reservations/history'), 900) } catch (requestError) { if (error) { error.textContent = getErrorMessage(requestError); error.classList.remove('hidden') }; if (button) { button.disabled = false; button.textContent = 'Confirmar reserva →' } }
})
