import { register } from '../services/auth-service'
import { registerFormSchema } from '../validators/auth.validators'
import { getErrorMessage } from '../utils/errors'

const form = document.querySelector<HTMLFormElement>('#register-form')
const error = document.querySelector<HTMLElement>('#form-error')
const success = document.querySelector<HTMLElement>('#form-success')

form?.addEventListener('submit', async (event) => {
  event.preventDefault()
  error?.classList.add('hidden'); success?.classList.add('hidden')
  const data = new FormData(form)
  const result = registerFormSchema.safeParse({ usuario: data.get('usuario'), contrasena: data.get('contrasena'), confirmacion: data.get('confirmacion') })
  if (!result.success) {
    if (error) { error.textContent = result.error.issues[0]?.message || 'Revisa los datos'; error.classList.remove('hidden') }
    return
  }
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')
  if (button) { button.disabled = true; button.textContent = 'Creando cuenta...' }
  try {
    await register(result.data.usuario, result.data.contrasena)
    if (success) { success.textContent = 'Cuenta creada. Ya puedes iniciar sesión.'; success.classList.remove('hidden') }
    form.reset()
  } catch (requestError) {
    if (error) { error.textContent = getErrorMessage(requestError); error.classList.remove('hidden') }
  } finally {
    if (button) { button.disabled = false; button.textContent = 'Crear mi cuenta →' }
  }
})
