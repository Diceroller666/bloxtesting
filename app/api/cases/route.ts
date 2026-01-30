import { NextRequest, NextResponse } from 'next/server'
import { getAllCases, addCase } from '@/lib/cases-db'
import { getItemById } from '@/lib/items-db'

export async function GET() {
  try {
    const cases = getAllCases()
    
    const casesWithItems = cases.map(caseData => {
      const itemsWithDetails = caseData.items.map(caseItem => {
        const itemDetails = getItemById(caseItem.itemId)
        return {
          ...caseItem,
          item: itemDetails
        }
      })
      
      return {
        ...caseData,
        items: itemsWithDetails
      }
    })

    return NextResponse.json({ cases: casesWithItems, count: casesWithItems.length })
  } catch (error) {
    console.error('Error fetching cases:', error)
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const caseData = await request.json()
    
    if (!caseData.name || !caseData.price || !caseData.items) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, items' },
        { status: 400 }
      )
    }

    const newCase = addCase(caseData)
    return NextResponse.json({ case: newCase, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error adding case:', error)
    return NextResponse.json({ error: 'Failed to add case' }, { status: 500 })
  }
}
