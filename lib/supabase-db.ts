import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

export interface User {
  id: string
  username: string
  email: string
  password_hash: string
  balance: number
  created_at: string
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('username', username)
    .single()

  if (error) return null
  return data
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('email', email)
    .single()

  if (error) return null
  return data
}

export async function createUser(username: string, email: string, password: string): Promise<User | null> {
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      username,
      email,
      password_hash: hashedPassword,
      balance: 0
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    return null
  }
  
  return data
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password_hash)
}

export async function updateUserBalance(userId: string, newBalance: number): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .update({ balance: newBalance })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating balance:', error)
    return null
  }
  
  return data
}

export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data
}
