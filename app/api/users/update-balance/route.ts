import { NextRequest, NextResponse } from 'next/server'
import { updateUserBalance } from '@/lib/supabase-db'

export async function POST(request: NextRequest) {
  try {
    const { userId, amount } = await request.json()
    
    if (!userId || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing userId or amount' },
        { status: 400 }
      )
    }

    const success = await updateUserBalance(userId, amount)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update balance' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating balance:', error)
    return NextResponse.json(
      { error: 'Failed to update balance' },
      { status: 500 }
    )
  }
}
