import React from 'react'
import { RiskData as RiskDataType } from '@/types'

interface RiskDataProps {
  data: RiskDataType
}

export const RiskData: React.FC<RiskDataProps> = ({ data }) => {
  const getRiskColor = (score: number) => {
    if (score <= 3) return 'text-green-600'
    if (score <= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getWarningColor = (type: 'high' | 'medium' | 'low') => {
    switch (type) {
      case 'high':
        return 'bg-red-50 border-red-400 text-red-800'
      case 'medium':
        return 'bg-yellow-50 border-yellow-400 text-yellow-800'
      case 'low':
        return 'bg-green-50 border-green-400 text-green-800'
    }
  }

  const getRecommendationColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-800 border-red-400'
      case 'medium':
        return 'bg-yellow-50 text-yellow-800 border-yellow-400'
      case 'low':
        return 'bg-green-50 text-green-800 border-green-400'
      default:
        return 'bg-gray-50 text-gray-800 border-gray-400'
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Análise de Risco</h2>

      <div className="space-y-8">
        {/* Risk Score */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Score de Risco</h3>
          <div className="flex items-center">
            <div className={`text-4xl font-bold ${getRiskColor(data.riskScore)}`}>
              {data.riskScore.toFixed(1)}
            </div>
            <div className="ml-4 text-sm text-gray-500">
              <p>Escala de 1 a 10</p>
              <p>1 = Menor risco</p>
              <p>10 = Maior risco</p>
            </div>
          </div>
        </div>

        {/* Warnings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Alertas</h3>
          <div className="space-y-4">
            {data.warnings.map((warning, index) => (
              <div key={index} className={`border-l-4 p-4 ${getWarningColor(warning.type)}`}>
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{warning.message}</h4>
                    {warning.details && (
                      <p className="mt-1 text-sm opacity-75">{warning.details}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recomendações</h3>
          <div className="space-y-4">
            {data.recommendations.map((recommendation, index) => (
              <div key={index} className="bg-white border rounded-lg p-4">
                <div className="flex items-start">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    recommendation.priority === 'high' ? 'bg-red-500' :
                    recommendation.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">{recommendation.message}</h4>
                    {recommendation.action && (
                      <p className="mt-1 text-sm text-gray-500">{recommendation.action}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 