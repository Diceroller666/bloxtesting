import { supabase } from './supabase'

export interface CaseItem {
  itemId: string
  dropRate: number
}

export interface Case {
  id: string
  name: string
  image_url?: string
  price: number
  items: CaseItem[]
  description?: string
  created_at: string
}

export async function getAllCases(): Promise<Case[]> {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching cases:', error)
    return []
  }

  return data || []
}

export async function getCaseById(id: string): Promise<Case | null> {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching case:', error)
    return null
  }

  return data
}

export async function addCase(caseData: Omit<Case, 'id' | 'created_at'>): Promise<Case | null> {
  const newCase = {
    id: `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...caseData
  }

  const { data, error } = await supabase
    .from('cases')
    .insert(newCase)
    .select()
    .single()

  if (error) {
    console.error('Error adding case:', error)
    return null
  }

  return data
}

export async function updateCase(id: string, updates: Partial<Case>): Promise<Case | null> {
  const { data, error } = await supabase
    .from('cases')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating case:', error)
    return null
  }

  return data
}

export async function deleteCase(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('cases')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting case:', error)
    return false
  }

  return true
}
