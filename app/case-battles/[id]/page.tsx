'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider } from '@/lib/AuthContext'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import BattleLobby from '@/components/BattleLobby'

export default function BattlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)

  const handleBack = () => {
    router.push('/case-battles')
  }

  return (
    <AuthProvider>
      <div className="flex h-screen bg-empire-bg text-white">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header currentPage="case-battles" setCurrentPage={() => {}} />
          
          <main className="flex-1 overflow-auto">
            <BattleLobby battleId={id} onBack={handleBack} />
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
