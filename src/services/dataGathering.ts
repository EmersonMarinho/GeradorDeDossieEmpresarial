import { validateCNPJ } from '@/lib/cnpj'
import { ReceitaFederalService } from './receitaFederal'
import { JusBrasilService } from './jusbrasil'
import { MediaDataService } from './mediaData'

interface CompanyData {
  cnpj: string
  name?: string
  legalNature?: string
  capital?: number
  foundingDate?: string
  status?: string
  address?: {
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
    zipCode?: string
  }
  partners?: Array<{
    name: string
    document: string
    type: string
  }>
  activities?: Array<{
    code: string
    description: string
    isMain: boolean
  }>
}

export class DataGatheringService {
  private static instance: DataGatheringService
  private receitaFederalService: ReceitaFederalService
  private jusBrasilService: JusBrasilService
  private mediaDataService: MediaDataService

  private constructor() {
    this.receitaFederalService = ReceitaFederalService.getInstance()
    this.jusBrasilService = JusBrasilService.getInstance()
    this.mediaDataService = MediaDataService.getInstance()
  }

  public static getInstance(): DataGatheringService {
    if (!DataGatheringService.instance) {
      DataGatheringService.instance = new DataGatheringService()
    }
    return DataGatheringService.instance
  }

  public async gatherCompanyData(cnpj: string): Promise<CompanyData> {
    if (!validateCNPJ(cnpj)) {
      throw new Error('Invalid CNPJ')
    }

    try {
      const data = await this.receitaFederalService.getCompanyData(cnpj)
      
      return {
        cnpj: data.cnpj,
        name: data.nome,
        legalNature: data.natureza_juridica,
        capital: data.capital_social,
        foundingDate: data.data_abertura,
        status: data.situacao,
        address: {
          street: data.endereco.logradouro,
          number: data.endereco.numero,
          complement: data.endereco.complemento,
          neighborhood: data.endereco.bairro,
          city: data.endereco.municipio,
          state: data.endereco.uf,
          zipCode: data.endereco.cep
        },
        partners: data.socios.map(socio => ({
          name: socio.nome,
          document: socio.cpf,
          type: socio.tipo
        })),
        activities: data.atividades.map(atividade => ({
          code: atividade.codigo,
          description: atividade.descricao,
          isMain: atividade.principal
        }))
      }
    } catch (error) {
      console.error('Error gathering company data:', error)
      throw error
    }
  }

  public async gatherLegalData(cnpj: string): Promise<any> {
    try {
      const data = await this.jusBrasilService.getLegalData(cnpj)
      return data
    } catch (error) {
      console.error('Error gathering legal data:', error)
      return {
        lawsuits: [],
        courtOrders: [],
        bankruptcy: null
      }
    }
  }

  public async gatherMediaData(cnpj: string, companyName: string): Promise<any> {
    try {
      const data = await this.mediaDataService.getMediaData(cnpj, companyName)
      return data
    } catch (error) {
      console.error('Error gathering media data:', error)
      return {
        news: [],
        socialMedia: [],
        complaints: []
      }
    }
  }

  public async gatherRiskData(cnpj: string, companyData: any, legalData: any, mediaData: any): Promise<any> {
    // Calculate risk score based on various factors
    const riskScore = this.calculateRiskScore(companyData, legalData, mediaData)
    
    // Generate warnings based on risk factors
    const warnings = this.generateWarnings(companyData, legalData, mediaData)
    
    // Generate recommendations based on risk factors
    const recommendations = this.generateRecommendations(companyData, legalData, mediaData)

    return {
      riskScore,
      warnings,
      recommendations
    }
  }

