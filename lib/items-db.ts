import fs from 'fs'
import path from 'path'

export type ItemCategory = 'weapon' | 'knife' | 'keychain'
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export interface Item {
  id: string
  name: string
  skin: string
  category: ItemCategory
  weaponType?: string // e.g., 'M4A1-S', 'AK-47', 'AWP', 'Karambit', 'Flip Knife'
  rarity: ItemRarity
  value: number // in dollars
  imageUrl?: string
  description?: string
}

const ITEMS_DB_PATH = path.join(process.cwd(), 'data', 'items.json')

function ensureItemsDbExists() {
  const dir = path.dirname(ITEMS_DB_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(ITEMS_DB_PATH)) {
    fs.writeFileSync(ITEMS_DB_PATH, JSON.stringify([]))
  }
}

export function getAllItems(): Item[] {
  ensureItemsDbExists()
  const data = fs.readFileSync(ITEMS_DB_PATH, 'utf-8')
  return JSON.parse(data)
}

export function saveItems(items: Item[]) {
  ensureItemsDbExists()
  fs.writeFileSync(ITEMS_DB_PATH, JSON.stringify(items, null, 2))
}

export function getItemById(id: string): Item | undefined {
  const items = getAllItems()
  return items.find(item => item.id === id)
}

export function getItemsByCategory(category: ItemCategory): Item[] {
  const items = getAllItems()
  return items.filter(item => item.category === category)
}

export function getItemsByRarity(rarity: ItemRarity): Item[] {
  const items = getAllItems()
  return items.filter(item => item.rarity === rarity)
}

export function getItemsByValueRange(minValue: number, maxValue: number): Item[] {
  const items = getAllItems()
  return items.filter(item => item.value >= minValue && item.value <= maxValue)
}

export function addItem(item: Omit<Item, 'id'>): Item {
  const items = getAllItems()
  const newItem: Item = {
    ...item,
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  items.push(newItem)
  saveItems(items)
  return newItem
}

export function updateItem(id: string, updates: Partial<Omit<Item, 'id'>>): Item | null {
  const items = getAllItems()
  const itemIndex = items.findIndex(item => item.id === id)
  
  if (itemIndex === -1) return null
  
  items[itemIndex] = { ...items[itemIndex], ...updates }
  saveItems(items)
  return items[itemIndex]
}

export function deleteItem(id: string): boolean {
  const items = getAllItems()
  const filteredItems = items.filter(item => item.id !== id)
  
  if (filteredItems.length === items.length) return false
  
  saveItems(filteredItems)
  return true
}

export function searchItems(query: string): Item[] {
  const items = getAllItems()
  const lowerQuery = query.toLowerCase()
  return items.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) ||
    item.skin.toLowerCase().includes(lowerQuery) ||
    item.weaponType?.toLowerCase().includes(lowerQuery)
  )
}

export function getRandomItems(count: number, rarity?: ItemRarity): Item[] {
  let items = getAllItems()
  
  if (rarity) {
    items = items.filter(item => item.rarity === rarity)
  }
  
  const shuffled = items.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
