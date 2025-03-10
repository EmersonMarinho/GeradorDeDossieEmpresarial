import React from 'react'
import { CompanyData as CompanyDataType } from '@/types'

interface CompanyDataProps {
  data: CompanyDataType
}

export const CompanyData: React.FC<CompanyDataProps> = ({ data }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados da Empresa</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Informações Básicas</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">CNPJ</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.cnpj}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Nome</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.name || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Natureza Jurídica</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.legalNature || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Capital Social</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {data.capital ? `R$ ${data.capital.toLocaleString('pt-BR')}` : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Data de Fundação</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.foundingDate || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.status || 'N/A'}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Endereço</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Endereço</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {data.address ? `${data.address.street}, ${data.address.number}` : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Complemento</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.address?.complement || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Bairro</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.address?.neighborhood || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Cidade/Estado</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {data.address ? `${data.address.city}/${data.address.state}` : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">CEP</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.address?.zipCode || 'N/A'}</dd>
            </div>
          </dl>
        </div>

        {data.partners && data.partners.length > 0 && (
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Sócios</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.partners.map((partner, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {partner.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {partner.document}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {partner.type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {data.activities && data.activities.length > 0 && (
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Atividades</h3>
            <div className="space-y-4">
              {data.activities.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${
                      activity.isMain ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.isMain ? 'P' : 'S'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Código: {activity.code}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 