import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase Environment Check:', {
  url: supabaseUrl ? 'Set' : 'Missing',
  key: supabaseAnonKey ? 'Set' : 'Missing',
  urlValue: supabaseUrl,
  keyLength: supabaseAnonKey?.length || 0
})

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
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

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    const { data, error, count } = await supabase
      .from('Curatit')
      .select('*', { count: 'exact' })
      .limit(1)

    if (error) {
      console.error('Supabase connection test failed:', error)
      return { success: false, error: error.message }
    }

    console.log('Supabase connection test successful:', { data, count })
    return { success: true, data, count }
  } catch (err) {
    console.error('Supabase connection test error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}