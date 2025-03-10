# Business Dossier SaaS

A comprehensive SaaS platform that automatically generates business dossiers from CNPJ numbers. The system performs web scraping and API queries to compile detailed reports containing company information.

## Features

- 📄 **Cadastral Data** (Federal Revenue, Social Media, Official Website)
- 🔍 **Sensitive Media** (negative news, complaints, scandals)
- 🏛️ **Legal Processes** (court and official gazette consultations)
- 📢 **News Portal Mentions**
- 🏢 **Company Relationships** (corporate links)
- ⚠️ **Risk Signals** (e.g., shell company, bankruptcy)

## Tech Stack

### Frontend
- Next.js 14 with TypeScript
- Tailwind CSS for styling
- React for UI components

### Backend
- Node.js with Express/Fastify
- Web Scraping capabilities
- API integrations

### Database
- MongoDB/PostgreSQL for data storage
- Redis for caching

### Infrastructure
- AWS Lambda / Vercel Functions
- BullMQ/RabbitMQ for job queues
- ElasticSearch for efficient search

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # Reusable React components
├── lib/                 # Utility functions and shared logic
├── services/           # External service integrations
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 