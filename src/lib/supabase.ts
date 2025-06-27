import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions based on your database schema
export interface CuratitRecord {
  id: number
  created_at: string
  brand_name: string | null
  brand_post: string | null
  brand_logo: string | null
  brand_category: string | null
}