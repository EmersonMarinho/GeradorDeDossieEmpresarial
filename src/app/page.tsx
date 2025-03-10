'use client'

import { useEffect, useState } from 'react'
import { PDFViewer, usePDF } from '@react-pdf/renderer'
import { CompanyData } from '@/components/CompanyData'
import { LegalData } from '@/components/LegalData'
import { MediaData } from '@/components/MediaData'
import { RiskData } from '@/components/RiskData'
import { DossierPDF } from '@/components/DossierPDF'
import { MinimalDossierPDF } from '@/components/MinimalDossierPDF'
import { ErrorMessage } from '@/components/ErrorMessage'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { validateCNPJ, formatCNPJ } from '@/lib/cnpj'
import { BusinessDossier, ApiError } from '@/types'

export default function Home() {
  const [cnpj, setCnpj] = useState('')
  const [companyData, setCompanyData] = useState<BusinessDossier | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [loading, setLoading] = useState(false)
  const [pdfView, setPdfView] = useState<'full' | 'minimal'>('full')
  const [isPdfVisible, setIsPdfVisible] = useState(false)

  const [fullPdf, setFullPdf] = useState<any>(null)
  const [minimalPdf, setMinimalPdf] = useState<any>(null)

  useEffect(() => {
    if (companyData) {
      const [generatedFullPdf] = usePDF({ document: <DossierPDF data={companyData} /> })
      const [generatedMinimalPdf] = usePDF({ document: <MinimalDossierPDF data={companyData} /> })
      setFullPdf(generatedFullPdf)
      setMinimalPdf(generatedMinimalPdf)
    }
  }, [companyData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!validateCNPJ(cnpj)) {
        throw new Error('CNPJ inválido')
      }

      const response = await fetch('/api/cnpj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cnpj }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar dados da empresa')
      }

      setCompanyData(data)
    } catch (err) {
      setError({
        error: err instanceof Error ? err.message : 'Erro ao processar a requisição',
        code: 'INTERNAL_ERROR',
        details: err instanceof Error ? err.stack : undefined
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 14) {
      setCnpj(formatCNPJ(value))
    }
  }

  const handleRetry = () => {
    setError(null)
    handleSubmit(new Event('submit') as any)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
            Gerador de Dossiê Empresarial
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Gere dossiês empresariais completos automaticamente a partir do CNPJ
          </p>
        </div>

        <div className="mt-10 max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-lg p-8 transition-all duration-300 hover:shadow-xl">
            <div className="space-y-6">
              <div>
                <label htmlFor="cnpj" className="block text-lg font-semibold text-gray-700 mb-2">
                  Digite o CNPJ da Empresa
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  </div>
                  <input
                    type="text"
                    name="cnpj"
                    id="cnpj"
                    value={cnpj}
                    onChange={handleCnpjChange}
                    className="pl-10 shadow-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block w-full text-lg border-gray-300 rounded-lg transition-all duration-300 bg-gray-50 hover:bg-white"
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    disabled={loading}
                  />
                  <div className="mt-1 text-sm text-gray-500">
                    Exemplo: 07.526.557/0001-00 (AMBEV)
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? (
                    <LoadingSpinner size="small" text="Processando..." />
                  ) : (
                    'Gerar Dossiê'
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-4 text-sm text-gray-500 text-center italic">
            Nota: Este é um projeto de demonstração. Os dados apresentados podem ser fictícios ou estar incompletos.
          </div>
        </div>

        {error && (
          <div className="mt-6">
            <ErrorMessage message={error.error} onRetry={handleRetry} />
          </div>
        )}

        {loading && !error && (
          <div className="mt-10">
            <LoadingSpinner size="large" text="Buscando dados da empresa..." />
          </div>
        )}

        {companyData && (
          <div className="mt-10 space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setPdfView('full')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      pdfView === 'full'
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Visualização Completa
                  </button>
                  <button
                    onClick={() => setPdfView('minimal')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      pdfView === 'minimal'
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Visualização Resumida
                  </button>
                </div>
                <div className="flex space-x-4">
                  <a
                    href={fullPdf.url || '#'}
                    download={`dossie-completo-${companyData?.cnpj}.pdf`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                    onClick={(e) => !fullPdf.url && e.preventDefault()}
                  >
                    {fullPdf.loading ? 'Gerando PDF...' : 'Baixar PDF Completo'}
                  </a>

                  <a
                    href={minimalPdf.url || '#'}
                    download={`dossie-resumido-${companyData?.cnpj}.pdf`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                    onClick={(e) => !minimalPdf.url && e.preventDefault()}
                  >
                    {minimalPdf.loading ? 'Gerando PDF...' : 'Baixar PDF Resumido'}
                  </a>
                </div>
              </div>

              {/* Collapsible PDF Preview */}
              <div className="mt-6">
                <button
                  onClick={() => setIsPdfVisible(!isPdfVisible)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-all duration-300"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {isPdfVisible ? 'Ocultar Visualização do PDF' : 'Mostrar Visualização do PDF'}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
                      isPdfVisible ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isPdfVisible && (
                  <div className="mt-4 h-screen transition-all duration-500 ease-in-out">
                    <PDFViewer width="100%" height="100%" className="rounded-lg shadow-lg">
                      {pdfView === 'full' ? (
                        <DossierPDF data={companyData} />
                      ) : (
                        <MinimalDossierPDF data={companyData} />
                      )}
                    </PDFViewer>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Data Components */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <CompanyData data={companyData} />
                <div className="mt-2 text-sm text-gray-500 italic">
                  Nota: Alguns dados podem estar desatualizados ou serem aproximados.
                </div>
              </div>

              {companyData.legal && (
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                  <LegalData data={companyData.legal} />
                  <div className="mt-2 text-sm text-gray-500 italic">
                    Nota: As informações legais podem estar incompletas ou desatualizadas.
                  </div>
                </div>
              )}

              {companyData.media && (
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                  <MediaData data={companyData.media} />
                  <div className="mt-2 text-sm text-gray-500 italic">
                    Nota: Os dados de mídia e redes sociais são simulados para fins de demonstração.
                  </div>
                </div>
              )}

              {companyData.risk && (
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                  <RiskData data={companyData.risk} />
                  <div className="mt-2 text-sm text-gray-500 italic">
                    Nota: A análise de risco é baseada em dados simulados e serve apenas como demonstração.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 