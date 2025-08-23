-- Migration pour ajouter les tables companies et users avec gestion des rôles

-- Table des entreprises
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  address TEXT,
  siret VARCHAR(14),
  industry VARCHAR(100),
  website VARCHAR(255),
  logo_url TEXT,
  subscription_plan VARCHAR(50) DEFAULT 'basic',
  subscription_status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des utilisateurs liés aux entreprises
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'employee',
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_companies_updated_at 
  BEFORE UPDATE ON companies 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Politique de sécurité RLS (Row Level Security)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politiques pour les entreprises
CREATE POLICY "Users can view their own company" ON companies
  FOR SELECT USING (
    id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Company admins can update their company" ON companies
  FOR UPDATE USING (
    id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- Politiques pour les utilisateurs
CREATE POLICY "Users can view users from their company" ON users
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can manage users in their company" ON users
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- Mettre à jour les tables existantes pour ajouter company_id
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE finance ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE journal ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE production_plans ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE production_history ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE stock_updates ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE supplier_products ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE supplier_invoices ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);

-- Fonction pour initialiser les données d'une nouvelle entreprise
CREATE OR REPLACE FUNCTION initialize_company_data(company_id UUID, user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Cette fonction sera appelée lors de la création d'une nouvelle entreprise
  -- pour initialiser toutes les données à zéro
  
  -- Aucune insertion nécessaire car les tables commencent vides
  -- Les données seront créées au fur et à mesure par l'utilisateur
  
  RAISE NOTICE 'Company data initialized for company_id: %', company_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer une nouvelle entreprise avec son premier utilisateur
CREATE OR REPLACE FUNCTION create_company_with_user(
  company_name VARCHAR(255),
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  user_auth_id UUID
)
RETURNS UUID AS $$
DECLARE
  new_company_id UUID;
BEGIN
  -- Créer l'entreprise
  INSERT INTO companies (name, email)
  VALUES (company_name, user_email)
  RETURNING id INTO new_company_id;
  
  -- Créer l'utilisateur admin
  INSERT INTO users (id, company_id, email, name, role)
  VALUES (user_auth_id, new_company_id, user_email, user_name, 'owner');
  
  -- Initialiser les données de l'entreprise
  PERFORM initialize_company_data(new_company_id, user_auth_id);
  
  RETURN new_company_id;
END;
$$ LANGUAGE plpgsql;
