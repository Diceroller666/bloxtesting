import { Item, saveItems } from './items-db'

const items: Omit<Item, 'id'>[] = [
  // CHRYSALIS COLLECTION - Weapons from Image 1 & 2
  { name: 'M4A1-S', skin: 'Orchids', category: 'weapon', weaponType: 'M4A1-S', rarity: 'epic', value: 45.00 },
  { name: 'M4A4', skin: 'B-Hop', category: 'weapon', weaponType: 'M4A4', rarity: 'epic', value: 52.00 },
  { name: 'Glock-18', skin: 'Fuji', category: 'weapon', weaponType: 'Glock-18', rarity: 'rare', value: 18.50 },
  { name: 'GALIL', skin: 'Monochrome', category: 'weapon', weaponType: 'GALIL', rarity: 'rare', value: 22.00 },
  { name: 'SG-553', skin: 'Dynasty', category: 'weapon', weaponType: 'SG-553', rarity: 'epic', value: 38.00 },
  { name: 'P250', skin: 'B-250', category: 'weapon', weaponType: 'P250', rarity: 'legendary', value: 65.00 },
  { name: 'Dual Berettas', skin: 'Vernal', category: 'weapon', weaponType: 'Dual Berettas', rarity: 'rare', value: 28.00 },
  { name: 'SSG-08', skin: 'Labyrinth', category: 'weapon', weaponType: 'SSG-08', rarity: 'epic', value: 42.00 },
  { name: 'Mac-10', skin: 'Dasies', category: 'weapon', weaponType: 'Mac-10', rarity: 'uncommon', value: 12.00 },
  { name: 'Tec-9', skin: 'Monarch', category: 'weapon', weaponType: 'Tec-9', rarity: 'rare', value: 25.00 },
  { name: 'Negev', skin: 'Noctiflora', category: 'weapon', weaponType: 'Negev', rarity: 'epic', value: 48.00 },
  { name: 'AUG', skin: 'Overgrowth', category: 'weapon', weaponType: 'AUG', rarity: 'epic', value: 55.00 },
  { name: 'XM1014', skin: 'Lilies', category: 'weapon', weaponType: 'XM1014', rarity: 'rare', value: 20.00 },
  { name: 'Nova', skin: 'Flutter', category: 'weapon', weaponType: 'Nova', rarity: 'uncommon', value: 15.00 },

  // BLOX STRIKE COLLECTION - Weapons from Image 6
  { name: 'M4A1-S', skin: 'Retro', category: 'weapon', weaponType: 'M4A1-S', rarity: 'rare', value: 32.00 },
  { name: 'AK-47', skin: 'Sakura', category: 'weapon', weaponType: 'AK-47', rarity: 'epic', value: 68.00 },
  { name: 'AWP', skin: 'Typhon', category: 'weapon', weaponType: 'AWP', rarity: 'legendary', value: 125.00 },
  { name: 'Deagle', skin: 'Marcy', category: 'weapon', weaponType: 'Desert Eagle', rarity: 'rare', value: 35.00 },
  { name: 'Glock-18', skin: 'Fade', category: 'weapon', weaponType: 'Glock-18', rarity: 'epic', value: 58.00 },
  { name: 'AUG', skin: 'Hot Rod', category: 'weapon', weaponType: 'AUG', rarity: 'legendary', value: 95.00 },
  { name: 'XM1014', skin: 'Abstract', category: 'weapon', weaponType: 'XM1014', rarity: 'rare', value: 28.00 },
  { name: 'TEC-9', skin: 'Striker', category: 'weapon', weaponType: 'TEC-9', rarity: 'epic', value: 42.00 },
  { name: 'P250', skin: 'Pulse', category: 'weapon', weaponType: 'P250', rarity: 'rare', value: 24.00 },
  { name: 'P90', skin: 'Big Cat', category: 'weapon', weaponType: 'P90', rarity: 'epic', value: 52.00 },
  { name: 'FAMAS', skin: 'Arctic Camo', category: 'weapon', weaponType: 'FAMAS', rarity: 'uncommon', value: 18.00 },
  { name: 'NOVA', skin: 'Heat', category: 'weapon', weaponType: 'Nova', rarity: 'uncommon', value: 16.00 },
  { name: 'SSG-08', skin: 'Desert Strike', category: 'weapon', weaponType: 'SSG-08', rarity: 'rare', value: 38.00 },
  { name: 'GALIL', skin: 'Irradiated', category: 'weapon', weaponType: 'GALIL', rarity: 'epic', value: 45.00 },

  // KARAMBIT KNIVES - Image 5 (Top Row)
  { name: 'Karambit', skin: 'Frostbite', category: 'knife', weaponType: 'Karambit', rarity: 'legendary', value: 450.00 },
  { name: 'Karambit', skin: 'Noir', category: 'knife', weaponType: 'Karambit', rarity: 'legendary', value: 380.00 },
  { name: 'Karambit', skin: 'Aurora', category: 'knife', weaponType: 'Karambit', rarity: 'legendary', value: 520.00 },
  { name: 'Karambit', skin: 'Whiteout', category: 'knife', weaponType: 'Karambit', rarity: 'legendary', value: 420.00 },
  { name: 'Karambit', skin: 'Midnight', category: 'knife', weaponType: 'Karambit', rarity: 'legendary', value: 480.00 },
  { name: 'Karambit', skin: 'Vanilla', category: 'knife', weaponType: 'Karambit', rarity: 'legendary', value: 350.00 },

  // FLIP KNIFE - Image 7 (All Rows)
  { name: 'Flip Knife', skin: 'Vanilla', category: 'knife', weaponType: 'Flip Knife', rarity: 'legendary', value: 280.00 },
  { name: 'Flip Knife', skin: 'Fade', category: 'knife', weaponType: 'Flip Knife', rarity: 'legendary', value: 420.00 },
  { name: 'Flip Knife', skin: 'Woodland', category: 'knife', weaponType: 'Flip Knife', rarity: 'legendary', value: 320.00 },
  { name: 'Flip Knife', skin: 'Naval', category: 'knife', weaponType: 'Flip Knife', rarity: 'legendary', value: 380.00 },
  { name: 'Flip Knife', skin: 'Whiteout', category: 'knife', weaponType: 'Flip Knife', rarity: 'legendary', value: 340.00 },
  { name: 'Flip Knife', skin: 'Safari', category: 'knife', weaponType: 'Flip Knife', rarity: 'legendary', value: 300.00 },
  { name: 'Flip Knife', skin: 'Violet', category: 'knife', weaponType: 'Flip Knife', rarity: 'legendary', value: 390.00 },
  { name: 'Flip Knife', skin: 'Midnight', category: 'knife', weaponType: 'Flip Knife', rarity: 'legendary', value: 360.00 },
  { name: 'Flip Knife', skin: 'Blackwidow', category: 'knife', weaponType: 'Flip Knife', rarity: 'legendary', value: 410.00 },
  { name: 'Flip Knife', skin: 'Scarlet', category: 'knife', weaponType: 'Flip Knife', rarity: 'legendary', value: 400.00 },

  // GUT KNIFE - Using similar skins as Karambit
  { name: 'Gut Knife', skin: 'Frostbite', category: 'knife', weaponType: 'Gut Knife', rarity: 'epic', value: 220.00 },
  { name: 'Gut Knife', skin: 'Noir', category: 'knife', weaponType: 'Gut Knife', rarity: 'epic', value: 180.00 },
  { name: 'Gut Knife', skin: 'Aurora', category: 'knife', weaponType: 'Gut Knife', rarity: 'epic', value: 250.00 },
  { name: 'Gut Knife', skin: 'Whiteout', category: 'knife', weaponType: 'Gut Knife', rarity: 'epic', value: 200.00 },
  { name: 'Gut Knife', skin: 'Midnight', category: 'knife', weaponType: 'Gut Knife', rarity: 'epic', value: 230.00 },
  { name: 'Gut Knife', skin: 'Vanilla', category: 'knife', weaponType: 'Gut Knife', rarity: 'epic', value: 170.00 },
  { name: 'Gut Knife', skin: 'Fade', category: 'knife', weaponType: 'Gut Knife', rarity: 'epic', value: 240.00 },
  { name: 'Gut Knife', skin: 'Safari', category: 'knife', weaponType: 'Gut Knife', rarity: 'epic', value: 160.00 },

  // KEYCHAINS - Images 3 & 4
  { name: 'Keychain', skin: 'Relic', category: 'keychain', rarity: 'rare', value: 8.50 },
  { name: 'Keychain', skin: 'CapStone', category: 'keychain', rarity: 'epic', value: 15.00 },
  { name: 'Keychain', skin: 'Game Buddy', category: 'keychain', rarity: 'uncommon', value: 6.00 },
  { name: 'Keychain', skin: 'Billiard Ball', category: 'keychain', rarity: 'uncommon', value: 5.50 },
  { name: 'Keychain', skin: 'Treat', category: 'keychain', rarity: 'rare', value: 7.00 },
  { name: 'Keychain', skin: 'Cassette', category: 'keychain', rarity: 'rare', value: 9.00 },
  { name: 'Keychain', skin: '8-bit Heart', category: 'keychain', rarity: 'epic', value: 12.00 },
  { name: 'Keychain', skin: 'SouthPaw', category: 'keychain', rarity: 'uncommon', value: 5.00 },
  { name: 'Keychain', skin: 'Soda Pop', category: 'keychain', rarity: 'uncommon', value: 4.50 },
  { name: 'Keychain', skin: 'Flora', category: 'keychain', rarity: 'rare', value: 7.50 },
  { name: 'Keychain', skin: 'Anchor', category: 'keychain', rarity: 'common', value: 3.00 },
  { name: 'Keychain', skin: 'For Sale', category: 'keychain', rarity: 'uncommon', value: 4.00 },
  { name: 'Keychain', skin: "Lil'Nade", category: 'keychain', rarity: 'rare', value: 8.00 },
  { name: 'Keychain', skin: 'Target', category: 'keychain', rarity: 'uncommon', value: 5.00 },
  { name: 'Keychain', skin: 'Credit', category: 'keychain', rarity: 'common', value: 2.50 },
  { name: 'Keychain', skin: 'Bullet', category: 'keychain', rarity: 'uncommon', value: 4.50 },
  { name: 'Keychain', skin: 'Flight Tag', category: 'keychain', rarity: 'rare', value: 6.50 },
]

export function seedItemsDatabase() {
  const itemsWithIds = items.map((item, index) => ({
    ...item,
    id: `item_seed_${index + 1}_${item.name.toLowerCase().replace(/\s+/g, '_')}_${item.skin.toLowerCase().replace(/\s+/g, '_')}`
  }))
  
  saveItems(itemsWithIds)
  console.log(`✅ Seeded ${itemsWithIds.length} items to database`)
  return itemsWithIds
}

// Run if executed directly
if (require.main === module) {
  seedItemsDatabase()
}
