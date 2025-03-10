import { validateCNPJ } from '@/lib/cnpj'

interface ReceitaFederalResponse {
  cnpj: string
  nome: string
  natureza_juridica: string
  capital_social: number
  data_abertura: string
  situacao: string
  endereco: {
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    municipio: string
    uf: string
    cep: string
  }
  socios: Array<{
    nome: string
    cpf: string
    tipo: string
  }>
  atividades: Array<{
    codigo: string
    descricao: string
    principal: boolean
  }>
}

export class ReceitaFederalService {
  private static instance: ReceitaFederalService
  private apiKey: string

  private constructor() {
    this.apiKey = process.env.RECEITA_FEDERAL_API_KEY || ''
  }

  public static getInstance(): ReceitaFederalService {
    if (!ReceitaFederalService.instance) {
      ReceitaFederalService.instance = new ReceitaFederalService()
    }
    return ReceitaFederalService.instance
  }

  public async getCompanyData(cnpj: string): Promise<ReceitaFederalResponse> {
    if (!validateCNPJ(cnpj)) {
      throw new Error('Invalid CNPJ')
    }

    if (!this.apiKey) {
      throw new Error('Receita Federal API key not configured')
    }

    try {
      const response = await fetch(`https://receita-federal-api.example.com/v1/cnpj/${cnpj}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch company data from Receita Federal')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching company data:', error)
      throw error
    }
  }
} 