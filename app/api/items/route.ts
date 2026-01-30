import { NextRequest, NextResponse } from 'next/server'
import { getAllItems, addItem, searchItems, getItemsByCategory, getItemsByRarity } from '@/lib/items-db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const rarity = searchParams.get('rarity')
    const query = searchParams.get('q')

    let items = getAllItems()

    if (query) {
      items = searchItems(query)
    } else if (category) {
      items = getItemsByCategory(category as any)
    } else if (rarity) {
      items = getItemsByRarity(rarity as any)
    }

    return NextResponse.json({ items, count: items.length })
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const itemData = await request.json()
    
    if (!itemData.name || !itemData.skin || !itemData.category || !itemData.rarity || itemData.value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, skin, category, rarity, value' },
        { status: 400 }
      )
    }

    const newItem = addItem(itemData)
    return NextResponse.json({ item: newItem, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error adding item:', error)
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
  }
}
