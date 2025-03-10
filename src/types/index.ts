import { ReactNode } from 'react'

export interface CompanyData {
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
  partners?: Partner[]
  activities?: Activity[]
}

export interface NewsData {
  title: string
  source: string
  date: string
  url: string
  summary: string
  sentiment?: 'positive' | 'negative' | 'neutral'
}

export interface LawsuitData {
  number: string
  court: string
  type: string
  status: string
  date: string
  value: number
  parties: string[]
}

export interface PartnershipData {
  company: string
  type: string
  date: string
  description: string
}

export interface FinancialData {
  revenue: number
  profit: number
  employees: number
  lastUpdate: string
}

export interface LegalData {
  lawsuits: LawsuitData[]
  courtOrders: Array<{
    number: string
    court: string
    type: string
    status: string
    date: string
  }>
  bankruptcy: {
    status: string
    date: string
    court: string
  } | null
}

export interface MediaData {
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

export interface RiskData {
  riskScore: number
  warnings: Array<{
    type: 'high' | 'medium' | 'low'
    message: string
    details?: string
  }>
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low'
    message: string
    action?: string
  }>
}

export interface BusinessDossier extends CompanyData {
  disclaimer: ReactNode
  legal: LegalData
  media: MediaData
  risk: RiskData
  generatedAt: string
}

export interface ApiError {
  error: string
  code: string
  details?: any
}

export interface PublicData {
  company: CompanyData
  news: NewsData[]
  lawsuits: LawsuitData[]
  partnerships: PartnershipData[]
  financial: FinancialData
}

export interface Partner {
  name: string
  document: string
  type: string
}

export interface Activity {
  code: string
  description: string
  isMain: boolean
} 