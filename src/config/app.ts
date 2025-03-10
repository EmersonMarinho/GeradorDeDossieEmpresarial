export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 30000, // 30 seconds
  },
  cnpj: {
    maxLength: 14,
    format: /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/,
  },
  risk: {
    weights: {
      legal: 0.4,
      media: 0.3,
      company: 0.3,
    },
    thresholds: {
      high: 80,
      medium: 60,
      low: 40,
    },
  },
  cache: {
    ttl: 3600, // 1 hour in seconds
    maxSize: 1000, // Maximum number of items to cache
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  },
} as const 