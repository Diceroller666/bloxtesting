import { supabase } from './supabase'

export type BattleMode = 'standard' | 'shared' | 'team'
export type BattleStatus = 'waiting' | 'in_progress' | 'completed'

export interface BattlePlayer {
  userId: string
  username: string
  isBot: boolean
  totalUnboxed: number
  items: any[]
}

export interface Battle {
  id: string
  creator_id: string
  mode: BattleMode
  player_count: string
  cases: string[]
  players: BattlePlayer[]
  max_players: number
  status: BattleStatus
  settings: {
    empireSpin: boolean
    fastMode: boolean
    reverseMode: boolean
    privateMode: boolean
  }
  created_at: string
  started_at?: string
  completed_at?: string
  winner_id?: string
}

export async function getAllBattles(): Promise<Battle[]> {
  const { data, error } = await supabase
    .from('battles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching battles:', error)
    return []
  }

  return data || []
}

export async function getActiveBattles(): Promise<Battle[]> {
  const { data, error } = await supabase
    .from('battles')
    .select('*')
    .in('status', ['waiting', 'in_progress'])
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching active battles:', error)
    return []
  }

  return data || []
}

export async function getBattleById(id: string): Promise<Battle | null> {
  const { data, error } = await supabase
    .from('battles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching battle:', error)
    return null
  }

  return data
}

export async function createBattle(battleData: {
  creatorId: string
  mode: BattleMode
  playerCount: string
  cases: string[]
  maxPlayers: number
  settings: any
  creatorUsername: string
}): Promise<Battle | null> {
  const newBattle = {
    id: `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    creator_id: battleData.creatorId,
    mode: battleData.mode,
    player_count: battleData.playerCount,
    cases: battleData.cases,
    players: [{
      userId: battleData.creatorId,
      username: battleData.creatorUsername,
      isBot: false,
      totalUnboxed: 0,
      items: []
    }],
    max_players: battleData.maxPlayers,
    status: 'waiting' as BattleStatus,
    settings: battleData.settings
  }

  const { data, error } = await supabase
    .from('battles')
    .insert(newBattle)
    .select()
    .single()

  if (error) {
    console.error('Error creating battle:', error)
    return null
  }

  return data
}

export async function joinBattle(battleId: string, userId: string, username: string): Promise<Battle | null> {
  const battle = await getBattleById(battleId)
  
  if (!battle) return null
  if (battle.players.length >= battle.max_players) return null
  if (battle.status !== 'waiting') return null

  const updatedPlayers = [
    ...battle.players,
    {
      userId,
      username,
      isBot: false,
      totalUnboxed: 0,
      items: []
    }
  ]

  const { data, error } = await supabase
    .from('battles')
    .update({ players: updatedPlayers })
    .eq('id', battleId)
    .select()
    .single()

  if (error) {
    console.error('Error joining battle:', error)
    return null
  }

  return data
}

export async function joinBattle(battleId: string, userId: string, username: string): Promise<Battle | null> {
  const battle = await getBattleById(battleId)
  
  if (!battle) return null
  if (battle.players.length >= battle.max_players) return null
  if (battle.status !== 'waiting') return null
  
  // Check if player is already in the battle
  if (battle.players.some(p => p.userId === userId)) {
    return battle
  }

  const updatedPlayers = [
    ...battle.players,
    {
      userId,
      username,
      isBot: false,
      totalUnboxed: 0,
      items: []
    }
  ]

  const { data, error } = await supabase
    .from('battles')
    .update({ players: updatedPlayers })
    .eq('id', battleId)
    .select()
    .single()

  if (error) {
    console.error('Error joining battle:', error)
    return null
  }

  return data
}

export async function addBotToLobby(battleId: string): Promise<Battle | null> {
  const battle = await getBattleById(battleId)
  
  if (!battle) return null
  if (battle.players.length >= battle.max_players) return null
  if (battle.status !== 'waiting') return null

  const botNames = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Theta']
  const botName = `BOT ${botNames[Math.floor(Math.random() * botNames.length)]}`
  const botId = `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Create bot user in database with high balance
  await supabase.from('users').upsert({
    id: botId,
    username: botName,
    email: `${botId}@bot.local`,
    password_hash: 'bot',
    balance: 999999.00
  }, { onConflict: 'id' })

  const updatedPlayers = [
    ...battle.players,
    {
      userId: botId,
      username: botName,
      isBot: true,
      totalUnboxed: 0,
      items: []
    }
  ]

  const { data, error } = await supabase
    .from('battles')
    .update({ players: updatedPlayers })
    .eq('id', battleId)
    .select()
    .single()

  if (error) {
    console.error('Error adding bot:', error)
    return null
  }

  return data
}

export async function startBattle(battleId: string): Promise<Battle | null> {
  const { data, error } = await supabase
    .from('battles')
    .update({ 
      status: 'in_progress',
      started_at: new Date().toISOString()
    })
    .eq('id', battleId)
    .select()
    .single()

  if (error) {
    console.error('Error starting battle:', error)
    return null
  }

  return data
}

export async function updateBattle(battleId: string, updates: Partial<Battle>): Promise<Battle | null> {
  const { data, error } = await supabase
    .from('battles')
    .update(updates)
    .eq('id', battleId)
    .select()
    .single()

  if (error) {
    console.error('Error updating battle:', error)
    return null
  }

  return data
}
