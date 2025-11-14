-- ==========================================
-- FASE 1: ENUMS E TIPOS
-- ==========================================

CREATE TYPE app_role AS ENUM ('superadmin', 'company_admin', 'company_user', 'driver', 'shipper');

CREATE TYPE company_status AS ENUM ('pending_approval', 'active', 'suspended', 'rejected', 'canceled');

CREATE TYPE subscription_plan_type AS ENUM ('free', 'basic', 'pro', 'enterprise');

CREATE TYPE freight_status AS ENUM ('draft', 'pending_approval', 'open', 'in_negotiation', 'assigned', 'in_transit', 'completed', 'canceled');

CREATE TYPE bid_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

-- ==========================================
-- FASE 2: TABELA COMPANIES (EMPRESAS)
-- ==========================================

CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Endereço
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  
  -- Documentação para aprovação
  registration_document_url TEXT,
  license_document_url TEXT,
  additional_docs_urls JSONB DEFAULT '[]',
  
  -- Status e aprovação
  status company_status NOT NULL DEFAULT 'pending_approval',
  approval_notes TEXT,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  -- Assinatura
  subscription_plan subscription_plan_type DEFAULT 'free',
  subscription_status TEXT DEFAULT 'trial',
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 days'),
  
  -- Limites do plano
  monthly_freight_limit INTEGER DEFAULT 5,
  user_limit INTEGER DEFAULT 1,
  
  -- Branding
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  
  -- Configurações
  settings JSONB DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_cnpj CHECK (cnpj ~ '^[0-9]{14}$')
);

-- ==========================================
-- FASE 3: TABELA USER_ROLES (ROLES DE USUÁRIOS)
-- ==========================================

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  
  UNIQUE(user_id, role, company_id)
);

-- ==========================================
-- FASE 4: ATUALIZAR TABELAS EXISTENTES
-- ==========================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE SET NULL;

ALTER TABLE public.freights 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public', 'marketplace'));

ALTER TABLE public.drivers 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_independent BOOLEAN DEFAULT true;

ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE CASCADE;

ALTER TABLE public.collection_orders 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE CASCADE;

-- ==========================================
-- FASE 5: MARKETPLACE DE FRETES
-- ==========================================

CREATE TABLE public.marketplace_freights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  posted_by UUID NOT NULL REFERENCES profiles(id),
  
  status freight_status NOT NULL DEFAULT 'draft',
  
  origin_city TEXT NOT NULL,
  origin_state TEXT NOT NULL,
  origin_address TEXT,
  destination_city TEXT NOT NULL,
  destination_state TEXT NOT NULL,
  destination_address TEXT,
  distance NUMERIC,
  
  cargo_type TEXT NOT NULL,
  cargo_description TEXT,
  weight NUMERIC,
  volumes INTEGER,
  dimensions TEXT,
  
  vehicle_type TEXT,
  body_type TEXT,
  
  pickup_date TIMESTAMP WITH TIME ZONE,
  delivery_deadline TIMESTAMP WITH TIME ZONE,
  
  suggested_price NUMERIC,
  price_negotiable BOOLEAN DEFAULT true,
  
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  
  special_requirements TEXT,
  requires_insurance BOOLEAN DEFAULT false,
  requires_tracking BOOLEAN DEFAULT false,
  
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'invited_only')),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 days'),
  
  views_count INTEGER DEFAULT 0,
  bids_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- FASE 6: SISTEMA DE PROPOSTAS
-- ==========================================

