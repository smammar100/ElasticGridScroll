import { createClient } from '@supabase/supabase-js'

// Get environment variables with better error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Supabase Environment Check:', {
  url: supabaseUrl ? 'Set' : 'Missing',
  key: supabaseAnonKey ? 'Set' : 'Missing',
  urlValue: supabaseUrl,
  keyLength: supabaseAnonKey?.length || 0,
  nodeEnv: import.meta.env.NODE_ENV,
  mode: import.meta.env.MODE
})

// More detailed error checking
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL is missing from environment variables')
  console.log('💡 Make sure you have a .env file with VITE_SUPABASE_URL=your_supabase_url')
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is missing from environment variables')
  console.log('💡 Make sure you have a .env file with VITE_SUPABASE_ANON_KEY=your_anon_key')
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`
    Missing Supabase environment variables. 
    
    Please create a .env file in your project root with:
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    
    You can find these values in your Supabase project dashboard under Settings > API
  `)
}

// Create Supabase client with better configuration
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

// Type definitions based on your database schema
export interface CuratitRecord {
  id: number
  created_at: string
  brand_name: string | null
  brand_post: string | null
  brand_logo: string | null
  brand_category: string | null
}

// Enhanced connection test with multiple approaches
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Test 1: Basic connection test
    console.log('📡 Test 1: Basic connection...')
    const { data: basicData, error: basicError } = await supabase
      .from('Curatit')
      .select('count', { count: 'exact', head: true })
    
    if (basicError) {
      console.error('❌ Basic connection failed:', basicError)
      return { 
        success: false, 
        error: `Connection failed: ${basicError.message}`,
        details: basicError
      }
    }
    
    console.log('✅ Basic connection successful')
    
    // Test 2: Try to fetch actual data
    console.log('📡 Test 2: Fetching sample data...')
    const { data: sampleData, error: sampleError, count } = await supabase
      .from('Curatit')
      .select('*', { count: 'exact' })
      .limit(5)
    
    if (sampleError) {
      console.error('❌ Sample data fetch failed:', sampleError)
      return { 
        success: false, 
        error: `Data fetch failed: ${sampleError.message}`,
        details: sampleError
      }
    }
    
    console.log('✅ Sample data fetch successful:', { 
      sampleCount: sampleData?.length || 0, 
      totalCount: count 
    })
    
    // Test 3: Check table structure
    console.log('📡 Test 3: Checking table structure...')
    const { data: structureData, error: structureError } = await supabase
      .from('Curatit')
      .select('id, brand_name, brand_post, brand_logo, brand_category, created_at')
      .limit(1)
    
    if (structureError) {
      console.warn('⚠️ Table structure check failed:', structureError)
    } else {
      console.log('✅ Table structure check successful')
    }
    
    return { 
      success: true, 
      data: sampleData, 
      count,
      message: `Successfully connected to Supabase. Found ${count} records.`
    }
    
  } catch (err) {
    console.error('💥 Supabase connection test error:', err)
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown connection error',
      details: err
    }
  }
}

// Helper function to check if Supabase is properly configured
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

// Export configuration checker
export { checkSupabaseConfig as checkConfig }