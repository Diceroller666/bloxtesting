'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '@/lib/AuthContext'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import AuthModal from '@/components/AuthModal'

function CaseBattlesContent() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const [battles, setBattles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    fetchBattles()
  }, [])

  const fetchBattles = async () => {
    try {
      const response = await fetch('/api/battles')
      const data = await response.json()
      setBattles(data.battles || [])
    } catch (error) {
      console.error('Failed to fetch battles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBattleClick = () => {
    if (!user) {
      setShowLoginModal(true)
    } else {
      router.push('/case-battles/create')
    }
  }

  const handleAuthSuccess = async () => {
    await refreshUser()
    setShowLoginModal(false)
    router.push('/case-battles/create')
  }

  return (
    <div className="flex h-screen bg-empire-bg text-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header currentPage="case-battles" setCurrentPage={() => {}} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Case Battles</h1>
            <button
              onClick={handleCreateBattleClick}
              className="bg-empire-gold text-empire-bg px-6 py-3 rounded-lg font-semibold hover:bg-empire-gold-dark transition flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              <span>Create Battle</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading battles...</div>
          ) : battles.length === 0 ? (
            <div className="bg-empire-bg-light rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">⚔️</div>
              <h2 className="text-2xl font-bold mb-2">No Active Battles</h2>
              <p className="text-gray-400 mb-6">Create a battle to get started!</p>
              <button
                onClick={handleCreateBattleClick}
                className="bg-empire-gold text-empire-bg px-8 py-3 rounded-lg font-semibold hover:bg-empire-gold-dark transition"
              >
                Create Your First Battle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {battles.map((battle) => (
                <div
                  key={battle.id}
                  onClick={() => router.push(`/case-battles/${battle.id}`)}
                  className="bg-empire-bg-light rounded-lg p-4 cursor-pointer hover:bg-empire-bg-lighter transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold">
                      {battle.mode === 'standard' ? 'Standard' : battle.mode === 'shared' ? 'Shared' : 'Team'} Battle
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      battle.status === 'waiting' ? 'bg-yellow-600' :
                      battle.status === 'in_progress' ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                      {battle.status === 'waiting' ? 'Waiting' : battle.status === 'in_progress' ? 'In Progress' : 'Finished'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    {battle.players.length}/{battle.maxPlayers} Players
                  </div>
                  <div className="text-empire-gold font-bold">
                    💰 {battle.cases?.length || 0} Cases
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      
      <AuthModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        mode="login"
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}

export default function CaseBattlesPage() {
  return (
    <AuthProvider>
      <CaseBattlesContent />
    </AuthProvider>
  )
}
