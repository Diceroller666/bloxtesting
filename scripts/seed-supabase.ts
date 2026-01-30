import { supabase } from '../lib/supabase'

// Seed cases from your existing seed-cases.ts
const cases = [
  {
    id: 'case_seed_1_majesty',
    name: 'Majesty',
    price: 12.50,
    items: [
      { itemId: 'item_1', dropRate: 30 },
      { itemId: 'item_2', dropRate: 25 },
      { itemId: 'item_3', dropRate: 20 },
      { itemId: 'item_4', dropRate: 15 },
      { itemId: 'item_5', dropRate: 10 }
    ],
    description: 'Royal collection of premium items'
  },
  {
    id: 'case_seed_2_bishop',
    name: 'Bishop',
    price: 8.75,
    items: [
      { itemId: 'item_6', dropRate: 35 },
      { itemId: 'item_7', dropRate: 30 },
      { itemId: 'item_8', dropRate: 20 },
      { itemId: 'item_9', dropRate: 15 }
    ],
    description: 'Strategic selection of quality items'
  },
  {
    id: 'case_seed_3_stronghold',
    name: 'Stronghold',
    price: 15.00,
    items: [
      { itemId: 'item_10', dropRate: 25 },
      { itemId: 'item_11', dropRate: 25 },
      { itemId: 'item_12', dropRate: 20 },
      { itemId: 'item_13', dropRate: 15 },
      { itemId: 'item_14', dropRate: 15 }
    ],
    description: 'Fortified collection of rare items'
  }
]

async function seedCases() {
  console.log('Seeding cases to Supabase...')
  
  for (const caseData of cases) {
    const { data, error } = await supabase
      .from('cases')
      .upsert(caseData, { onConflict: 'id' })
    
    if (error) {
      console.error(`Error seeding case ${caseData.name}:`, error)
    } else {
      console.log(`✅ Seeded case: ${caseData.name}`)
    }
  }
  
  console.log('Done!')
}

seedCases()
