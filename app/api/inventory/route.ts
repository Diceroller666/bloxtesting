import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getUserInventory, addItemToInventory } from '@/lib/inventory-db'
import { getItemById } from '@/lib/items-db'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const inventoryItems = getUserInventory(session.userId)
    
    const itemsWithDetails = inventoryItems.map(invItem => {
      const itemDetails = getItemById(invItem.itemId)
      return {
        ...invItem,
        item: itemDetails
      }
    })

    return NextResponse.json({ inventory: itemsWithDetails, count: itemsWithDetails.length })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId } = await request.json()
    
    if (!itemId) {
      return NextResponse.json({ error: 'itemId is required' }, { status: 400 })
    }

    const item = getItemById(itemId)
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const inventoryItem = addItemToInventory(session.userId, itemId)
    
    return NextResponse.json({ 
      inventoryItem,
      item,
      success: true 
    }, { status: 201 })
  } catch (error) {
    console.error('Error adding item to inventory:', error)
    return NextResponse.json({ error: 'Failed to add item to inventory' }, { status: 500 })
  }
}
