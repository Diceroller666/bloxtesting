'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import CreateBattleModal from './CreateBattleModal'
import BattleLobby from './BattleLobby'
import AuthModal from './AuthModal'

export default function CaseBattles() {
  const { user, refreshUser } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [currentBattleId, setCurrentBattleId] = useState<string | null>(null)

  const handleBattleCreated = (battleId: string) => {
    setCurrentBattleId(battleId)
  }

  const handleBackToBattles = () => {
    setCurrentBattleId(null)
  }

  const handleCreateBattleClick = () => {
    if (!user) {
      setShowLoginModal(true)
    } else {
      setShowCreateModal(true)
    }
  }

  const handleAuthSuccess = async () => {
    await refreshUser()
    setShowLoginModal(false)
    setShowCreateModal(true)
  }

  if (currentBattleId) {
    return <BattleLobby battleId={currentBattleId} onBack={handleBackToBattles} />
  }

  return (
    <>
      <div className="p-6">
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

        <div className="grid grid-cols-1 gap-4">
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
        </div>
      </div>

      <CreateBattleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onBattleCreated={handleBattleCreated}
      />

      <AuthModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        mode="login"
        onSuccess={handleAuthSuccess}
      />
    </>
  )
}