  private calculateRiskScore(companyData: any, legalData: any, mediaData: any): number {
    let score = 0
    const weights = {
      legal: 0.4,
      media: 0.3,
      company: 0.3
    }

    // Legal risk factors
    if (legalData.bankruptcy) score += weights.legal * 100
    if (legalData.lawsuits.length > 0) score += weights.legal * (Math.min(legalData.lawsuits.length, 10) * 10)
    if (legalData.courtOrders.length > 0) score += weights.legal * (Math.min(legalData.courtOrders.length, 5) * 20)

    // Media risk factors
    const negativeNews = mediaData.news.filter((n: any) => n.sentiment === 'negative').length
    score += weights.media * (Math.min(negativeNews, 5) * 20)

    const negativeSocial = mediaData.socialMedia.filter((s: any) => s.sentiment === 'negative').length
    score += weights.media * (Math.min(negativeSocial, 3) * 20)

    const complaints = mediaData.complaints.reduce((acc: number, c: any) => acc + c.count, 0)
    score += weights.media * (Math.min(complaints, 10) * 10)

    // Company risk factors
    if (companyData.status !== 'Ativo') score += weights.company * 100
    if (companyData.capital && companyData.capital < 10000) score += weights.company * 30

    return Math.min(Math.round(score), 100)
  }

  private generateWarnings(companyData: any, legalData: any, mediaData: any): Array<{type: string, message: string, details?: string}> {
    const warnings: Array<{type: string, message: string, details?: string}> = []

    // Legal warnings
    if (legalData.bankruptcy) {
      warnings.push({
        type: 'high',
        message: 'Empresa em processo de falência',
        details: `Status: ${legalData.bankruptcy.status}`
      })
    }

    if (legalData.lawsuits.length > 0) {
      warnings.push({
        type: legalData.lawsuits.length > 5 ? 'high' : 'medium',
        message: `${legalData.lawsuits.length} processos em andamento`,
        details: `Último processo: ${new Date(legalData.lawsuits[0].date).toLocaleDateString('pt-BR')}`
      })
    }

    // Media warnings
    const negativeNews = mediaData.news.filter((n: any) => n.sentiment === 'negative').length
    if (negativeNews > 0) {
      warnings.push({
        type: negativeNews > 3 ? 'high' : 'medium',
        message: `${negativeNews} notícias negativas encontradas`,
        details: 'Recomenda-se análise detalhada das notícias'
      })
    }

    const complaints = mediaData.complaints.reduce((acc: number, c: any) => acc + c.count, 0)
    if (complaints > 0) {
      warnings.push({
        type: complaints > 5 ? 'high' : 'medium',
        message: `${complaints} reclamações encontradas`,
        details: 'Recomenda-se análise das reclamações'
      })
    }

    // Company warnings
    if (companyData.status !== 'Ativo') {
      warnings.push({
        type: 'high',
        message: 'Empresa não está ativa',
        details: `Status atual: ${companyData.status}`
      })
    }

    return warnings
  }

  private generateRecommendations(companyData: any, legalData: any, mediaData: any): Array<{priority: string, message: string, action?: string}> {
    const recommendations: Array<{priority: string, message: string, action?: string}> = []

    // Legal recommendations
    if (legalData.lawsuits.length > 0) {
      recommendations.push({
        priority: 'high',
        message: 'Analisar detalhes dos processos em andamento',
        action: 'Solicitar relatório detalhado dos processos'
      })
    }

    // Media recommendations
    const negativeNews = mediaData.news.filter((n: any) => n.sentiment === 'negative').length
    if (negativeNews > 0) {
      recommendations.push({
        priority: 'medium',
        message: 'Realizar análise detalhada das notícias negativas',
        action: 'Contratar serviço de monitoramento de mídia'
      })
    }

    const complaints = mediaData.complaints.reduce((acc: number, c: any) => acc + c.count, 0)
    if (complaints > 0) {
      recommendations.push({
        priority: 'medium',
        message: 'Analisar reclamações e propor melhorias',
        action: 'Implementar plano de gestão de reclamações'
      })
    }

    // Company recommendations
    if (companyData.capital && companyData.capital < 10000) {
      recommendations.push({
        priority: 'low',
        message: 'Avaliar capital social da empresa',
        action: 'Considerar aumento do capital social'
      })
    }

    return recommendations
  }
} 