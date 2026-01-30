import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { startBattle, getBattleById } from '@/lib/battles-db'

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

    const updatedBattle = startBattle(id)

    if (!updatedBattle) {
      return NextResponse.json({ error: 'Cannot start battle' }, { status: 400 })
    }

    return NextResponse.json({ battle: updatedBattle, success: true })
  } catch (error) {
    console.error('Error starting battle:', error)
    return NextResponse.json({ error: 'Failed to start battle' }, { status: 500 })
  }
}
