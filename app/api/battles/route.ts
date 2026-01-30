import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createBattle, getActiveBattles } from '@/lib/supabase-battles'

export async function GET() {
  try {
    const battles = await getActiveBattles()
    return NextResponse.json({ battles, count: battles.length })
  } catch (error) {
    console.error('Error fetching battles:', error)
    return NextResponse.json({ error: 'Failed to fetch battles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { mode, playerCount, cases, settings } = await request.json()
    
    if (!mode || !playerCount || !cases || cases.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const maxPlayersMap: { [key: string]: number } = {
      '1v1': 2,
      '1v1v1': 3,
      '1v1v1v1': 4,
      '2': 2,
      '3': 3,
      '4': 4,
      '2v2': 4
    }

    const maxPlayers = maxPlayersMap[playerCount] || parseInt(playerCount)

    const battle = await createBattle({
      creatorId: session.userId,
      mode,
      playerCount,
      cases,
      maxPlayers,
      settings,
      creatorUsername: session.username
    })

    if (!battle) {
      return NextResponse.json({ error: 'Failed to create battle' }, { status: 500 })
    }

    return NextResponse.json({ success: true, battle })
  } catch (error) {
    console.error('Error creating battle:', error)
    return NextResponse.json({ error: 'Failed to create battle' }, { status: 500 })
  }
}
