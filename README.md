# Gerador de Dossiê Empresarial

Uma plataforma SaaS abrangente que gera automaticamente dossiês empresariais a partir de números de CNPJ. O sistema realiza consultas a APIs para compilar relatórios detalhados contendo informações da empresa.

## Funcionalidades

- 📄 **Dados Cadastrais** (Receita Federal, Redes Sociais, Site Oficial)
- 🔍 **Mídia Sensível** (notícias negativas, reclamações, escândalos)
- 🏛️ **Processos Legais** (consultas a tribunais e diários oficiais)
- 📢 **Menções em Portais de Notícias**
- 🏢 **Relações Empresariais**  (vínculos corporativos)
- ⚠️ **Sinais de Risco** (exemplo: empresa fantasma, falência)

## Tecnologias Utilizadas

### Frontend
- Next.js 14 com TypeScript
- Tailwind CSS para estilização
- React para componentes de UI

### Backend
- Node.js com Express
- Integrações com APIs


## Como começar

1. Clone o repo

2. instale as dependeências:
   ```bash
   npm install
   ```
4. rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura do projeto

```
src/
├── app/                 # Next.js app directory
├── components/          # Reusable React components
├── lib/                 # Utility functions and shared logic
├── services/           # External service integrations
└── types/              # TypeScript type definitions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
