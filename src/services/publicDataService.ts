import axios from 'axios'
import cheerio from 'cheerio'
import { format, subDays } from 'date-fns'
import { formatCNPJ } from '@/lib/cnpj'
import { 
  CompanyData, 
  NewsData, 
  LawsuitData, 
  PartnershipData, 
  FinancialData,
  Partner,
  Activity
} from '@/types'

// CNPJ da AMBEV: 07.526.557/0001-00
const AMBEV_CNPJ = '07526557000100'

interface PublicData {
  company: CompanyData
  news: NewsData[]
  lawsuits: LawsuitData[]
  partnerships: PartnershipData[]
  financial: FinancialData
  media: {
    news: NewsData[]
    socialMedia: Array<{
      platform: string
      mentions: number
      sentiment: 'positive' | 'negative' | 'neutral'
      lastMention: string
    }>
    complaints: Array<{
      source: string
      count: number
      lastComplaint: string
      url: string
      status: string
      resolution: number
      details: {
        resolved: number
        pending: number
        notResolved: number
        averageResponseTime: string
      }
    }>
  }
}

interface ReceitaFederalResponse {
  razao_social: string
  natureza_juridica: {
    id: string
    descricao: string
  }
  capital_social: string
  estabelecimento: {
    data_inicio_atividade: string
    situacao_cadastral: string
    tipo_logradouro: string
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cidade: {
      nome: string
    }
    estado: {
      sigla: string
    }
    cep: string
    atividade_principal: {
      id: string
      descricao: string
    }
    atividades_secundarias: Array<{
      id: string
      descricao: string
    }>
  }
  socios: Array<{
    nome: string
    cpf_cnpj_socio: string
    tipo: string
  }>
}

interface CompanyApiResponse {
  name: string
  cnpj: string
  legalNature: string
  capital: number
  foundingDate: string
  status: string
  address: {
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
}

interface NewsApiResponse {
  title: string
  source: string
  date: string
  url: string
  summary: string
}

interface LawsuitApiResponse {
  number: string
  court: string
  type: string
  status: string
  date: string
  value: number
  parties: string[]
}

interface PartnershipApiResponse {
  company: string
  type: string
  date: string
  description: string
}

interface FinancialApiResponse {
  revenue: number
  profit: number
  employees: number
  lastUpdate: string
}

export class PublicDataService {
  private static instance: PublicDataService
  private readonly baseUrl = 'https://api.example.com' // Replace with actual API endpoints

  private constructor() {}

  public static getInstance(): PublicDataService {
    if (!PublicDataService.instance) {
      PublicDataService.instance = new PublicDataService()
    }
    return PublicDataService.instance
  }

  public async getCompanyData(cnpj: string): Promise<PublicData> {
    try {
      // Fetch company data from Receita Federal
      const companyData = await this.fetchCompanyData(cnpj)
      
      // Special case for Ambev - ensure consistent data
      if (cnpj.replace(/\D/g, '') === '07526557000100') {
        const newsData = this.getMockNewsData()
        const lawsuitsData = [
          {
            number: '1234567-89.2023.8.26.0100',
            court: 'TJSP',
            type: 'Processo Civil',
            status: 'Em andamento',
            date: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
            value: 100000,
            parties: ['Consumidor', 'Ambev S.A.']
          }
        ]
        const partnershipsData = [
          {
            company: 'Cervejaria Colorado',
            type: 'Aquisição',
            date: '2015-07-01',
            description: 'Aquisição da Cervejaria Colorado'
          }
        ]
        const financialData = {
          revenue: 75800000000, // Valores aproximados baseados em dados públicos
          profit: 12500000000,
          employees: 30000,
          lastUpdate: format(new Date(), 'yyyy-MM-dd')
        }

        return {
          company: companyData,
          news: newsData,
          lawsuits: lawsuitsData,
          partnerships: partnershipsData,
          financial: financialData,
          media: {
            news: newsData,
            socialMedia: this.getMockSocialMediaData(companyData.name),
            complaints: this.getMockComplaintsData(companyData.name)
          }
        }
      }
      
      // For other companies, generate mock data
      const newsData = this.getMockNewsData()
      const lawsuitsData = this.getMockLawsuitsData()
      const partnershipsData = this.getMockPartnershipsData()
      const financialData = this.getMockFinancialData()
      const socialMediaData = this.getMockSocialMediaData(companyData.name)
      const complaintsData = this.getMockComplaintsData(companyData.name)

      return {
        company: companyData,
        news: newsData,
        lawsuits: lawsuitsData,
        partnerships: partnershipsData,
        financial: financialData,
        media: {
          news: newsData,
          socialMedia: socialMediaData,
          complaints: complaintsData
        }
      }
    } catch (error) {
      console.error('Error fetching company data:', error)
      return this.getMockData(cnpj)
    }
  }

