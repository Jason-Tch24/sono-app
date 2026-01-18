import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export type User = {
  id: string
  email: string
  role: 'sonoriste' | 'responsable'
  created_at: string
}

export type Service = {
  id: string
  date: string
  user_id: string
  status: 'en_cours' | 'termine'
  created_at: string
  updated_at: string
}

export type ChecklistItem = {
  id: string
  phase: 'before_service' | 'during_service' | 'after_service'
  label: string
  display_order: number
  created_at: string
}

export type ChecklistProgress = {
  id: string
  service_id: string
  checklist_item_id: string
  checked: boolean
  checked_at: string | null
}

export type Remark = {
  id: string
  service_id: string
  phase: 'before_service' | 'during_service' | 'after_service'
  content: string
  created_at: string
}

export type Incident = {
  id: string
  service_id: string
  type: 'larsen' | 'micro' | 'hf' | 'autre'
  description: string
  created_at: string
}

