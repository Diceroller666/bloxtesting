# BloxEmpire Items Database Guide

## Overview
Complete database of 69 items including weapons, knives, and keychains for Case Battles and Marketplace.

## Database Structure

### Item Schema
```typescript
{
  id: string              // Unique identifier
  name: string            // Weapon/item name (e.g., "M4A1-S", "Karambit")
  skin: string            // Skin name (e.g., "Orchids", "Fade")
  category: 'weapon' | 'knife' | 'keychain'
  weaponType?: string     // Full weapon type
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  value: number           // Dollar value
  imageUrl?: string       // Optional image URL
  description?: string    // Optional description
}
```

## Item Counts
- **Weapons**: 28 items
- **Knives**: 24 items (Karambit: 6, Flip Knife: 10, Gut Knife: 8)
- **Keychains**: 17 items
- **Total**: 69 items

## Rarity Distribution
- **Common**: 2 items ($2.50-$3.00)
- **Uncommon**: 9 items ($4.00-$18.00)
- **Rare**: 14 items ($7.00-$38.00)
- **Epic**: 20 items ($12.00-$95.00)
- **Legendary**: 24 items ($65.00-$520.00)

## API Endpoints

### Get All Items
```bash
GET /api/items
# Returns all 69 items
```

### Filter by Category
```bash
GET /api/items?category=weapon
GET /api/items?category=knife
GET /api/items?category=keychain
```

### Filter by Rarity
```bash
GET /api/items?rarity=legendary
GET /api/items?rarity=epic
GET /api/items?rarity=rare
```

### Search Items
```bash
GET /api/items?q=fade
GET /api/items?q=karambit
GET /api/items?q=m4a1
```

### Get Single Item
```bash
GET /api/items/{id}
```

### Add New Item
```bash
POST /api/items
Content-Type: application/json

{
  "name": "AK-47",
  "skin": "Fire Serpent",
  "category": "weapon",
  "weaponType": "AK-47",
  "rarity": "legendary",
  "value": 850.00
}
```

### Update Item
```bash
PATCH /api/items/{id}
Content-Type: application/json

{
  "value": 900.00,
  "rarity": "legendary"
}
```

### Delete Item
```bash
DELETE /api/items/{id}
```

### Seed Database (Reset to Default 69 Items)
```bash
POST /api/items/seed
```

## User Inventory System

### Get User's Inventory
```bash
GET /api/inventory
# Requires authentication
```

### Add Item to Inventory
```bash
POST /api/inventory
Content-Type: application/json

{
  "itemId": "item_seed_1_m4a1-s_orchids"
}
```

### Remove Item from Inventory
```bash
DELETE /api/inventory/{inventoryItemId}
```

### List Item for Sale
```bash
PATCH /api/inventory/{inventoryItemId}
Content-Type: application/json

{
  "action": "list",
  "salePrice": 50.00
}
```

### Unlist Item from Sale
```bash
PATCH /api/inventory/{inventoryItemId}
Content-Type: application/json

{
  "action": "unlist"
}
```

## Marketplace System

### Get All Marketplace Listings
```bash
GET /api/marketplace
```

### Purchase Item from Marketplace
```bash
POST /api/marketplace
Content-Type: application/json

{
  "inventoryItemId": "inv_123456_abc"
}
```

## Notable Items

### Most Valuable Knives
1. **Karambit | Aurora** - $520.00 (Legendary)
2. **Karambit | Midnight** - $480.00 (Legendary)
3. **Karambit | Frostbite** - $450.00 (Legendary)
4. **Flip Knife | Fade** - $420.00 (Legendary)
5. **Karambit | Whiteout** - $420.00 (Legendary)

### Most Valuable Weapons
1. **AWP | Typhon** - $125.00 (Legendary)
2. **AUG | Hot Rod** - $95.00 (Legendary)
3. **AK-47 | Sakura** - $68.00 (Epic)
4. **P250 | B-250** - $65.00 (Legendary)
5. **Glock-18 | Fade** - $58.00 (Epic)

### Budget Items (Under $10)
- Keychains: $2.50-$9.00
- Nova | Flutter: $15.00
- Mac-10 | Dasies: $12.00
- Nova | Heat: $16.00

## Usage in Code

```typescript
import { getAllItems, getItemsByCategory, getRandomItems } from '@/lib/items-db'

// Get all weapons
const weapons = getItemsByCategory('weapon')

// Get random legendary items for case opening
const legendaryItems = getRandomItems(5, 'legendary')

// Get all knives
const knives = getItemsByCategory('knife')
```

## File Locations
- **Database File**: `/data/items.json`
- **Inventory File**: `/data/inventory.json`
- **Schema**: `/lib/items-db.ts`
- **Seed Data**: `/lib/seed-items.ts`
- **API Routes**: `/app/api/items/`, `/app/api/inventory/`, `/app/api/marketplace/`

## Easy Management

### Add Items via API
Use POST /api/items with JSON payload - no need to edit files directly.

### Remove Items via API
Use DELETE /api/items/{id} - instant removal.

### Reset Database
POST /api/items/seed - restores all 69 default items.

### Backup Database
Simply copy `/data/items.json` and `/data/inventory.json` files.

## Integration with Games

### Case Battles
```typescript
// Get random items for case rewards
const caseItems = getRandomItems(10, 'epic')
```

### Marketplace
```typescript
// User lists item for sale
await fetch('/api/inventory/${invItemId}', {
  method: 'PATCH',
  body: JSON.stringify({ action: 'list', salePrice: 100 })
})

// Another user purchases it
await fetch('/api/marketplace', {
  method: 'POST',
  body: JSON.stringify({ inventoryItemId: invItemId })
})
```

### Roulette Rewards
```typescript
// Give winner an item
await fetch('/api/inventory', {
  method: 'POST',
  body: JSON.stringify({ itemId: 'item_seed_17_awp_typhon' })
})
```
