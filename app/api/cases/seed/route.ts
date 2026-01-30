import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const seedCases = [
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
