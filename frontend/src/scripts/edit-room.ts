import { listRooms, updateRoom, type RoomUpdate } from '../services/room-service'
import { getErrorMessage } from '../utils/errors'
import type { Room } from '../types/room'

const select = document.querySelector<HTMLSelectElement>('#room-select')
const form = document.querySelector<HTMLFormElement>('#room-edit-form')
const error = document.querySelector<HTMLElement>('#form-error')
const success = document.querySelector<HTMLElement>('#form-success')
let rooms: Room[] = []
function fill(room: Room) {
  ;(['cama', 'precio', 'disponibilidad', 'frigobar', 'aire_acondicionado', 'televisor', 'bano_privado'] as const).forEach((field) => { const input = document.querySelector<HTMLInputElement | HTMLSelectElement>(`#${field}`); if (input) input.value = String(room[field]) })
  const preview = document.querySelector('#room-preview'); if (preview) preview.textContent = `Habitación ${room.id_habitacion} · ${room.cama} · ${room.disponibilidad}`
}
listRooms().then(({ data }) => { rooms = data; if (select) { select.innerHTML = '<option value="">Selecciona una habitación</option>' + data.map((room) => `<option value="${room.id_habitacion}">Habitación ${room.id_habitacion} · ${room.cama}</option>`).join('') }; const fromQuery = Number(new URLSearchParams(window.location.search).get('id')); if (fromQuery) { select!.value = String(fromQuery); const room = rooms.find((item) => item.id_habitacion === fromQuery); if (room) fill(room) } }).catch((requestError) => { if (error) { error.textContent = getErrorMessage(requestError); error.classList.remove('hidden') } })
select?.addEventListener('change', () => { const room = rooms.find((item) => item.id_habitacion === Number(select.value)); if (room) fill(room) })
form?.addEventListener('submit', async (event) => { event.preventDefault(); const id = Number(select?.value); const data = new FormData(form); if (!id) { if (error) { error.textContent = 'Selecciona una habitación'; error.classList.remove('hidden') }; return } const payload: RoomUpdate = { cama: data.get('cama') as RoomUpdate['cama'], precio: Number(data.get('precio')), disponibilidad: data.get('disponibilidad') as RoomUpdate['disponibilidad'], frigobar: data.get('frigobar') as RoomUpdate['frigobar'], aire_acondicionado: data.get('aire_acondicionado') as RoomUpdate['aire_acondicionado'], televisor: data.get('televisor') as RoomUpdate['televisor'], bano_privado: data.get('bano_privado') as RoomUpdate['bano_privado'] }; try { await updateRoom(id, payload); if (success) { success.textContent = 'Habitación actualizada correctamente.'; success.classList.remove('hidden') }; rooms = (await listRooms()).data; const room = rooms.find((item) => item.id_habitacion === id); if (room) fill(room) } catch (requestError) { if (error) { error.textContent = getErrorMessage(requestError); error.classList.remove('hidden') } } })
