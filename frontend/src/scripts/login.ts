import { getSession } from '../auth/session'
import { login } from '../services/auth-service'
import { credentialsSchema } from '../validators/auth.validators'
import { getErrorMessage } from '../utils/errors'

if (getSession()) window.location.assign('/dashboard')
const form = document.querySelector<HTMLFormElement>('#login-form')
const error = document.querySelector<HTMLElement>('#form-error')

form?.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (error) error.classList.add('hidden')
  const formData = new FormData(form)
  const result = credentialsSchema.safeParse({ usuario: formData.get('usuario'), contrasena: formData.get('contrasena') })
  if (!result.success) {
    if (error) { error.textContent = result.error.issues[0]?.message || 'Revisa los datos'; error.classList.remove('hidden') }
    return
  }
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')
  if (button) { button.disabled = true; button.textContent = 'Validando...' }
  try {
    await login(result.data.usuario, result.data.contrasena)
    window.location.assign('/dashboard')
  } catch (requestError) {
    if (error) { error.textContent = getErrorMessage(requestError); error.classList.remove('hidden') }
    if (button) { button.disabled = false; button.textContent = 'Ingresar al portal →' }
  }
})