  private async fetchCompanyData(cnpj: string): Promise<CompanyData> {
    const cleanCNPJ = cnpj.replace(/\D/g, '')

    try {
      console.log('Fetching data for CNPJ:', cleanCNPJ)
      const response = await axios.get<ReceitaFederalResponse>(`https://publica.cnpj.ws/cnpj/${cleanCNPJ}`)
      const data = response.data
      console.log('API Response:', data)

      if (!data) {
        console.log('No data received from API, using mock data')
        return this.getMockCompanyData(cleanCNPJ)
      }

      return {
        name: data.razao_social || this.getCompanyNameFromCNPJ(cleanCNPJ),
        cnpj: formatCNPJ(cleanCNPJ),
        legalNature: data.natureza_juridica?.descricao || "Sociedade Empresária Limitada",
        capital: parseFloat(data.capital_social) || this.getRandomCapital(),
        foundingDate: data.estabelecimento?.data_inicio_atividade || this.getRandomPastDate(),
        status: data.estabelecimento?.situacao_cadastral || "Ativa",
        address: {
          street: `${data.estabelecimento?.tipo_logradouro || ''} ${data.estabelecimento?.logradouro || 'Endereço não disponível'}`.trim(),
          number: data.estabelecimento?.numero || "S/N",
          complement: data.estabelecimento?.complemento || "",
          neighborhood: data.estabelecimento?.bairro || "Bairro não disponível",
          city: data.estabelecimento?.cidade?.nome || "Cidade não disponível",
          state: data.estabelecimento?.estado?.sigla || "SP",
          zipCode: data.estabelecimento?.cep || "00000-000"
        },
        partners: data.socios?.map(socio => ({
          name: socio.nome,
          document: socio.cpf_cnpj_socio,
          type: socio.tipo
        })) || this.getRandomPartners(),
        activities: [
          {
            code: data.estabelecimento?.atividade_principal?.id || "00000",
            description: data.estabelecimento?.atividade_principal?.descricao || "Atividade não especificada",
            isMain: true
          },
          ...(data.estabelecimento?.atividades_secundarias?.map(ativ => ({
            code: ativ.id || "00000",
            description: ativ.descricao || "Atividade não especificada",
            isMain: false
          })) || [])
        ]
      }
    } catch (error) {
      console.error('Error fetching company data:', error)
      return this.getMockCompanyData(cleanCNPJ)
    }
  }

  private async fetchNewsData(companyName: string): Promise<NewsData[]> {
    try {
      const response = await axios.get<NewsApiResponse[]>(`${this.baseUrl}/news`, {
        params: { q: companyName }
      })
      return response.data.map(item => ({
        title: item.title,
        source: item.source,
        date: item.date,
        url: item.url,
        summary: item.summary,
        sentiment: this.analyzeSentiment(item.summary)
      }))
    } catch (error) {
      return this.getMockNewsData()
    }
  }

  private async fetchLawsuitsData(cnpj: string): Promise<LawsuitData[]> {
    try {
      const response = await axios.get<LawsuitApiResponse[]>(`${this.baseUrl}/lawsuits/${cnpj}`)
      return response.data.map(item => ({
        number: item.number,
        court: item.court,
        type: item.type,
        status: item.status,
        date: item.date,
        value: item.value,
        parties: item.parties
      }))
    } catch (error) {
      return this.getMockLawsuitsData()
    }
  }

  private async fetchPartnershipsData(cnpj: string): Promise<PartnershipData[]> {
    try {
      const response = await axios.get<PartnershipApiResponse[]>(`${this.baseUrl}/partnerships/${cnpj}`)
      return response.data.map(item => ({
        company: item.company,
        type: item.type,
        date: item.date,
        description: item.description
      }))
    } catch (error) {
      return this.getMockPartnershipsData()
    }
  }

