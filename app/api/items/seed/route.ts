import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { bloxStrikeItems } from '@/lib/seed-items-supabase'

export async function POST() {
  try {
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
    
    return NextResponse.json({ 
      success: true, 
      message: `Seeded ${bloxStrikeItems.length} BloxStrike items to Supabase`,
      count: bloxStrikeItems.length,
      items: results
    })
  } catch (error) {
    console.error('Error seeding items:', error)
    return NextResponse.json({ error: 'Failed to seed items' }, { status: 500 })
  }
}
