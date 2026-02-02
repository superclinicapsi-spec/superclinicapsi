# 🏥 Clinical PWA - Sistema de Gestão para Terapia ABA

PWA profissional para psicólogas comportamentais, integrando agenda, prontuário SOAP, coleta de dados ABA, gestão financeira e IA gratuita.

## 🚀 Tecnologias

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Estilização**: Tailwind CSS (design profissional minimalista)
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **IA**: OpenRouter + DeepSeek R1 (100% gratuito)
- **Charts**: Recharts
- **PDF**: jsPDF + html2canvas
- **Offline**: IndexedDB + Service Workers

## 📦 Instalação

```bash
# 1. Clone o repositório
cd clinical-pwa

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.local.example .env.local

# Edite .env.local com suas credenciais:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - OPENROUTER_API_KEY (gratuito em openrouter.ai)

# 4. Rode o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 🔑 Configuração de APIs Gratuitas

### OpenRouter (IA Gratuita)

1. Acesse [openrouter.ai](https://openrouter.ai)
2. Crie uma conta gratuita
3. Vá em "Keys" e gere uma API key
4. Cole no `.env.local`: `OPENROUTER_API_KEY=sk-or-...`

**Modelo usado**: `deepseek/deepseek-r1-0528:free` (grátis permanente)

### Supabase (Backend)

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto (gratuito)
3. Em "Settings > API", copie:
   - URL do projeto → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🎨 Design System

Paleta profissional e minimalista (sem cara de IA):

- **Primary**: Azul profissional (#3B82F6)
- **Success**: Verde (#10B981) - Alvos atingidos
- **Warning**: Amarelo (#F59E0B) - Estagnado
- **Error**: Vermelho (#EF4444) - Regressão
- **Grays**: Tons neutros de cinza

Componentes base:
- `.card` - Cartões com sombra sutil
- `.btn-primary`, `.btn-secondary`, `.btn-success`
- `.input-field` - Campos de formulário
- `.label` - Labels de formulário

## 📁 Estrutura do Projeto

```
clinical-pwa/
├── app/
│   ├── (auth)/          # Rotas de autenticação
│   ├── (psychologist)/  # Dashboard do psicólogo
│   ├── (family)/        # Portal da família
│   └── api/             # API Routes
│       └── ai/          # Endpoints de IA
├── components/          # Componentes React
├── lib/
│   ├── ai/              # Cliente OpenRouter
│   ├── supabase/        # Cliente Supabase
│   └── offline/         # IndexedDB (futuro)
└── public/
```

## ✨ Funcionalidades Principais

### Já Implementado ✅
- ✅ Setup Next.js 14 com TypeScript
- ✅ Design system profissional (Tailwind CSS)
- ✅ Cliente Supabase (browser + server)
- ✅ Integração OpenRouter (IA gratuita)
- ✅ API de geração de notas SOAP

### Em Desenvolvimento 🚧
- 🚧 Autenticação e onboarding
- 🚧 Dashboard principal
- 🚧 Módulo de agenda inteligente
- 🚧 Prontuário eletrônico (SOAP)
- 🚧 Coleta de dados ABA (8 tipos)
- 🚧 Gestão financeira + RCM
- 🚧 Portal da família

## 🧪 Testando a IA

Você pode testar a geração de notas SOAP fazendo uma requisição POST:

```bash
curl -X POST http://localhost:3000/api/ai/generate-soap \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "João Silva",
    "sessionDuration": 60,
    "trialsData": [
      {
        "targetName": "Imitar sons vocais",
        "correct": 12,
        "error": 3,
        "help": 5
      }
    ],
    "behaviorsObserved": ["Engajamento bom", "Birra no final"],
    "notes": "Paciente respondeu bem ao reforço com bolinhas"
  }'
```

## 📝 Próximos Passos

1. ⏭️ Configurar banco de dados Supabase (tabelas)
2. ⏭️ Criar telas de autenticação (login/cadastro)
3. ⏭️ Desenvolver dashboard principal
4. ⏭️ Implementar agenda com otimização de rotas
5. ⏭️ Construir módulo ABA com coleta de dados

## 📄 Licença

Este projeto é de uso privado.

---

**Desenvolvido com ❤️ para psicólogas comportamentais**