  private async fetchFinancialData(cnpj: string): Promise<FinancialData> {
    try {
      const response = await axios.get<FinancialApiResponse>(`${this.baseUrl}/financial/${cnpj}`)
      return {
        revenue: response.data.revenue,
        profit: response.data.profit,
        employees: response.data.employees,
        lastUpdate: response.data.lastUpdate
      }
    } catch (error) {
      return this.getMockFinancialData()
    }
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['crescimento', 'lucro', 'sucesso', 'inovação', 'sustentável', 'premiada', 'líder']
    const negativeWords = ['multa', 'processo', 'reclamação', 'prejuízo', 'investigação', 'denúncia']
    
    const textLower = text.toLowerCase()
    let score = 0
    
    positiveWords.forEach(word => {
      if (textLower.includes(word)) score += 1
    })
    
    negativeWords.forEach(word => {
      if (textLower.includes(word)) score -= 1
    })
    
    if (score > 0) return 'positive'
    if (score < 0) return 'negative'
    return 'neutral'
  }

  private getMockData(cnpj: string): PublicData {
    const companyData = this.getMockCompanyData(cnpj)
    return {
      company: companyData,
      news: this.getMockNewsData(),
      lawsuits: this.getMockLawsuitsData(),
      partnerships: this.getMockPartnershipsData(),
      financial: this.getMockFinancialData(),
      media: {
        news: this.getMockNewsData(),
        socialMedia: this.getMockSocialMediaData(companyData.name),
        complaints: this.getMockComplaintsData(companyData.name)
      }
    }
  }

  private getMockCompanyData(cnpj: string): CompanyData {
    const cleanCNPJ = cnpj.replace(/\D/g, '')
    const companyName = this.getCompanyNameFromCNPJ(cleanCNPJ)
    
    return {
      name: companyName,
      cnpj: formatCNPJ(cleanCNPJ),
      legalNature: "Sociedade Empresária Limitada",
      capital: this.getRandomCapital(),
      foundingDate: this.getRandomPastDate(),
      status: "Ativa",
      address: {
        street: "Avenida Paulista",
        number: String(Math.floor(Math.random() * 2000) + 1),
        complement: "",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
        zipCode: "01310-100"
      },
      partners: this.getRandomPartners(),
      activities: this.getRandomActivities()
    }
  }

  private getCompanyNameFromCNPJ(cnpj: string): string {
    // Remove any non-numeric characters from CNPJ
    const cleanCNPJ = cnpj.replace(/\D/g, '')
    
    const companies: Record<string, string> = {
      '07526557000100': 'Ambev S.A.',
      '13347016000117': 'Meta Platforms Brasil Ltda.',
      '60746948000112': 'Banco Bradesco S.A.',
      '33000167000101': 'Petróleo Brasileiro S.A. - Petrobras',
      '33041260065290': 'Vale S.A.',
      '60840055000131': 'Itaú Unibanco S.A.',
      '59105999000186': 'Magazine Luiza S.A.',
      '47508411000156': 'Natura Cosméticos S.A.',
      '00000000000191': 'Banco do Brasil S.A.',
      '02558157000162': 'VIVO - Telefônica Brasil S.A.'
    }

    // Try to find the company in our database
    if (companies[cleanCNPJ]) {
      return companies[cleanCNPJ]
    }

    // If we don't have the company in our database, try to get it from the API response
    // If that fails too, return a formatted version of the CNPJ
    return `Empresa ${formatCNPJ(cleanCNPJ)}`
  }

  private getRandomCapital(): number {
    const capitals = [100000, 500000, 1000000, 5000000, 10000000]
    return capitals[Math.floor(Math.random() * capitals.length)]
  }

  private getRandomPastDate(): string {
    const start = new Date(2000, 0, 1)
    const end = new Date(2022, 11, 31)
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return date.toISOString().split('T')[0]
  }

  private getRandomAddress(): CompanyData['address'] {
    const addresses = [
      {
        street: "Avenida Paulista",
        number: "1000",
        complement: "Andar 10",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
        zipCode: "01310-100"
      },
      {
        street: "Avenida Rio Branco",
        number: "156",
        complement: "Sala 801",
        neighborhood: "Centro",
        city: "Rio de Janeiro",
        state: "RJ",
        zipCode: "20040-901"
      },
      {
        street: "Avenida Getúlio Vargas",
        number: "1300",
        complement: "Conjunto 1001",
        neighborhood: "Savassi",
        city: "Belo Horizonte",
        state: "MG",
        zipCode: "30112-021"
      }
    ]
    return addresses[Math.floor(Math.random() * addresses.length)]
  }

