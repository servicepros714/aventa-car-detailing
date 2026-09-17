export function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  const len = digits.length
  if (len === 0) return ''
  if (len < 4) return `(${digits}`
  if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function isValidPhone(value) {
  return value.replace(/\D/g, '').length === 10
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
