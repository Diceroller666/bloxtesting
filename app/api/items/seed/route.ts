import { NextResponse } from 'next/server'
import { seedItemsDatabase } from '@/lib/seed-items'

export async function POST() {
  try {
    const items = seedItemsDatabase()
    return NextResponse.json({ 
      success: true, 
      message: `Seeded ${items.length} items`,
      count: items.length 
    })
  } catch (error) {
    console.error('Error seeding items:', error)
    return NextResponse.json({ error: 'Failed to seed items' }, { status: 500 })
  }
}
