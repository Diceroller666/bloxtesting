import fs from 'fs'
import path from 'path'

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
  creatorId: string
  mode: BattleMode
  playerCount: string // '1v1', '1v1v1', '2v2', etc.
  cases: string[] // array of case IDs
  players: BattlePlayer[]
  maxPlayers: number
  status: BattleStatus
  settings: {
    empireSpin: boolean
    fastMode: boolean
    reverseMode: boolean
    privateMode: boolean
  }
  createdAt: string
  startedAt?: string
  completedAt?: string
  winnerId?: string
}

const BATTLES_DB_PATH = path.join(process.cwd(), 'data', 'battles.json')

function ensureBattlesDbExists() {
  const dir = path.dirname(BATTLES_DB_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(BATTLES_DB_PATH)) {
    fs.writeFileSync(BATTLES_DB_PATH, JSON.stringify([]))
  }
}

export function getAllBattles(): Battle[] {
  ensureBattlesDbExists()
  const data = fs.readFileSync(BATTLES_DB_PATH, 'utf-8')
  return JSON.parse(data)
}

export function saveBattles(battles: Battle[]) {
  ensureBattlesDbExists()
  fs.writeFileSync(BATTLES_DB_PATH, JSON.stringify(battles, null, 2))
}

export function getBattleById(id: string): Battle | undefined {
  const battles = getAllBattles()
  return battles.find(b => b.id === id)
}

export function createBattle(battleData: Omit<Battle, 'id' | 'createdAt' | 'status' | 'players'>): Battle {
  const battles = getAllBattles()
  
  const newBattle: Battle = {
    ...battleData,
    id: `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'waiting',
    players: [],
    createdAt: new Date().toISOString()
  }
  
  battles.push(newBattle)
  saveBattles(battles)
  return newBattle
}

export function joinBattle(battleId: string, userId: string, username: string): Battle | null {
  const battles = getAllBattles()
  const battleIndex = battles.findIndex(b => b.id === battleId)
  
  if (battleIndex === -1) return null
  
  const battle = battles[battleIndex]
  
  if (battle.players.length >= battle.maxPlayers) return null
  if (battle.status !== 'waiting') return null
  if (battle.players.find(p => p.userId === userId)) return null
  
  battle.players.push({
    userId,
    username,
    isBot: false,
    totalUnboxed: 0,
    items: []
  })
  
  saveBattles(battles)
  return battle
}

export function addBotToLobby(battleId: string): Battle | null {
  const battles = getAllBattles()
  const battleIndex = battles.findIndex(b => b.id === battleId)
  
  if (battleIndex === -1) return null
  
  const battle = battles[battleIndex]
  
  if (battle.players.length >= battle.maxPlayers) return null
  if (battle.status !== 'waiting') return null
  
  const botNames = ['BOT Alpha', 'BOT Beta', 'BOT Gamma', 'BOT Delta', 'BOT Epsilon', 'BOT Zeta']
  const availableBotNames = botNames.filter(name => 
    !battle.players.find(p => p.username === name)
  )
  
  const botName = availableBotNames[0] || `BOT ${Date.now()}`
  
  battle.players.push({
    userId: `bot_${Date.now()}`,
    username: botName,
    isBot: true,
    totalUnboxed: 0,
    items: []
  })
  
  saveBattles(battles)
  return battle
}

export function startBattle(battleId: string): Battle | null {
  const battles = getAllBattles()
  const battleIndex = battles.findIndex(b => b.id === battleId)
  
  if (battleIndex === -1) return null
  
  const battle = battles[battleIndex]
  
  if (battle.status !== 'waiting') return null
  if (battle.players.length !== battle.maxPlayers) return null
  
  battle.status = 'in_progress'
  battle.startedAt = new Date().toISOString()
  
  saveBattles(battles)
  return battle
}

export function updateBattle(id: string, updates: Partial<Battle>): Battle | null {
  const battles = getAllBattles()
  const battleIndex = battles.findIndex(b => b.id === id)
  
  if (battleIndex === -1) return null
  
  battles[battleIndex] = { ...battles[battleIndex], ...updates }
  saveBattles(battles)
  return battles[battleIndex]
}

export function getActiveBattles(): Battle[] {
  const battles = getAllBattles()
  return battles.filter(b => b.status === 'waiting' || b.status === 'in_progress')
}
