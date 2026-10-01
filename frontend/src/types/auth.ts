export type Profile = 'administrador' | 'cliente'

export type Session = {
  token: string
  usuario: string
  perfil: Profile
}

export type AuthUser = {
  id: string
  usuario: string
  perfil: Profile
}
