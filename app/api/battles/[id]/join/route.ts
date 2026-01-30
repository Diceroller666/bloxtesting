import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { joinBattle } from '@/lib/supabase-battles'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const battleId = params.id
    const battle = await joinBattle(battleId, session.userId, session.username)

    if (!battle) {
      return NextResponse.json({ error: 'Failed to join battle' }, { status: 500 })
    }

    return NextResponse.json({ success: true, battle })
  } catch (error) {
    console.error('Error joining battle:', error)
    return NextResponse.json({ error: 'Failed to join battle' }, { status: 500 })
  }
}
