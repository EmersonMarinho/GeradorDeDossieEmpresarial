import React from 'react'
import { MediaData as MediaDataType } from '@/types'

interface MediaDataProps {
  data: MediaDataType
}

export const MediaData: React.FC<MediaDataProps> = ({ data }) => {
  const getSentimentColor = (sentiment: string | undefined) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'BOM':
        return 'bg-green-100 text-green-800'
      case 'REGULAR':
        return 'bg-yellow-100 text-yellow-800'
      case 'RUIM':
        return 'bg-red-100 text-red-800'
      case 'CRÍTICO':
        return 'bg-red-200 text-red-900'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getResolutionColor = (resolution: number) => {
    if (resolution >= 80) return 'text-green-600'
    if (resolution >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados de Mídia</h2>

      <div className="space-y-8">
        {/* News */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Notícias</h3>
          {data.news.length > 0 ? (
            <div className="space-y-4">
              {data.news.map((news, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        <a href={news.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                          {news.title}
                        </a>
                      </h4>
                      <p className="text-sm text-gray-500">
                        {news.source} • {new Date(news.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className={`text-sm font-medium ${getSentimentColor(news.sentiment)}`}>
                      {news.sentiment === 'positive' ? 'Positiva' : news.sentiment === 'negative' ? 'Negativa' : 'Neutra'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nenhuma notícia encontrada.</p>
          )}
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Redes Sociais</h3>
          {data.socialMedia.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.socialMedia.map((social, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{social.platform}</h4>
                    <span className={`text-sm font-medium ${getSentimentColor(social.sentiment)}`}>
                      {social.sentiment === 'positive' ? 'Positivo' : social.sentiment === 'negative' ? 'Negativo' : 'Neutro'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">{social.mentions.toLocaleString('pt-BR')}</span> menções
                    </p>
                    <p className="text-sm text-gray-500">
                      Última menção: {new Date(social.lastMention).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nenhuma menção em redes sociais encontrada.</p>
          )}
        </div>

        {/* Complaints */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Reclamações</h3>
          {data.complaints.length > 0 ? (
            <div className="space-y-6">
              {data.complaints.map((complaint, index) => (
                <div key={index} className="bg-white border rounded-lg overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        <a href={complaint.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                          {complaint.source}
                        </a>
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Total de reclamações</p>
                        <p className="text-sm font-medium">{complaint.count.toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Índice de resolução</p>
                        <p className={`text-sm font-medium ${getResolutionColor(complaint.resolution)}`}>
                          {complaint.resolution.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Resolvidas</p>
                        <p className="text-sm font-medium text-green-600">
                          {complaint.details.resolved.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Pendentes</p>
                        <p className="text-sm font-medium text-yellow-600">
                          {complaint.details.pending.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Não resolvidas</p>
                        <p className="text-sm font-medium text-red-600">
                          {complaint.details.notResolved.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tempo médio resposta</p>
                        <p className="text-sm font-medium">
                          {complaint.details.averageResponseTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nenhuma reclamação encontrada.</p>
          )}
        </div>
      </div>
    </div>
  )
} 