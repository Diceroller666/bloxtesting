'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/AuthContext'

interface BattlePlayer {
  userId: string
  username: string
  isBot: boolean
  totalUnboxed: number
  items: any[]
}

interface Battle {
  id: string
  creator_id: string
  mode: string
  player_count: string
  cases: any[]
  players: BattlePlayer[]
  max_players: number
  status: string
  settings: {
    empireSpin: boolean
    fastMode: boolean
    reverseMode: boolean
    privateMode: boolean
  }
}

interface BattleLobbyProps {
  battleId: string
  onBack: () => void
}

export default function BattleLobby({ battleId, onBack }: BattleLobbyProps) {
  const { user } = useAuth()
  const [battle, setBattle] = useState<Battle | null>(null)
  const [loading, setLoading] = useState(true)
  const [cases, setCases] = useState<any[]>([])
  const [currentRound, setCurrentRound] = useState(1)
  const [reelPositions, setReelPositions] = useState<number[]>([0, 0, 0, 0])
  const [isSpinning, setIsSpinning] = useState(false)
  const [hasStartedBattle, setHasStartedBattle] = useState(false)
  const [transitionEnabled, setTransitionEnabled] = useState(false)
  const [battleComplete, setBattleComplete] = useState(false)
  const [winner, setWinner] = useState<BattlePlayer | null>(null)
  const [totalWinnings, setTotalWinnings] = useState(0)
  const [roundItems, setRoundItems] = useState<any[]>([])
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false)

  useEffect(() => {
    // Reset all states when battleId changes (new battle)
    setCurrentRound(1)
    setReelPositions([0, 0, 0, 0])
    setIsSpinning(false)
    setHasStartedBattle(false)
    setTransitionEnabled(false)
    setBattleComplete(false)
    setWinner(null)
    setTotalWinnings(0)
    
    fetchBattle()
    const interval = setInterval(fetchBattle, 2000)
    return () => clearInterval(interval)
  }, [battleId])

  useEffect(() => {
    if (battle?.status === 'in_progress' && !hasStartedBattle) {
      setHasStartedBattle(true)
      setTimeout(() => startRound(), 500)
    }
  }, [battle?.status, hasStartedBattle])

  useEffect(() => {
    if (hasStartedBattle && !isSpinning && currentRound > 1) {
      setTimeout(() => startRound(), 500)
    }
  }, [currentRound])

  useEffect(() => {
    if (battle && battle.players.length === battle.max_players && battle.status === 'waiting') {
      handleStartBattle()
    }
  }, [battle?.players.length])

  const fetchBattle = async () => {
    try {
      const response = await fetch(`/api/battles/${battleId}`)
      const data = await response.json()
      setBattle(data.battle)
      
      if (data.battle?.cases) {
        fetchCases(data.battle.cases)
      }
    } catch (error) {
      console.error('Failed to fetch battle:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCases = async (caseIds: string[]) => {
    try {
      const response = await fetch('/api/cases')
      const data = await response.json()
      const selectedCases = data.cases.filter((c: any) => caseIds.includes(c.id))
      setCases(selectedCases)
    } catch (error) {
      console.error('Failed to fetch cases:', error)
    }
  }

  const handleAddBot = async () => {
    try {
      const response = await fetch(`/api/battles/${battleId}/bots`, {
        method: 'POST'
      })
      const data = await response.json()
      if (data.success) {
        setBattle(data.battle)
      }
    } catch (error) {
      console.error('Failed to add bot:', error)
    }
  }

  const handleStartBattle = async () => {
    try {
      await fetch(`/api/battles/${battleId}/start`, {
        method: 'POST'
      })
      fetchBattle()
    } catch (error) {
      console.error('Failed to start battle:', error)
    }
  }

  const startRound = () => {
    if (!battle) return
    
    setIsSpinning(true)
    
    // Generate items for this round (one per player)
    const items = battle.players.map(() => ({
      name: 'M4A4',
      skin: 'Desolate Space',
      value: Math.random() * 15 + 0.05,
      dropRate: (Math.random() * 40 + 5).toFixed(1)
    }))
    setRoundItems(items)
    
    // Step 1: Disable transition and reset to start position
    setTransitionEnabled(false)
    setReelPositions([0, 0, 0, 0])
    
    // Step 2: Wait for the reset to apply, then enable transition and spin
    setTimeout(() => {
      setTransitionEnabled(true)
      
      // Step 3: After transition is enabled, start the spin
      setTimeout(() => {
        const newPositions = battle.players.map(() => {
          const randomOffset = Math.random() * 100 - 50
          return -1980 + randomOffset // Scroll to final position
        })
        setReelPositions(newPositions)
      }, 20)
    }, 50)

    setTimeout(() => {
      setIsSpinning(false)
      
      // Update player totals with the items they won this round
      const updatedPlayers = battle.players.map((player, index) => ({
        ...player,
        totalUnboxed: player.totalUnboxed + items[index].value
      }))
      
      // Update battle state with new totals
      const updatedBattle = { ...battle, players: updatedPlayers }
      setBattle(updatedBattle)
      
      if (currentRound < (cases.length || 3)) {
        setTimeout(() => {
          setCurrentRound(prev => prev + 1)
        }, 2000)
      } else {
        // Battle complete - calculate winner and award balance
        setTimeout(async () => {
          const winningPlayer = updatedPlayers.reduce((max, player) => 
            player.totalUnboxed > max.totalUnboxed ? player : max
          )
          
          // Total pot is sum of all players' winnings
          const totalPot = updatedPlayers.reduce((sum, p) => sum + p.totalUnboxed, 0)
          
          setWinner(winningPlayer)
          setTotalWinnings(totalPot)
          setBattleComplete(true)
          
          // Award the entire pot to the winner
          if (!isUpdatingBalance && !winningPlayer.isBot) {
            setIsUpdatingBalance(true)
            try {
              await fetch('/api/users/update-balance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: winningPlayer.userId,
                  amount: totalPot
                })
              })
            } catch (error) {
              console.error('Failed to update balance:', error)
            }
          }
        }, 2000)
      }
    }, 3500)
  }

  if (loading || !battle) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-gray-400">Loading battle...</div>
      </div>
    )
  }

  const totalCost = cases.reduce((sum, c) => sum + c.price, 0)
  const emptySlots = battle.max_players - battle.players.length
  const isCreator = battle.creator_id === user?.id

  return (
    <div className="min-h-screen bg-empire-bg text-white p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <span>←</span>
          <span>Back to Battles</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-2xl">⚔️</div>
            <div>
              <h1 className="text-2xl font-bold">
                {battle.mode === 'standard' ? 'Standard Battle' : 
                 battle.mode === 'shared' ? 'Shared Battle' : 'Team Battle'}
              </h1>
              <p className="text-gray-400">
                {battle.status === 'waiting' ? 'Waiting for players...' : 
                 battleComplete ? 'Finished 🏆' :
                 battle.status === 'in_progress' ? `Round ${currentRound} of ${cases.length}` : 'Battle Complete'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Battle Cost</div>
            <div className="text-2xl font-bold text-empire-gold">💰 {totalCost.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-6">
          {cases.map((caseItem, index) => (
            <div
              key={index}
              className={`text-center ${
                index + 1 === currentRound ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <div className={`w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-2 flex items-center justify-center text-xl border-2 ${
                index + 1 === currentRound ? 'border-empire-gold' : 'border-gray-700'
              }`}>
                📦
              </div>
              <h3 className="text-xs font-semibold">{caseItem.name}</h3>
            </div>
          ))}
        </div>

        {battle.status === 'waiting' && (
          <div className="bg-empire-bg-light rounded-lg p-8 mb-6">
            <div className="grid grid-cols-4 gap-6">
              {battle.players.map((player, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-empire-bg-lighter flex items-center justify-center text-3xl border-2 border-empire-gold">
                    {player.isBot ? '🤖' : '👤'}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {player.isBot && (
                      <span className="px-2 py-0.5 bg-yellow-600 text-xs rounded font-semibold">BOT</span>
                    )}
                    <span className="font-semibold">{player.username}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Total Unboxed: <span className="text-empire-gold">💰 {player.totalUnboxed.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              
              {Array.from({ length: emptySlots }).map((_, index) => (
                <div key={`empty-${index}`} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-empire-bg-lighter flex items-center justify-center text-3xl border-2 border-gray-700 border-dashed">
                    <span className="text-gray-600">?</span>
                  </div>
                  <div className="text-gray-500 font-semibold">Waiting...</div>
                  <div className="text-sm text-gray-600">Empty Slot</div>
                </div>
              ))}
            </div>

            {isCreator && emptySlots > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleAddBot}
                  className="bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition"
                >
                  🤖 Call Bot to Fill Slot
                </button>
                <p className="text-sm text-gray-400 mt-2">
                  Battle will auto-start when all slots are filled
                </p>
              </div>
            )}

            {!isCreator && (
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Waiting for the host to fill remaining slots or for other players to join...
                </p>
              </div>
            )}
          </div>
        )}

        {battle.status === 'in_progress' && (
          <div className="space-y-0">
            <div className="bg-empire-bg-light rounded-t-lg overflow-hidden relative">
              {battleComplete && winner && (
                <div className="absolute inset-0 bg-gradient-to-b from-empire-bg via-green-900/20 to-empire-bg z-30 flex items-center justify-center animate-fade-in">
                  <div className="text-center animate-scale-in">
                    <h2 className="text-2xl font-bold text-white mb-4 opacity-0 animate-fade-in-delay-1">
                      {winner.username} won
                    </h2>
                    <div className="text-6xl font-bold text-green-400 mb-8 opacity-0 animate-fade-in-delay-2">
                      💰 {totalWinnings.toFixed(2)}
                    </div>
                    <div className="flex flex-col gap-3 opacity-0 animate-fade-in-delay-3">
                      <button className="bg-empire-gold text-empire-bg px-8 py-3 rounded-lg font-semibold hover:bg-empire-gold-dark transition">
                        Recreate for 💰 {totalCost.toFixed(2)}
                      </button>
                      <button className="bg-empire-bg-lighter text-white px-8 py-3 rounded-lg font-semibold hover:bg-empire-bg transition">
                        Modify Battle
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className={`grid gap-1 p-4 pb-0 ${
                battle.players.length === 2 ? 'grid-cols-2' : 
                battle.players.length === 3 ? 'grid-cols-3' : 'grid-cols-4'
              }`}>
                {battle.players.map((player, playerIndex) => (
                  <div key={playerIndex} className="text-center pb-2">
                    <div className="text-sm font-semibold text-white mb-1">Toxic Waste</div>
                    <div className="text-empire-gold font-bold text-xs">💰 15.32</div>
                  </div>
                ))}
              </div>
              
              <div className={`grid gap-1 px-4 transition-all duration-500 ${
                battle.players.length === 2 ? 'grid-cols-2' : 
                battle.players.length === 3 ? 'grid-cols-3' : 'grid-cols-4'
              } ${battleComplete ? 'blur-sm' : ''}`}>
                {battle.players.map((player, playerIndex) => (
                  <div key={playerIndex} className="relative">
                    <div className={`relative h-80 overflow-hidden bg-empire-bg rounded ${
                      battleComplete && winner?.userId === player.userId ? 'shadow-lg shadow-green-500/50' : ''
                    }`}>
                      {!battleComplete && (
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-empire-gold z-20 transform -translate-y-1/2"></div>
                      )}
                      
                      <div 
                        className={`flex flex-col gap-2 absolute left-0 right-0 px-2 py-2 ${
                          transitionEnabled ? 'transition-transform duration-[3500ms] ease-out' : ''
                        }`}
                        style={{ 
                          transform: `translateY(calc(-50% + ${reelPositions[playerIndex] || 0}px))`
                        }}
                      >
                        {Array.from({ length: 90 }).map((_, itemIndex) => {
                          const repeatedIndex = itemIndex % 30
                          const isWinningItem = repeatedIndex === 15
                          return (
                            <div
                              key={itemIndex}
                              className={`flex-shrink-0 h-20 rounded flex items-center justify-center ${
                                isWinningItem ? 'bg-empire-bg-lighter' : 'bg-empire-bg-light'
                              }`}
                            >
                              <div className="text-4xl">🔫</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-4"></div>
            </div>

            <div className={`grid gap-0 ${
              battle.players.length === 2 ? 'grid-cols-2' : 
              battle.players.length === 3 ? 'grid-cols-3' : 'grid-cols-4'
            }`}>
              {battle.players.map((player, playerIndex) => (
                <div 
                  key={playerIndex} 
                  className={`p-4 border-t-2 ${
                    playerIndex === 2 ? 'bg-empire-bg-lighter border-empire-gold' : 'bg-empire-bg-light border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-empire-gold flex items-center justify-center text-sm">
                        {player.isBot ? '🤖' : '👤'}
                      </div>
                      {player.isBot && (
                        <span className="px-2 py-0.5 bg-yellow-600 text-xs rounded font-bold">BOT</span>
                      )}
                      <span className="font-semibold">{player.username}</span>
                    </div>
                    {playerIndex === 2 && <span className="text-yellow-400 text-xl">⭐</span>}
                  </div>
                  <div className="text-sm text-gray-400">
                    Total Unboxed <span className="text-empire-gold font-bold">💰 {player.totalUnboxed.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={`grid gap-0 ${
              battle.players.length === 2 ? 'grid-cols-2' : 
              battle.players.length === 3 ? 'grid-cols-3' : 'grid-cols-4'
            }`}>
              {battle.players.map((player, playerIndex) => (
                <div key={playerIndex} className="bg-empire-bg-light p-4 border-t border-gray-800">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>#{currentRound}</span>
                    <span>{roundItems[playerIndex]?.dropRate || 0}%</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-16 flex items-center justify-center mb-2">
                      <div className="text-5xl">🔫</div>
                    </div>
                    <div className="text-xs text-gray-500 mb-1">{roundItems[playerIndex]?.name || 'Item'}</div>
                    <div className="text-sm font-semibold text-purple-400 mb-1">{roundItems[playerIndex]?.skin || 'Skin'}</div>
                    <div className="text-empire-gold font-bold">💰 {(roundItems[playerIndex]?.value || 0).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
