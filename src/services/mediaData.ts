import { validateCNPJ } from '@/lib/cnpj'

interface NewsData {
  title: string
  source: string
  date: string
  url: string
  sentiment: 'positive' | 'negative' | 'neutral'
}

interface SocialMediaData {
  platform: string
  mentions: number
  sentiment: 'positive' | 'negative' | 'neutral'
  lastMention: string
}

interface ComplaintData {
  source: string
  count: number
  lastComplaint: string
  url: string
}

interface MediaDataResponse {
  news: NewsData[]
  socialMedia: SocialMediaData[]
  complaints: ComplaintData[]
}

export class MediaDataService {
  private static instance: MediaDataService
  private googleNewsApiKey: string

  private constructor() {
    this.googleNewsApiKey = process.env.GOOGLE_NEWS_API_KEY || ''
  }

  public static getInstance(): MediaDataService {
    if (!MediaDataService.instance) {
      MediaDataService.instance = new MediaDataService()
    }
    return MediaDataService.instance
  }

  public async getMediaData(cnpj: string, companyName: string): Promise<MediaDataResponse> {
    if (!validateCNPJ(cnpj)) {
      throw new Error('Invalid CNPJ')
    }

    if (!this.googleNewsApiKey) {
      throw new Error('Google News API key not configured')
    }

    try {
      // Fetch news data from Google News
      const newsData = await this.fetchNewsData(companyName)
      
      // Fetch social media data
      const socialMediaData = await this.fetchSocialMediaData(companyName)
      
      // Fetch complaints data
      const complaintsData = await this.fetchComplaintsData(companyName)

      return {
        news: newsData,
        socialMedia: socialMediaData,
        complaints: complaintsData
      }
    } catch (error) {
      console.error('Error fetching media data:', error)
      throw error
    }
  }

  private async fetchNewsData(companyName: string): Promise<NewsData[]> {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(companyName)}&apiKey=${this.googleNewsApiKey}&language=pt&sortBy=publishedAt`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch news data')
      }

      const data = await response.json()
      
      // Process and analyze sentiment for each news article
      return data.articles.map((article: any) => ({
        title: article.title,
        source: article.source.name,
        date: article.publishedAt,
        url: article.url,
        sentiment: this.analyzeSentiment(article.title + ' ' + article.description)
      }))
    } catch (error) {
      console.error('Error fetching news data:', error)
      return []
    }
  }

  private async fetchSocialMediaData(companyName: string): Promise<SocialMediaData[]> {
    // TODO: Implement social media data fetching
    // This would require integration with social media APIs or web scraping
    return []
  }

  private async fetchComplaintsData(companyName: string): Promise<ComplaintData[]> {
    // TODO: Implement complaints data fetching
    // This would require integration with complaint websites or web scraping
    return []
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    // TODO: Implement sentiment analysis
    // This would require integration with a sentiment analysis service
    return 'neutral'
  }
} 