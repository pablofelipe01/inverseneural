// Script temporal para agregar columnas faltantes a Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addMissingColumns() {
  console.log('🔧 Agregando columnas faltantes a la tabla profiles...')
  
  try {
    // Agregar columnas faltantes
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE profiles 
        ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
        ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ;
      `
    })

    if (error) {
      console.error('❌ Error:', error)
    } else {
      console.log('✅ Columnas agregadas exitosamente')
    }

    // Verificar columnas
    const { data: columns, error: columnsError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        ORDER BY column_name;
      `
    })

    if (columnsError) {
      console.error('❌ Error verificando columnas:', columnsError)
    } else {
      console.log('📋 Columnas actuales en profiles:', columns)
    }

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

addMissingColumns()
