import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { addBotToLobby, getBattleById } from '@/lib/battles-db'

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
    const battle = getBattleById(id)

    if (!battle) {
      return NextResponse.json({ error: 'Battle not found' }, { status: 404 })
    }

    if (battle.creatorId !== session.userId) {
      return NextResponse.json({ error: 'Only the creator can add bots' }, { status: 403 })
    }

    const updatedBattle = addBotToLobby(id)

    if (!updatedBattle) {
      return NextResponse.json({ error: 'Cannot add bot' }, { status: 400 })
    }

    return NextResponse.json({ battle: updatedBattle, success: true })
  } catch (error) {
    console.error('Error adding bot:', error)
    return NextResponse.json({ error: 'Failed to add bot' }, { status: 500 })
  }
}
