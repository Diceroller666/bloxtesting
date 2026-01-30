'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider } from '@/lib/AuthContext'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import SelectCasesModal from '@/components/SelectCasesModal'

interface Case {
  id: string
  name: string
  price: number
  items: any[]
}

export default function CreateBattlePage() {
  const router = useRouter()
  const [battleMode, setBattleMode] = useState<'standard' | 'shared' | 'team'>('standard')
  const [playerCount, setPlayerCount] = useState<'1v1' | '1v1v1' | '1v1v1v1' | '2' | '3' | '4' | '2v2'>('1v1')
  const [selectedCases, setSelectedCases] = useState<Case[]>([])
  const [showCasesModal, setShowCasesModal] = useState(false)
  const [empireSpinEnabled, setEmpireSpinEnabled] = useState(true)
  const [fastModeEnabled, setFastModeEnabled] = useState(false)
  const [reverseMode, setReverseMode] = useState(false)
  const [privateMode, setPrivateMode] = useState(false)

  const totalValue = selectedCases.reduce((sum, c) => sum + c.price, 0)

  const handleAddCases = (cases: Case[]) => {
    setSelectedCases([...selectedCases, ...cases])
  }

  const handleRemoveCase = (caseId: string) => {
    setSelectedCases(selectedCases.filter(c => c.id !== caseId))
  }

  const handleCreateBattle = async () => {
    try {
      const response = await fetch('/api/battles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: battleMode,
          playerCount,
          cases: selectedCases.map(c => c.id),
          settings: {
            empireSpin: empireSpinEnabled,
            fastMode: fastModeEnabled,
            reverseMode: reverseMode,
            privateMode: privateMode
          }
        })
      })

      const data = await response.json()
      
      if (data.success && data.battle) {
        router.push(`/case-battles/${data.battle.id}`)
      }
    } catch (error) {
      console.error('Failed to create battle:', error)
    }
  }

  return (
    <AuthProvider>
      <div className="flex h-screen bg-empire-bg text-white">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header currentPage="case-battles" setCurrentPage={() => {}} />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto p-6">
            <div className="mb-6">
              <button
                onClick={() => router.push('/case-battles')}
                className="flex items-center gap-2 text-gray-400 hover:text-white"
              >
                <span>←</span>
                <span>Back to Battles</span>
              </button>
            </div>

            <h2 className="text-3xl font-bold mb-6">Create Battle</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div
                onClick={() => { setBattleMode('standard'); setPlayerCount('1v1') }}
                className={`p-6 rounded-lg border-2 cursor-pointer transition ${
                  battleMode === 'standard' 
                    ? 'bg-empire-bg-lighter border-empire-gold' 
                    : 'bg-empire-bg-light border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-3xl mb-3">⚔️</div>
                <h3 className="text-lg font-bold mb-2">Standard Battle</h3>
                <div className="flex gap-2 text-sm">
                  <span className={`px-2 py-1 rounded ${playerCount === '1v1' && battleMode === 'standard' ? 'bg-empire-gold text-empire-bg' : 'bg-empire-bg-lighter'}`}>1v1</span>
                  <span className={`px-2 py-1 rounded ${playerCount === '1v1v1' && battleMode === 'standard' ? 'bg-empire-gold text-empire-bg' : 'bg-empire-bg-lighter'}`}>1v1v1</span>
                  <span className={`px-2 py-1 rounded ${playerCount === '1v1v1v1' && battleMode === 'standard' ? 'bg-empire-gold text-empire-bg' : 'bg-empire-bg-lighter'}`}>1v1v1v1</span>
                </div>
              </div>

              <div
                onClick={() => { setBattleMode('shared'); setPlayerCount('2') }}
                className={`p-6 rounded-lg border-2 cursor-pointer transition ${
                  battleMode === 'shared' 
                    ? 'bg-empire-bg-lighter border-empire-gold' 
                    : 'bg-empire-bg-light border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-3xl mb-3">👥</div>
                <h3 className="text-lg font-bold mb-2">Shared Battle</h3>
                <div className="flex gap-2 text-sm">
                  <span className={`px-2 py-1 rounded ${playerCount === '2' && battleMode === 'shared' ? 'bg-empire-gold text-empire-bg' : 'bg-empire-bg-lighter'}`}>2</span>
                  <span className={`px-2 py-1 rounded ${playerCount === '3' && battleMode === 'shared' ? 'bg-empire-gold text-empire-bg' : 'bg-empire-bg-lighter'}`}>3</span>
                  <span className={`px-2 py-1 rounded ${playerCount === '4' && battleMode === 'shared' ? 'bg-empire-gold text-empire-bg' : 'bg-empire-bg-lighter'}`}>4</span>
                </div>
              </div>

              <div
                onClick={() => { setBattleMode('team'); setPlayerCount('2v2') }}
                className={`p-6 rounded-lg border-2 cursor-pointer transition ${
                  battleMode === 'team' 
                    ? 'bg-empire-bg-lighter border-empire-gold' 
                    : 'bg-empire-bg-light border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="text-lg font-bold mb-2">Team Battle</h3>
                <div className="flex gap-2 text-sm">
                  <span className={`px-2 py-1 rounded ${playerCount === '2v2' && battleMode === 'team' ? 'bg-empire-gold text-empire-bg' : 'bg-empire-bg-lighter'}`}>2v2</span>
                  <span className="px-2 py-1 rounded bg-empire-bg-lighter opacity-50">🔒</span>
                  <span className="px-2 py-1 rounded bg-empire-bg-lighter opacity-50">😊</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  <span className="text-empire-gold">{selectedCases.length}</span> Cases Selected
                </h3>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Total Value</div>
                  <div className="text-xl font-bold text-empire-gold">💰 {totalValue.toFixed(2)}</div>
                </div>
              </div>

              <div className="bg-empire-bg-light rounded-lg p-8 min-h-48 flex items-center justify-center">
                {selectedCases.length === 0 ? (
                  <button
                    onClick={() => setShowCasesModal(true)}
                    className="flex flex-col items-center gap-3 text-gray-400 hover:text-white transition"
                  >
                    <div className="w-16 h-16 rounded-full bg-empire-bg-lighter flex items-center justify-center text-3xl">
                      +
                    </div>
                    <span className="font-semibold">Add Cases</span>
                  </button>
                ) : (
                  <div className="w-full">
                    <div className="grid grid-cols-6 gap-4 mb-4">
                      {selectedCases.map((caseItem) => (
                        <div key={caseItem.id} className="relative group">
                          <div className="bg-empire-bg-lighter rounded-lg p-3">
                            <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-2 flex items-center justify-center text-2xl">
                              📦
                            </div>
                            <div className="text-xs text-center font-semibold truncate">{caseItem.name}</div>
                            <div className="text-xs text-center text-empire-gold">💰 {caseItem.price}</div>
                          </div>
                          <button
                            onClick={() => handleRemoveCase(caseItem.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full text-white text-sm opacity-0 group-hover:opacity-100 transition"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setShowCasesModal(true)}
                        className="aspect-square bg-empire-bg-lighter rounded-lg flex items-center justify-center text-3xl text-gray-400 hover:text-white hover:bg-empire-bg transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-empire-bg-light rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🏆</span>
                    <span className="font-semibold">Empire Spin</span>
                  </div>
                  <p className="text-xs text-gray-400">Toggle to highlight premium items during case openings.</p>
                </div>
                <button
                  onClick={() => setEmpireSpinEnabled(!empireSpinEnabled)}
                  className={`w-12 h-6 rounded-full transition ${
                    empireSpinEnabled ? 'bg-empire-gold' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    empireSpinEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="bg-empire-bg-light rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">⚡</span>
                    <span className="font-semibold">Fast Mode</span>
                  </div>
                  <p className="text-xs text-gray-400">Speeds up the case battles significantly.</p>
                </div>
                <button
                  onClick={() => setFastModeEnabled(!fastModeEnabled)}
                  className={`w-12 h-6 rounded-full transition ${
                    fastModeEnabled ? 'bg-empire-gold' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    fastModeEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="bg-empire-bg-light rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🔄</span>
                    <span className="font-semibold">Uno Reverse Mode</span>
                  </div>
                  <p className="text-xs text-gray-400">Reverse your luck. Whoever unboxes the lowest total value gets to win it all!</p>
                </div>
                <button
                  onClick={() => setReverseMode(!reverseMode)}
                  className={`w-12 h-6 rounded-full transition ${
                    reverseMode ? 'bg-empire-gold' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    reverseMode ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="bg-empire-bg-light rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🔒</span>
                    <span className="font-semibold">Private Battle</span>
                  </div>
                  <p className="text-xs text-gray-400">Only players with the link are able to join/view</p>
                </div>
                <button
                  onClick={() => setPrivateMode(!privateMode)}
                  className={`w-12 h-6 rounded-full transition ${
                    privateMode ? 'bg-empire-gold' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    privateMode ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <div className="text-right">
                <div className="text-sm text-gray-400">Total Cost</div>
                <div className="text-2xl font-bold text-empire-gold">💰 {totalValue.toFixed(2)}</div>
              </div>
              <button
                onClick={handleCreateBattle}
                disabled={selectedCases.length === 0}
                className="bg-empire-gold text-empire-bg px-8 py-3 rounded-lg font-semibold text-lg hover:bg-empire-gold-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Battle
              </button>
            </div>
          </div>
        </main>
      </div>

      <SelectCasesModal
        isOpen={showCasesModal}
        onClose={() => setShowCasesModal(false)}
        onAddCases={handleAddCases}
      />
      </div>
    </AuthProvider>
  )
}
