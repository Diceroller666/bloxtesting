import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const seedCases = [
  {
    id: 'case_majesty',
    name: 'Majesty',
    price: 12.50,
    items: [
      { itemId: 'karambit_fade', dropRate: 5 },
      { itemId: 'butterfly_fade', dropRate: 3 },
      { itemId: 'karambit_blackwidow', dropRate: 8 },
      { itemId: 'flip_aurora', dropRate: 12 },
      { itemId: 'karambit_scarlet', dropRate: 10 },
      { itemId: 'keychain_gamebuddy', dropRate: 25 },
      { itemId: 'keychain_capstone', dropRate: 20 },
      { itemId: 'keychain_treat', dropRate: 17 }
    ],
    description: 'Royal collection of premium knives and rare items'
  },
  {
    id: 'case_bishop',
    name: 'Bishop',
    price: 8.75,
    items: [
      { itemId: 'flip_frostbite', dropRate: 15 },
      { itemId: 'flip_midnight', dropRate: 12 },
      { itemId: 'gut_fade', dropRate: 18 },
      { itemId: 'karambit_vanilla', dropRate: 10 },
      { itemId: 'keychain_relic', dropRate: 20 },
      { itemId: 'keychain_8bitheart', dropRate: 25 }
    ],
    description: 'Strategic selection of quality knives'
  },
  {
    id: 'case_stronghold',
    name: 'Stronghold',
    price: 15.00,
    items: [
      { itemId: 'butterfly_blackwidow', dropRate: 5 },
      { itemId: 'butterfly_midnight', dropRate: 8 },
      { itemId: 'karambit_naval', dropRate: 10 },
      { itemId: 'butterfly_woodland', dropRate: 12 },
      { itemId: 'flip_noir', dropRate: 15 },
      { itemId: 'keychain_billiardball', dropRate: 25 },
      { itemId: 'keychain_southpaw', dropRate: 25 }
    ],
    description: 'Fortified collection of rare butterfly and karambit knives'
  }
]

export async function POST() {
  try {
    const results = []
    
    for (const caseData of seedCases) {
      const { data, error } = await supabase
        .from('cases')
        .upsert(caseData, { onConflict: 'id' })
        .select()
      
      if (error) {
        console.error(`Error seeding case ${caseData.name}:`, error)
      } else {
        results.push(data)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Seeded ${seedCases.length} cases to Supabase`,
      count: seedCases.length,
      cases: results
    })
  } catch (error) {
    console.error('Error seeding cases:', error)
    return NextResponse.json({ error: 'Failed to seed cases' }, { status: 500 })
  }
}
