import { validateCNPJ } from '@/lib/cnpj'

interface JusBrasilResponse {
  processos: Array<{
    numero: string
    tribunal: string
    tipo: string
    status: string
    data: string
  }>
  mandados: Array<{
    numero: string
    tribunal: string
    tipo: string
    status: string
    data: string
  }>
  falencia: {
    status: string
    data: string
    tribunal: string
  } | null
}

export class JusBrasilService {
  private static instance: JusBrasilService
  private apiKey: string

  private constructor() {
    this.apiKey = process.env.JUSBRASIL_API_KEY || ''
  }

  public static getInstance(): JusBrasilService {
    if (!JusBrasilService.instance) {
      JusBrasilService.instance = new JusBrasilService()
    }
    return JusBrasilService.instance
  }

  public async getLegalData(cnpj: string): Promise<JusBrasilResponse> {
    if (!validateCNPJ(cnpj)) {
      throw new Error('Invalid CNPJ')
    }

    if (!this.apiKey) {
      throw new Error('JusBrasil API key not configured')
    }

    try {
      const response = await fetch(`https://api.jusbrasil.com/v1/empresa/${cnpj}/processos`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch legal data from JusBrasil')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching legal data:', error)
      throw error
    }
  }
} 