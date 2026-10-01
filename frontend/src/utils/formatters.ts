export function formatMoney(value: string | number | undefined) {
  return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(Number(value || 0))
}

export function formatDate(value: string | undefined) {
  if (!value) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
}
