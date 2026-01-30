import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nbgxrcneyicysnfvekji.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_772ThvQQjI_7ytFjSci2yA_UJD5V6hf'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  users: {
    id: string
    username: string
    email: string
    password_hash: string
    balance: number
    created_at: string
  }
  battles: {
    id: string
    creator_id: string
    mode: 'standard' | 'shared' | 'team'
    player_count: string
    cases: string[]
    players: any
    max_players: number
    status: 'waiting' | 'in_progress' | 'completed'
    settings: any
    created_at: string
    started_at: string | null
    completed_at: string | null
    winner_id: string | null
  }
  cases: {
    id: string
    name: string
    image_url: string | null
    price: number
    items: any
    description: string | null
    created_at: string
  }
  items: {
    id: string
    name: string
    skin: string | null
    category: string
    weapon_type: string | null
    rarity: string
    value: number
    image_url: string | null
    description: string | null
    created_at: string
  }
  inventory: {
    id: string
    user_id: string
    item_id: string
    for_sale: boolean
    sale_price: number | null
    acquired_at: string
  }
}
