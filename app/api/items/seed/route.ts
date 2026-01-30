import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { bloxStrikeItems } from '@/lib/seed-items-supabase'

async function seedItems() {
  const results = []
  
  for (const item of bloxStrikeItems) {
    const { data, error } = await supabase
      .from('items')
      .upsert(item, { onConflict: 'id' })
      .select()
    
    if (error) {
      console.error(`Error seeding item ${item.name} - ${item.skin}:`, error)
    } else {
      results.push(data)
    }
  }
  
  return {
    success: true, 
    message: `Seeded ${bloxStrikeItems.length} BloxStrike items to Supabase`,
    count: bloxStrikeItems.length,
    items: results
  }
}

export async function GET() {
  try {
    const result = await seedItems()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error seeding items:', error)
    return NextResponse.json({ error: 'Failed to seed items' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const result = await seedItems()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error seeding items:', error)
    return NextResponse.json({ error: 'Failed to seed items' }, { status: 500 })
  }
}
