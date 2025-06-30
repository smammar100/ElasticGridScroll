import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`
    Missing Supabase environment variables. 
    
    Please create a .env file in your project root with:
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    
    You can find these values in your Supabase project dashboard under Settings > API
  `)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-my-custom-header': 'curatit-app'
    }
  }
})

export interface CuratitRecord {
  id: number
  created_at: string
  brand_name: string | null
  brand_post: string | null
  brand_logo: string | null
  brand_category: string | null
}

export const testSupabaseConnection = async () => {
  try {
    const { data: basicData, error: basicError } = await supabase
      .from('Curatit')
      .select('count', { count: 'exact', head: true })
    
    if (basicError) {
      return { 
        success: false, 
        error: `Connection failed: ${basicError.message}`,
        details: basicError
      }
    }
    
    const { data: sampleData, error: sampleError, count } = await supabase
      .from('Curatit')
      .select('*', { count: 'exact' })
      .limit(5)
    
    if (sampleError) {
      return { 
        success: false, 
        error: `Data fetch failed: ${sampleError.message}`,
        details: sampleError
      }
    }
    
    const { data: structureData, error: structureError } = await supabase
      .from('Curatit')
      .select('id, brand_name, brand_post, brand_logo, brand_category, created_at')
      .limit(1)
    
    return { 
      success: true, 
      data: sampleData, 
      count,
      message: `Successfully connected to Supabase. Found ${count} records.`
    }
    
  } catch (err) {
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown connection error',
      details: err
    }
  }
}

export const checkSupabaseConfig = () => {
  const issues = []
  
  if (!supabaseUrl) {
    issues.push('VITE_SUPABASE_URL environment variable is missing')
  } else if (!supabaseUrl.includes('supabase.co')) {
    issues.push('VITE_SUPABASE_URL does not appear to be a valid Supabase URL')
  }
  
  if (!supabaseAnonKey) {
    issues.push('VITE_SUPABASE_ANON_KEY environment variable is missing')
  } else if (supabaseAnonKey.length < 100) {
    issues.push('VITE_SUPABASE_ANON_KEY appears to be too short (should be ~100+ characters)')
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    config: {
      url: supabaseUrl,
      keyLength: supabaseAnonKey?.length || 0
    }
  }
}

export { checkSupabaseConfig as checkConfig }