  private getRandomPartners(): Partner[] {
    return [
      {
        name: "João Silva",
        document: "123.456.789-00",
        type: "Sócio Administrador"
      },
      {
        name: "Maria Santos",
        document: "987.654.321-00",
        type: "Sócio"
      }
    ]
  }

  private getRandomActivities(): Activity[] {
    const activities = [
      {
        code: "6202-3/00",
        description: "Desenvolvimento de software",
        isMain: true
      },
      {
        code: "6311-9/00",
        description: "Tratamento de dados e hospedagem",
        isMain: false
      },
      {
        code: "7020-4/00",
        description: "Consultoria empresarial",
        isMain: false
      }
    ]
    return activities
  }

  private getMockNewsData(): NewsData[] {
    const newsTemplates = [
      {
        positive: [
          { title: "Empresa anuncia expansão e novos investimentos", summary: "Planos de crescimento incluem abertura de novas unidades" },
          { title: "Resultados superam expectativas do mercado", summary: "Lucro cresceu 25% em relação ao ano anterior" },
          { title: "Empresa recebe prêmio de inovação", summary: "Reconhecimento por práticas sustentáveis e inovadoras" },
          { title: "Nova parceria estratégica anunciada", summary: "Acordo promete impulsionar crescimento nos próximos anos" }
        ],
        negative: [
          { title: "Empresa enfrenta desafios no mercado", summary: "Resultados abaixo das expectativas preocupam investidores" },
          { title: "Investigação apura irregularidades", summary: "Órgãos reguladores iniciam averiguação de denúncias" },
          { title: "Queda nas vendas preocupa acionistas", summary: "Empresa anuncia revisão de estratégia comercial" }
        ],
        neutral: [
          { title: "Empresa anuncia mudanças na diretoria", summary: "Novo CEO assume comando a partir do próximo mês" },
          { title: "Reestruturação organizacional em andamento", summary: "Mudanças visam otimizar operações e reduzir custos" },
          { title: "Empresa revisa projeções para 2024", summary: "Ajustes consideram novo cenário econômico" }
        ]
      }
    ]

    const sources = ["Valor Econômico", "G1", "Estadão", "Folha de S.Paulo", "InfoMoney", "Reuters"]
    const numberOfNews = Math.floor(Math.random() * 5) + 3 // 3 a 7 notícias
    const news: NewsData[] = []

    for (let i = 0; i < numberOfNews; i++) {
      const sentiment = Math.random() > 0.7 ? 'negative' : Math.random() > 0.5 ? 'neutral' : 'positive'
      const templates = newsTemplates[0][sentiment]
      const template = templates[Math.floor(Math.random() * templates.length)]
      const source = sources[Math.floor(Math.random() * sources.length)]
      const daysAgo = Math.floor(Math.random() * 30) // Últimos 30 dias

      news.push({
        title: template.title,
        source: source,
        date: format(subDays(new Date(), daysAgo), 'yyyy-MM-dd'),
        url: `https://exemplo.com/noticias/${daysAgo}`,
        summary: template.summary,
        sentiment: sentiment
      })
    }

    return news
  }

  private getMockLawsuitsData(): LawsuitData[] {
    return [
      {
        number: format(new Date(), 'yyyyMMdd-') + Math.floor(Math.random() * 10000),
        court: 'TJSP',
        type: 'Processo Trabalhista',
        status: 'Em andamento',
        date: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        value: 50000,
        parties: ['Reclamante Anônimo', 'Empresa']
      },
      {
        number: format(new Date(), 'yyyyMMdd-') + Math.floor(Math.random() * 10000),
        court: 'TJSP',
        type: 'Processo Civil',
        status: 'Concluído',
        date: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
        value: 25000,
        parties: ['Consumidor Anônimo', 'Empresa']
      }
    ]
  }

  private getMockPartnershipsData(): PartnershipData[] {
    return [
      {
        company: 'Example Partner',
        type: 'Strategic',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: 'Example partnership description'
      }
    ]
  }

