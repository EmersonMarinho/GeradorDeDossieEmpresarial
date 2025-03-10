import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { BusinessDossier } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff'
  },
  section: {
    marginBottom: 20
  },
  header: {
    marginBottom: 30,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280'
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#111827'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    width: 150,
    fontSize: 10,
    color: '#6b7280'
  },
  value: {
    flex: 1,
    fontSize: 10,
    color: '#111827'
  },
  disclaimer: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 5,
    fontStyle: 'italic'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center'
  }
})

interface MinimalDossierPDFProps {
  data: BusinessDossier
}

export const MinimalDossierPDF: React.FC<MinimalDossierPDFProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{data.name}</Text>
          <Text style={styles.subtitle}>CNPJ: {data.cnpj}</Text>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Capital Social:</Text>
            <Text style={styles.value}>{formatCurrency(data.capital)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Data de Fundação:</Text>
            <Text style={styles.value}>
              {format(new Date(data.foundingDate), 'dd/MM/yyyy')}
            </Text>
          </View>
          <Text style={styles.disclaimer}>{data.disclaimer}</Text>
        </View>

        {/* Risk Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análise de Risco</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Score de Risco:</Text>
            <Text style={styles.value}>{data.risk.riskScore.toFixed(1)}/10</Text>
          </View>
          {data.risk.warnings.map((warning, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.label}>{warning.type.toUpperCase()}:</Text>
              <Text style={styles.value}>{warning.message}</Text>
            </View>
          ))}
        </View>

        {/* Media Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo de Mídia</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Notícias Recentes:</Text>
            <Text style={styles.value}>{data.media.news.length}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Menções em Redes:</Text>
            <Text style={styles.value}>
              {data.media.socialMedia.reduce((acc, curr) => acc + curr.mentions, 0)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Reclamações:</Text>
            <Text style={styles.value}>
              {data.media.complaints.reduce((acc, curr) => acc + curr.count, 0)}
            </Text>
          </View>
        </View>

        {/* Legal Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Legal</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Processos Ativos:</Text>
            <Text style={styles.value}>{data.legal.lawsuits.length}</Text>
          </View>
          {data.legal.lawsuits.map((lawsuit, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.label}>Processo {index + 1}:</Text>
              <Text style={styles.value}>
                {lawsuit.type} - {lawsuit.status}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Gerado em {format(new Date(data.generatedAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm")}
        </Text>
      </Page>
    </Document>
  )
} 