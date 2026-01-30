import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { removeItemFromInventory, listItemForSale, unlistItemFromSale, getAllInventoryItems } from '@/lib/inventory-db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const allItems = getAllInventoryItems()
    const item = allItems.find(i => i.id === id)
    
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    if (item.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const success = removeItemFromInventory(id)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing item from inventory:', error)
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { action, salePrice } = await request.json()
    
    const allItems = getAllInventoryItems()
    const item = allItems.find(i => i.id === id)
    
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    if (item.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    let updatedItem
    
    if (action === 'list') {
      if (!salePrice || salePrice <= 0) {
        return NextResponse.json({ error: 'Valid salePrice is required' }, { status: 400 })
      }
      updatedItem = listItemForSale(id, salePrice)
    } else if (action === 'unlist') {
      updatedItem = unlistItemFromSale(id)
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (!updatedItem) {
      return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
    }

    return NextResponse.json({ inventoryItem: updatedItem, success: true })
  } catch (error) {
    console.error('Error updating inventory item:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}
