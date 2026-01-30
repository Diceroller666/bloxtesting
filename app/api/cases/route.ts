import { NextRequest, NextResponse } from 'next/server'
import { getAllCases, addCase } from '@/lib/supabase-cases'

export async function GET() {
  try {
    const cases = await getAllCases()
    return NextResponse.json({ cases, count: cases.length })
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