CREATE TABLE public.freight_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freight_id UUID NOT NULL REFERENCES marketplace_freights(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  proposed_price NUMERIC NOT NULL,
  estimated_pickup_date TIMESTAMP WITH TIME ZONE,
  estimated_delivery_date TIMESTAMP WITH TIME ZONE,
  message TEXT,
  
  status bid_status DEFAULT 'pending',
  
  accepted_at TIMESTAMP WITH TIME ZONE,
  accepted_by UUID REFERENCES profiles(id),
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  withdrawn_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- FASE 7: ATRIBUIÇÕES DE FRETE
-- ==========================================

CREATE TABLE public.freight_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freight_id UUID NOT NULL REFERENCES marketplace_freights(id) ON DELETE CASCADE,
  bid_id UUID REFERENCES freight_bids(id),
  driver_id UUID NOT NULL REFERENCES drivers(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  
  assigned_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_transit', 'completed', 'canceled')),
  
  pickup_proof TEXT,
  delivery_proof TEXT,
  
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  rating_driver INTEGER CHECK (rating_driver BETWEEN 1 AND 5),
  rating_company INTEGER CHECK (rating_company BETWEEN 1 AND 5),
  review_driver TEXT,
  review_company TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- FASE 8: NOTIFICAÇÕES
-- ==========================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  
  action_url TEXT,
  action_label TEXT,
  
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- FASE 9: PLANOS DE ASSINATURA
-- ==========================================

CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  plan_type subscription_plan_type NOT NULL,
  
  price_monthly NUMERIC NOT NULL DEFAULT 0,
  price_yearly NUMERIC NOT NULL DEFAULT 0,
  
  monthly_freight_limit INTEGER,
  user_limit INTEGER,
  storage_limit_gb INTEGER,
  
  features JSONB DEFAULT '[]',
  has_marketplace_access BOOLEAN DEFAULT false,
  has_api_access BOOLEAN DEFAULT false,
  has_priority_support BOOLEAN DEFAULT false,
  has_custom_branding BOOLEAN DEFAULT false,
  
  active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- FASE 10: HISTÓRICO DE ASSINATURAS
-- ==========================================

CREATE TABLE public.subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  
  plan_type subscription_plan_type NOT NULL,
  billing_period TEXT CHECK (billing_period IN ('monthly', 'yearly')),
  amount_paid NUMERIC,
  
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  
  payment_id TEXT,
  payment_method TEXT,
  payment_status TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- FASE 11: AVALIAÇÕES
-- ==========================================

CREATE TABLE public.driver_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES freight_assignments(id),
  
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES profiles(id)
);

CREATE TABLE public.company_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES freight_assignments(id),
  
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES profiles(id)
);

-- ==========================================
-- FASE 12: RASTREAMENTO
-- ==========================================

CREATE TABLE public.freight_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES freight_assignments(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id),
  
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  
  status TEXT,
  notes TEXT,
  speed NUMERIC,
  heading NUMERIC,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- FASE 13: CHAT/MENSAGENS
-- ==========================================

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freight_id UUID REFERENCES marketplace_freights(id) ON DELETE CASCADE,
  
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- FASE 14: FUNÇÕES DE SEGURANÇA
-- ==========================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.user_has_company_access(_user_id UUID, _company_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id 
      AND ur.company_id = _company_id
  )
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- FASE 15: TRIGGERS
-- ==========================================

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_marketplace_freights_updated_at
  BEFORE UPDATE ON marketplace_freights
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_freight_bids_updated_at
  BEFORE UPDATE ON freight_bids
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- FASE 16: INDEXES PARA PERFORMANCE
-- ==========================================

CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_cnpj ON companies(cnpj);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_company_id ON user_roles(company_id);
CREATE INDEX idx_marketplace_freights_status ON marketplace_freights(status);
CREATE INDEX idx_marketplace_freights_company_id ON marketplace_freights(company_id);
CREATE INDEX idx_freight_bids_freight_id ON freight_bids(freight_id);
CREATE INDEX idx_freight_bids_driver_id ON freight_bids(driver_id);
CREATE INDEX idx_notifications_user_id_read ON notifications(user_id, read);
CREATE INDEX idx_freight_tracking_assignment_id ON freight_tracking(assignment_id);
CREATE INDEX idx_messages_freight_id ON messages(freight_id);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);

-- ==========================================
-- FASE 17: RLS POLICIES
-- ==========================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmins podem ver todas as empresas"
  ON companies FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Usuários podem ver suas próprias empresas"
  ON companies FOR SELECT
  TO authenticated
  USING (id IN (
    SELECT company_id FROM user_roles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Qualquer usuário autenticado pode criar empresa"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Company admins podem atualizar sua empresa"
  ON companies FOR UPDATE
  TO authenticated
  USING (
    public.user_has_company_access(auth.uid(), id) AND
    public.has_role(auth.uid(), 'company_admin')
  );

CREATE POLICY "Superadmins podem atualizar qualquer empresa"
  ON companies FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'));

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Company admins podem ver roles de sua empresa"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'company_admin'
    )
  );

CREATE POLICY "Superadmins podem gerenciar todos os roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Company admins podem gerenciar roles de sua empresa"
  ON user_roles FOR ALL
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'company_admin'
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'company_admin'
    )
  );

ALTER TABLE marketplace_freights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fretes públicos são visíveis para todos"
  ON marketplace_freights FOR SELECT
  TO authenticated
  USING (visibility = 'public' AND status NOT IN ('draft', 'canceled'));

CREATE POLICY "Usuários podem ver fretes de sua empresa"
  ON marketplace_freights FOR SELECT
  TO authenticated
  USING (public.user_has_company_access(auth.uid(), company_id));

