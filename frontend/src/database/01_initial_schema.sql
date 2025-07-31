-- Tabla de perfiles de usuario
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  subscription_status TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '15 days'),
  stripe_customer_id TEXT,
  plan_type TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Tabla de configuraciones de trading
CREATE TABLE user_configs (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  selected_pairs JSONB DEFAULT '[]',
  position_size_percent INTEGER DEFAULT 5,
  aggressiveness_mode TEXT DEFAULT 'BALANCED',
  iq_email TEXT,
  iq_password TEXT,
  account_type TEXT DEFAULT 'PRACTICE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_configs ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own config" ON user_configs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own config" ON user_configs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own config" ON user_configs FOR INSERT WITH CHECK (auth.uid() = user_id);