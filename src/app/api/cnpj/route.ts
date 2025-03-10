import { NextResponse } from 'next/server'
import { PublicDataService } from '@/services/publicDataService'
import { BusinessDossier, ApiError, PublicData, NewsData } from '@/types'

export async function POST(request: Request) {
  try {
    const { cnpj } = await request.json()

    if (!cnpj) {
      return NextResponse.json<ApiError>(
        { error: 'CNPJ is required', code: 'MISSING_CNPJ' },
        { status: 400 }
      )
    }

    const publicDataService = PublicDataService.getInstance()
    const data = await publicDataService.getCompanyData(cnpj)

    const dossier: BusinessDossier = {
      ...data.company,
      disclaimer: "This report is generated automatically and may contain simulated data for demonstration purposes.",
      legal: {
        lawsuits: data.lawsuits,
        courtOrders: [],
        bankruptcy: null
      },
      media: {
        news: data.news,
        socialMedia: [],
        complaints: []
      },
      risk: {
        riskScore: calculateRiskScore(data),
        warnings: generateWarnings(data),
        recommendations: generateRecommendations(data)
      },
      generatedAt: new Date().toISOString()
    }

    return NextResponse.json(dossier)
  } catch (error) {
    console.error('Error processing CNPJ:', error)
    return NextResponse.json<ApiError>(
      { 
        error: 'Failed to process CNPJ', 
        code: 'PROCESSING_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function calculateRiskScore(data: PublicData): number {
  let score = 50 // Base score

  // Adjust based on lawsuits
  if (data.lawsuits.length > 0) {
    score -= data.lawsuits.length * 5
  }

  // Adjust based on financial data
  if (data.financial) {
    if (data.financial.profit < 0) {
      score -= 10
    }
    if (data.financial.revenue < 1000000) {
      score -= 5
    }
  }

  // Adjust based on news sentiment
  const negativeNews = data.news.filter((n: NewsData) => n.sentiment === 'negative').length
  score -= negativeNews * 3

  return Math.max(0, Math.min(100, score))
}

function generateWarnings(data: PublicData): Array<{ type: 'high' | 'medium' | 'low', message: string, details?: string }> {
  const warnings = []

  // High risk warnings
  if (data.lawsuits.length > 5) {
    warnings.push({
      type: 'high' as const,
      message: 'High number of active lawsuits',
      details: `${data.lawsuits.length} active lawsuits found`
    })
  }

  if (data.financial.profit < 0) {
    warnings.push({
      type: 'high' as const,
      message: 'Negative profit reported',
      details: `Current profit: ${data.financial.profit}`
    })
  }

  // Medium risk warnings
  if (data.news.filter((n: NewsData) => n.sentiment === 'negative').length > 3) {
    warnings.push({
      type: 'medium' as const,
      message: 'Multiple negative news articles',
      details: 'Recent negative media coverage detected'
    })
  }

  // Low risk warnings
  if (data.financial.employees < 10) {
    warnings.push({
      type: 'low' as const,
      message: 'Small company size',
      details: `${data.financial.employees} employees reported`
    })
  }

  return warnings
}

function generateRecommendations(data: PublicData): Array<{ priority: 'high' | 'medium' | 'low', message: string, action?: string }> {
  const recommendations = []

  // High priority recommendations
  if (data.lawsuits.length > 0) {
    recommendations.push({
      priority: 'high' as const,
      message: 'Processos Judiciais Ativos',
      action: 'Avalie os processos judiciais ativos e considere a possibilidade de negociação ou defesa.'
    })
  }

  // Medium priority recommendations
  if (data.financial.profit < 0) {
    recommendations.push({
      priority: 'medium' as const,
      message: 'Melhorar a Estratégia de Negócios',
      action: 'Avalie As estratégias de negócios e a estrutura de custos'
    })
  }

  // Low priority recommendations
  if (data.news.length < 5) {
    recommendations.push({
      priority: 'low' as const,
      message: 'Melhorar o Desempenho Financeiro',
      action: 'Avalie a estratégia de negócios e a estrutura de custos'
    })
  }

  return recommendations
} 