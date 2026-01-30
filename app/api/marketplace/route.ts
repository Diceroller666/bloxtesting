import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getMarketplaceListings, transferItem, getAllInventoryItems } from '@/lib/inventory-db'
import { getItemById } from '@/lib/items-db'
import { getUsers, updateUserBalance } from '@/lib/db'

export async function GET() {
  try {
    const listings = getMarketplaceListings()
    
    const listingsWithDetails = listings.map(listing => {
      const itemDetails = getItemById(listing.itemId)
      const users = getUsers()
      const seller = users.find(u => u.id === listing.userId)
      
      return {
        ...listing,
        item: itemDetails,
        sellerUsername: seller?.username || 'Unknown'
      }
    })

    return NextResponse.json({ listings: listingsWithDetails, count: listingsWithDetails.length })
  } catch (error) {
    console.error('Error fetching marketplace:', error)
    return NextResponse.json({ error: 'Failed to fetch marketplace' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { inventoryItemId } = await request.json()
    
    if (!inventoryItemId) {
      return NextResponse.json({ error: 'inventoryItemId is required' }, { status: 400 })
    }

    const allItems = getAllInventoryItems()
    const inventoryItem = allItems.find(i => i.id === inventoryItemId)
    
    if (!inventoryItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    if (!inventoryItem.listedForSale || !inventoryItem.salePrice) {
      return NextResponse.json({ error: 'Item is not listed for sale' }, { status: 400 })
    }

    if (inventoryItem.userId === session.userId) {
      return NextResponse.json({ error: 'Cannot buy your own item' }, { status: 400 })
    }

    const users = getUsers()
    const buyer = users.find(u => u.id === session.userId)
    const seller = users.find(u => u.id === inventoryItem.userId)
    
    if (!buyer || !seller) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (buyer.balance < inventoryItem.salePrice) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    updateUserBalance(buyer.id, buyer.balance - inventoryItem.salePrice)
    updateUserBalance(seller.id, seller.balance + inventoryItem.salePrice)
    
    const transferredItem = transferItem(inventoryItemId, session.userId)
    
    if (!transferredItem) {
      return NextResponse.json({ error: 'Failed to transfer item' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      inventoryItem: transferredItem,
      newBalance: buyer.balance - inventoryItem.salePrice
    })
  } catch (error) {
    console.error('Error purchasing item:', error)
    return NextResponse.json({ error: 'Failed to purchase item' }, { status: 500 })
  }
}
