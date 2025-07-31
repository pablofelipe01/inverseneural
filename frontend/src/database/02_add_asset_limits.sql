-- Migración: Agregar límites de activos por plan
-- Fecha: 2025-07-31

-- Agregar columna para límite de activos activos
ALTER TABLE profiles 
ADD COLUMN max_active_assets INTEGER DEFAULT 9;

-- Agregar columna para subscription_ends_at (para planes pagados)
ALTER TABLE profiles 
ADD COLUMN subscription_ends_at TIMESTAMP WITH TIME ZONE;

-- Actualizar valores por defecto según plan
-- Trial: 9 activos (acceso completo por 15 días)
-- Básico: 5 activos ($29 USD)
-- Pro: 7 activos ($49 USD) 
-- Elite: 9 activos ($99 USD)

-- Función para actualizar max_active_assets basado en plan_type
CREATE OR REPLACE FUNCTION update_max_active_assets()
RETURNS TRIGGER AS $$
BEGIN
  CASE NEW.plan_type
    WHEN 'trial' THEN NEW.max_active_assets := 9;
    WHEN 'basic' THEN NEW.max_active_assets := 5;
    WHEN 'pro' THEN NEW.max_active_assets := 7;
    WHEN 'elite' THEN NEW.max_active_assets := 9;
    ELSE NEW.max_active_assets := 9; -- Default para trial
  END CASE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar automáticamente max_active_assets
CREATE TRIGGER trigger_update_max_active_assets
  BEFORE INSERT OR UPDATE OF plan_type ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_max_active_assets();

-- Actualizar registros existentes
UPDATE profiles SET max_active_assets = 9 WHERE plan_type = 'trial' OR plan_type = 'free';
