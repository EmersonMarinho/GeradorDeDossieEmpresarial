export function validateCNPJ(cnpj: string): boolean {
  // Remove non-numeric characters
  cnpj = cnpj.replace(/[^\d]/g, '')

  // Check if it has 14 digits
  if (cnpj.length !== 14) return false

  // Check for known invalid CNPJs
  if (/^(\d)\1+$/.test(cnpj)) return false

  // Validate first digit
  let sum = 0
  let weight = 5
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  let digit = 11 - (sum % 11)
  if (digit > 9) digit = 0
  if (digit !== parseInt(cnpj.charAt(12))) return false

  // Validate second digit
  sum = 0
  weight = 6
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  digit = 11 - (sum % 11)
  if (digit > 9) digit = 0
  if (digit !== parseInt(cnpj.charAt(13))) return false

  return true
}

export function formatCNPJ(cnpj: string): string {
  // Remove non-numeric characters
  cnpj = cnpj.replace(/[^\d]/g, '')

  // Format as XX.XXX.XXX/XXXX-XX
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  )
} 