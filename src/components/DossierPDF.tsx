import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { BusinessDossier } from '@/types'

// Registrar fonte personalizada (opcional)
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Roboto'
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#000',
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 5
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    width: 150,
    fontWeight: 'bold',
    fontSize: 10,
    color: '#666'
  },
  value: {
    flex: 1,
    fontSize: 10
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: 'center',
    color: '#666'
  }
})

interface DossierPDFProps {
  data: BusinessDossier
}

export const DossierPDF: React.FC<DossierPDFProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy')
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Dossiê Empresarial</Text>
          <Text style={styles.subtitle}>{data.name}</Text>
        </View>

        {/* Informações Básicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          <View style={styles.row}>
            <Text style={styles.label}>CNPJ:</Text>
            <Text style={styles.value}>{data.cnpj}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{data.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Natureza:</Text>
            <Text style={styles.value}>{data.legalNature}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Capital:</Text>
            <Text style={styles.value}>{formatCurrency(data.capital)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Data de Fundação:</Text>
            <Text style={styles.value}>{formatDate(data.foundingDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{data.status}</Text>
          </View>
        </View>

        {/* Endereço */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <Text style={styles.value}>
            {data.address.street}, {data.address.number}
            {data.address.complement ? ` - ${data.address.complement}` : ''}
          </Text>
          <Text style={styles.value}>
            {data.address.neighborhood} - {data.address.city}/{data.address.state}
          </Text>
          <Text style={styles.value}>CEP: {data.address.zipCode}</Text>
        </View>

        {/* Dados Financeiros */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Financeiros</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Receita:</Text>
            <Text style={styles.value}>{formatCurrency(0)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lucro:</Text>
            <Text style={styles.value}>{formatCurrency(0)}</Text>
          </View>
        </View>

        {/* Notícias Recentes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notícias Recentes</Text>
          {data.media.news.map((news, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.value}>
                {news.title} - {formatDate(news.date)}
              </Text>
            </View>
          ))}
        </View>

        {/* Processos em Andamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Processos em Andamento</Text>
          {data.legal.lawsuits.map((lawsuit, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.value}>
                {lawsuit.number} - {lawsuit.court} - {formatDate(lawsuit.date)}
              </Text>
            </View>
          ))}
        </View>

        {/* Parcerias Recentes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parcerias Recentes</Text>
          {data.media.socialMedia.map((partnership, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.value}>
                {partnership.platform} - {formatDate(partnership.lastMention)}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Gerado em {formatDate(data.generatedAt)}
        </Text>
      </Page>
    </Document>
  )
} 