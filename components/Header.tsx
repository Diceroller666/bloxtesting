'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import AuthModal from './AuthModal'
import Link from 'next/link'

interface HeaderProps {
  currentPage: string
  setCurrentPage: (page: 'roulette' | 'case-battles') => void
}

export default function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const router = useRouter()
  const { user, logout, refreshUser } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  const handleAuthSuccess = async () => {
    await refreshUser()
  }

  return (
    <>
      <header className="bg-empire-bg-light border-b border-gray-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-empire-gold rounded-full flex items-center justify-center">
                <span className="text-empire-bg font-bold text-sm">BE</span>
              </div>
              <span className="text-xl font-bold">
                BLOX<span className="text-empire-gold">EMPIRE</span>
              </span>
            </div>

            <nav className="flex items-center gap-6">
              <button 
                onClick={() => router.push('/')}
                className={`font-semibold transition ${currentPage === 'roulette' ? 'text-empire-gold' : 'text-gray-400 hover:text-white'}`}
              >
                Roulette
              </button>
              <button 
                onClick={() => router.push('/case-battles')}
                className={`font-semibold transition ${currentPage === 'case-battles' ? 'text-empire-gold' : 'text-gray-400 hover:text-white'}`}
              >
                Case Battles
              </button>
              <button className="text-gray-400 hover:text-white font-semibold transition">
                Match Betting
              </button>
              <button className="text-gray-400 hover:text-white font-semibold transition">
                Marketplace
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 bg-empire-bg-lighter px-4 py-2 rounded">
                  <span className="text-empire-gold">💰</span>
                  <span className="text-sm font-semibold">${user.balance.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 bg-empire-bg-lighter px-4 py-2 rounded">
                  <span className="text-gray-400">👤</span>
                  <span className="text-sm font-semibold">{user.username}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="bg-empire-bg-lighter text-gray-300 px-6 py-2 rounded text-sm hover:bg-empire-bg transition"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setShowRegisterModal(true)}
                  className="bg-empire-gold text-empire-bg px-6 py-2 rounded text-sm font-semibold hover:bg-empire-gold-dark transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <span className="bg-empire-bg-lighter px-2 py-1 rounded">Free Case 📦</span>
          <span className="bg-empire-bg-lighter px-2 py-1 rounded">Fairness</span>
          <span className="bg-empire-bg-lighter px-2 py-1 rounded">Rewards</span>
          <span className="bg-empire-bg-lighter px-2 py-1 rounded">Referrals</span>
          <span className="bg-empire-bg-lighter px-2 py-1 rounded">About</span>
        </div>
      </header>

      <AuthModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        mode="login"
        onSuccess={handleAuthSuccess}
      />

      <AuthModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        mode="register"
        onSuccess={handleAuthSuccess}
      />
    </>
  )
}
