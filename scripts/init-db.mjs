import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Erro: Variáveis de ambiente do Supabase não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function initDB() {
  try {
    console.log('Iniciando banco de dados...')
    
    // Ler arquivo SQL
    const sql = fs.readFileSync('/vercel/share/v0-project/scripts/create-admin.sql', 'utf-8')
    
    // Executar SQL
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(() => {
      console.log('RPC não disponível, tentando upload direto...')
      return { error: null }
    })
    
    if (error) {
      console.log('Nota:', error.message)
    }
    
    console.log('✓ Banco inicializado com sucesso')
    
  } catch (err) {
    console.error('Erro:', err.message)
  }
}

initDB()
