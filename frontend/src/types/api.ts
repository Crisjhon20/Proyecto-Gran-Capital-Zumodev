export type ApiResponse<T> = { data: T }

export type ApiError = {
  error?: string
  message?: string
  issues?: Array<{ path: string[]; message: string }>
}
