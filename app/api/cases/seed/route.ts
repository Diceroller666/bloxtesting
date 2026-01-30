import { NextResponse } from 'next/server'
import { seedCasesDatabase } from '@/lib/seed-cases'

export async function POST() {
  try {
    const cases = seedCasesDatabase()
    return NextResponse.json({ 
      success: true, 
      message: `Seeded ${cases.length} cases`,
      count: cases.length 
    })
  } catch (error) {
    console.error('Error seeding cases:', error)
    return NextResponse.json({ error: 'Failed to seed cases' }, { status: 500 })
  }
}
