import fs from 'fs'
import path from 'path'

export interface User {
  id: string
  username: string
  password: string
  balance: number
  createdAt: string
}

const DB_PATH = path.join(process.cwd(), 'data', 'users.json')

function ensureDbExists() {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]))
  }
}

export function getUsers(): User[] {
  ensureDbExists()
  const data = fs.readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(data)
}

export function saveUsers(users: User[]) {
  ensureDbExists()
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2))
}

export function findUserByUsername(username: string): User | undefined {
  const users = getUsers()
  return users.find(u => u.username.toLowerCase() === username.toLowerCase())
}

export function createUser(username: string, hashedPassword: string): User {
  const users = getUsers()
  const newUser: User = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
    balance: 0,
    createdAt: new Date().toISOString()
  }
  users.push(newUser)
  saveUsers(users)
  return newUser
}

export function updateUserBalance(userId: string, newBalance: number) {
  const users = getUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  if (userIndex !== -1) {
    users[userIndex].balance = newBalance
    saveUsers(users)
    return users[userIndex]
  }
  return null
}