  private getMockFinancialData(): FinancialData {
    return {
      revenue: 10000000,
      profit: 1000000,
      employees: 100,
      lastUpdate: format(new Date(), 'yyyy-MM-dd')
    }
  }

  private getMockSocialMediaData(companyName: string): Array<{
    platform: string
    mentions: number
    sentiment: 'positive' | 'negative' | 'neutral'
    lastMention: string
  }> {
    const platforms = [
      { name: "LinkedIn", baseCount: 5000, multiplier: 2 },
      { name: "Twitter", baseCount: 10000, multiplier: 5 },
      { name: "Instagram", baseCount: 8000, multiplier: 3 },
      { name: "Facebook", baseCount: 15000, multiplier: 4 }
    ]

    return platforms.map(platform => {
      const randomMultiplier = Math.random() * platform.multiplier + 1
      const mentions = Math.floor(platform.baseCount * randomMultiplier)
      const daysAgo = Math.floor(Math.random() * 7)
      const sentiments: Array<'positive' | 'negative' | 'neutral'> = ['positive', 'negative', 'neutral']
      const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)]

      return {
        platform: platform.name,
        mentions: mentions,
        sentiment: sentiment,
        lastMention: format(subDays(new Date(), daysAgo), 'yyyy-MM-dd')
      }
    })
  }

  private getMockComplaintsData(companyName: string): Array<{
    source: string
    count: number
    lastComplaint: string
    url: string
    status: string
    resolution: number
    details: {
      resolved: number
      pending: number
      notResolved: number
      averageResponseTime: string
    }
  }> {
    const generateComplaint = (sourceName: string, baseCount: number) => {
      const randomMultiplier = Math.random() * 0.5 + 0.75 // 75% a 125% do baseCount
      const totalComplaints = Math.floor(baseCount * randomMultiplier)
      const resolution = Math.floor(Math.random() * 30) + 60 // 60% a 90%
      
      const resolved = Math.floor(totalComplaints * (resolution / 100))
      const pending = Math.floor((totalComplaints - resolved) * 0.6)
      const notResolved = totalComplaints - resolved - pending

      const responseHours = Math.floor(Math.random() * 48) + 24 // 24 a 72 horas

      return {
        source: sourceName,
        count: totalComplaints,
        lastComplaint: format(subDays(new Date(), Math.floor(Math.random() * 7)), 'yyyy-MM-dd'),
        url: sourceName === "Reclame Aqui" 
          ? `https://www.reclameaqui.com.br/empresa/${companyName.toLowerCase().replace(/\s+/g, '-')}`
          : "https://consumidor.gov.br",
        status: resolution >= 80 ? "BOM" : resolution >= 70 ? "REGULAR" : "RUIM",
        resolution: resolution,
        details: {
          resolved,
          pending,
          notResolved,
          averageResponseTime: `${responseHours}h`
        }
      }
    }

    return [
      generateComplaint("Reclame Aqui", 1000),
      generateComplaint("Consumidor.gov.br", 500)
    ]
  }

  private calculateRiskScore(data: PublicData): number {
    let score = 70 // Base score

    // Ajusta baseado em processos
    const lawsuitImpact = data.lawsuits.length * 3
    score -= Math.min(lawsuitImpact, 30) // Máximo -30 pontos

    // Ajusta baseado em dados financeiros
    if (data.financial) {
      if (data.financial.profit < 0) score -= 15
      if (data.financial.revenue < 1000000) score -= 10
      if (data.financial.employees < 50) score -= 5
    }

    // Ajusta baseado em notícias
    const negativeNews = data.news.filter(n => n.sentiment === 'negative').length
    score -= negativeNews * 5

    // Ajusta baseado em reclamações
    const complaints = data.media.complaints
    const totalComplaints = complaints.reduce((sum, c) => sum + c.count, 0)
    const avgResolution = complaints.reduce((sum, c) => sum + c.resolution, 0) / complaints.length
    
    if (totalComplaints > 1000) score -= 10
    if (avgResolution < 70) score -= 10

    // Ajusta baseado em redes sociais
    const negativeSocialMedia = data.media.socialMedia.filter(sm => sm.sentiment === 'negative').length
    score -= negativeSocialMedia * 3

    return Math.max(0, Math.min(100, score))
  }
} 