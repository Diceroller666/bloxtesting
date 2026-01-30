import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getBattleById, joinBattle } from '@/lib/supabase-battles'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const battle = await getBattleById(id)

    if (!battle) {
      return NextResponse.json({ error: 'Battle not found' }, { status: 404 })
    }

    return NextResponse.json({ battle })
  } catch (error) {
    console.error('Error fetching battle:', error)
    return NextResponse.json({ error: 'Failed to fetch battle' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const battle = await getBattleById(id)
    
    if (!battle) {
      return NextResponse.json({ error: 'Battle not found' }, { status: 404 })
    }

    if (battle.status !== 'waiting') {
      return NextResponse.json({ error: 'Battle already started' }, { status: 400 })
    }

    if (battle.players.length >= battle.max_players) {
      return NextResponse.json({ error: 'Battle is full' }, { status: 400 })
    }

    const updatedBattle = await joinBattle(id, session.userId, session.username)
    
    if (!updatedBattle) {
      return NextResponse.json({ error: 'Failed to join battle' }, { status: 500 })
    }

    return NextResponse.json({ success: true, battle: updatedBattle })
  } catch (error) {
    console.error('Error joining battle:', error)
    return NextResponse.json({ error: 'Failed to join battle' }, { status: 500 })
  }
}
