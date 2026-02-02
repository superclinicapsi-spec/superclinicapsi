-- ============================================
-- Clinical PWA - Database Schema
-- Supabase PostgreSQL
-- ============================================

-- NOTA: Execute este script no SQL Editor do Supabase
-- Vá em: Project > SQL Editor > New Query > Cole este código > RUN

-- ============================================
-- 1. TABELA DE PERFIL DE USUÁRIOS
-- ============================================

-- IMPORTANTE: Se a tabela já existir e você precisar atualizar a constraint de role,
-- você precisará rodar um ALTER TABLE ou recriar a constraint.
-- Abaixo está a definição completa para novas instalações.
-- Para atualizações (SaaS), veja a seção de MIGRATION no final.

CREATE TABLE IF NOT EXISTS users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  crp TEXT,
  specialties TEXT[],
  locations JSONB,
  -- Adicionado 'platform_admin' para o dono do SaaS
  role TEXT CHECK (role IN ('psychologist', 'supervisor', 'applicator', 'family', 'platform_admin')) DEFAULT 'psychologist',
  openai_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row-Level Security
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users_profile
  FOR SELECT USING (auth.uid() = id);

-- Admin pode ver todos os perfis
CREATE POLICY "Admins can view all profiles" ON users_profile
  FOR SELECT USING (
    (SELECT role FROM users_profile WHERE id = auth.uid()) = 'platform_admin'
  );

CREATE POLICY "Users can update own profile" ON users_profile
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users_profile
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. TABELA DE PACIENTES
-- ============================================

CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  photo_url TEXT,
  date_of_birth DATE,
  diagnosis TEXT[],
  guardians JSONB,
  anamnesis_encrypted TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row-Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Psychologists see only their patients" ON patients
  FOR ALL USING (psychologist_id = auth.uid());

-- ============================================
-- 3. TABELA DE AGENDAMENTOS
-- ============================================

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  location JSONB,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 60,
  service_type TEXT CHECK (service_type IN ('aba_therapy', 'assessment', 'follow_up', 'parent_training', 'supervision')),
  status TEXT CHECK (status IN ('confirmed', 'pending', 'missed', 'cancelled')) DEFAULT 'pending',
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- (Mantenha as policies existentes aqui, estou abreviando para focar nas mudanças SaaS)
-- ...

-- ============================================
-- 4. FINANCEIRO (Exemplo parcial)
-- ... (Mantenha o resto das tabelas como estão) ...
-- ============================================

CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('income', 'expense')),
  category TEXT,
  amount DECIMAL(10, 2),
  status TEXT CHECK (status IN ('paid', 'pending', 'overdue', 'cancelled')) DEFAULT 'pending',
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  location_name TEXT,
  payment_method TEXT,
  insurance_authorization TEXT,
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row-Level Security
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Psychologists see own transactions" ON financial_transactions
  FOR ALL USING (psychologist_id = auth.uid());


-- ... (Outras tabelas existentes: session_fees, family_portal_access etc. - MANTENHA-AS)
-- Vou pular para a nova seção SaaS

-- ============================================
-- 19. TABELA DE ASSINATURAS (SaaS) [NOVO]
-- ============================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('active', 'trial', 'past_due', 'canceled')) DEFAULT 'trial',
  plan_type TEXT CHECK (plan_type IN ('monthly', 'yearly', 'enterprise')) DEFAULT 'monthly',
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ, -- Se nulo, acesso vitalício ou indefinido
  payment_provider TEXT, -- 'stripe', 'mercadopago', null (manual)
  external_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row-Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Usuário pode ver sua própria assinatura
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- Admin pode ver e editar todas as assinaturas
CREATE POLICY "Admins can manage all subscriptions" ON subscriptions
  FOR ALL USING (
    (SELECT role FROM users_profile WHERE id = auth.uid()) = 'platform_admin'
  );


-- ============================================
-- MIGRATION HELPERS (Para rodar se o banco já existe)
-- ============================================

-- 1. Atualizar Constraint de ROLE se necessário
-- (Comentado por padrão para não quebrar execução limpa, descomente se precisar)
-- ALTER TABLE users_profile DROP CONSTRAINT IF EXISTS users_profile_role_check;
-- ALTER TABLE users_profile ADD CONSTRAINT users_profile_role_check 
--   CHECK (role IN ('psychologist', 'supervisor', 'applicator', 'family', 'platform_admin'));

-- 2. Inserir Assinatura Trial para usuários existentes
-- INSERT INTO subscriptions (user_id, status, ends_at)
-- SELECT id, 'trial', NOW() + INTERVAL '14 days'
-- FROM users_profile
-- WHERE id NOT IN (SELECT user_id FROM subscriptions);

-- ============================================
-- SUCESSO!
-- ============================================
