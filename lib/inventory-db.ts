import fs from 'fs'
import path from 'path'
import { Item } from './items-db'

export interface InventoryItem {
  id: string
  userId: string
  itemId: string
  acquiredAt: string
  listedForSale: boolean
  salePrice?: number
}

const INVENTORY_DB_PATH = path.join(process.cwd(), 'data', 'inventory.json')

function ensureInventoryDbExists() {
  const dir = path.dirname(INVENTORY_DB_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(INVENTORY_DB_PATH)) {
    fs.writeFileSync(INVENTORY_DB_PATH, JSON.stringify([]))
  }
}

export function getAllInventoryItems(): InventoryItem[] {
  ensureInventoryDbExists()
  const data = fs.readFileSync(INVENTORY_DB_PATH, 'utf-8')
  return JSON.parse(data)
}

export function saveInventoryItems(items: InventoryItem[]) {
  ensureInventoryDbExists()
  fs.writeFileSync(INVENTORY_DB_PATH, JSON.stringify(items, null, 2))
}

export function getUserInventory(userId: string): InventoryItem[] {
  const items = getAllInventoryItems()
  return items.filter(item => item.userId === userId)
}

export function addItemToInventory(userId: string, itemId: string): InventoryItem {
  const items = getAllInventoryItems()
  const newInventoryItem: InventoryItem = {
    id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    itemId,
    acquiredAt: new Date().toISOString(),
    listedForSale: false
  }
  items.push(newInventoryItem)
  saveInventoryItems(items)
  return newInventoryItem
}

export function removeItemFromInventory(inventoryItemId: string): boolean {
  const items = getAllInventoryItems()
  const filteredItems = items.filter(item => item.id !== inventoryItemId)
  
  if (filteredItems.length === items.length) return false
  
  saveInventoryItems(filteredItems)
  return true
}

export function listItemForSale(inventoryItemId: string, salePrice: number): InventoryItem | null {
  const items = getAllInventoryItems()
  const itemIndex = items.findIndex(item => item.id === inventoryItemId)
  
  if (itemIndex === -1) return null
  
  items[itemIndex].listedForSale = true
  items[itemIndex].salePrice = salePrice
  saveInventoryItems(items)
  return items[itemIndex]
}

export function unlistItemFromSale(inventoryItemId: string): InventoryItem | null {
  const items = getAllInventoryItems()
  const itemIndex = items.findIndex(item => item.id === inventoryItemId)
  
  if (itemIndex === -1) return null
  
  items[itemIndex].listedForSale = false
  items[itemIndex].salePrice = undefined
  saveInventoryItems(items)
  return items[itemIndex]
}

export function getMarketplaceListings(): InventoryItem[] {
  const items = getAllInventoryItems()
  return items.filter(item => item.listedForSale)
}

export function transferItem(inventoryItemId: string, newUserId: string): InventoryItem | null {
  const items = getAllInventoryItems()
  const itemIndex = items.findIndex(item => item.id === inventoryItemId)
  
  if (itemIndex === -1) return null
  
  items[itemIndex].userId = newUserId
  items[itemIndex].listedForSale = false
  items[itemIndex].salePrice = undefined
  items[itemIndex].acquiredAt = new Date().toISOString()
  saveInventoryItems(items)
  return items[itemIndex]
}