CREATE POLICY "Company users podem criar fretes"
  ON marketplace_freights FOR INSERT
  TO authenticated
  WITH CHECK (
    public.user_has_company_access(auth.uid(), company_id) AND
    (public.has_role(auth.uid(), 'company_admin') OR public.has_role(auth.uid(), 'company_user'))
  );

CREATE POLICY "Criadores podem atualizar seus fretes"
  ON marketplace_freights FOR UPDATE
  TO authenticated
  USING (public.user_has_company_access(auth.uid(), company_id));

ALTER TABLE freight_bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Motoristas podem ver suas próprias propostas"
  ON freight_bids FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Empresas podem ver propostas de seus fretes"
  ON freight_bids FOR SELECT
  TO authenticated
  USING (
    freight_id IN (
      SELECT id FROM marketplace_freights 
      WHERE public.user_has_company_access(auth.uid(), company_id)
    )
  );

CREATE POLICY "Motoristas podem criar propostas"
  ON freight_bids FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    public.has_role(auth.uid(), 'driver')
  );

CREATE POLICY "Motoristas podem atualizar suas propostas"
  ON freight_bids FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Empresas podem atualizar propostas de seus fretes"
  ON freight_bids FOR UPDATE
  TO authenticated
  USING (
    freight_id IN (
      SELECT id FROM marketplace_freights 
      WHERE public.user_has_company_access(auth.uid(), company_id)
    )
  );

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias notificações"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Sistema pode inserir notificações"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar suas notificações"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

ALTER TABLE freight_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresas podem ver suas atribuições"
  ON freight_assignments FOR SELECT
  TO authenticated
  USING (public.user_has_company_access(auth.uid(), company_id));

CREATE POLICY "Motoristas podem ver suas atribuições"
  ON freight_assignments FOR SELECT
  TO authenticated
  USING (
    driver_id IN (
      SELECT id FROM drivers WHERE user_id = auth.uid()
    )
  );

ALTER TABLE driver_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver avaliações de motoristas"
  ON driver_ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Empresas podem avaliar motoristas"
  ON driver_ratings FOR INSERT
  TO authenticated
  WITH CHECK (public.user_has_company_access(auth.uid(), company_id));

ALTER TABLE company_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver avaliações de empresas"
  ON company_ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Motoristas podem avaliar empresas"
  ON company_ratings FOR INSERT
  TO authenticated
  WITH CHECK (
    driver_id IN (
      SELECT id FROM drivers WHERE user_id = auth.uid()
    )
  );

ALTER TABLE freight_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresas podem ver rastreamento de seus fretes"
  ON freight_tracking FOR SELECT
  TO authenticated
  USING (
    assignment_id IN (
      SELECT id FROM freight_assignments 
      WHERE public.user_has_company_access(auth.uid(), company_id)
    )
  );

CREATE POLICY "Motoristas podem inserir rastreamento"
  ON freight_tracking FOR INSERT
  TO authenticated
  WITH CHECK (
    driver_id IN (
      SELECT id FROM drivers WHERE user_id = auth.uid()
    )
  );

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver mensagens enviadas ou recebidas"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Usuários podem enviar mensagens"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Usuários podem atualizar mensagens recebidas"
  ON messages FOR UPDATE
  TO authenticated
  USING (receiver_id = auth.uid());

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver planos ativos"
  ON subscription_plans FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Superadmins podem gerenciar planos"
  ON subscription_plans FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'superadmin'));

ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresas podem ver seu histórico"
  ON subscription_history FOR SELECT
  TO authenticated
  USING (public.user_has_company_access(auth.uid(), company_id));

CREATE POLICY "Sistema pode inserir histórico"
  ON subscription_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ==========================================
-- FASE 18: INSERIR PLANOS PADRÃO
-- ==========================================

INSERT INTO subscription_plans (name, description, plan_type, price_monthly, price_yearly, monthly_freight_limit, user_limit, features, has_marketplace_access)
VALUES
  ('Free', 'Plano gratuito para começar', 'free', 0, 0, 5, 1, '["5 fretes por mês", "1 usuário", "Suporte via email"]', false),
  ('Basic', 'Para pequenas transportadoras', 'basic', 99, 990, 50, 3, '["50 fretes por mês", "3 usuários", "Acesso ao marketplace", "Suporte prioritário"]', true),
  ('Pro', 'Para transportadoras em crescimento', 'pro', 299, 2990, NULL, 10, '["Fretes ilimitados", "10 usuários", "Marketplace completo", "API access", "Suporte prioritário", "Dashboard avançado"]', true),
  ('Enterprise', 'Soluções customizadas', 'enterprise', 999, 9990, NULL, NULL, '["Tudo do Pro", "Usuários ilimitados", "Whitelabel", "Suporte dedicado", "Treinamento", "SLA garantido"]', true);