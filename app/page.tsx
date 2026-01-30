'use client'

import { AuthProvider } from '@/lib/AuthContext'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Roulette from '@/components/Roulette'

export default function Home() {
  return (
    <AuthProvider>
      <div className="flex h-screen bg-empire-bg text-white">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header currentPage="roulette" setCurrentPage={() => {}} />
          
          <main className="flex-1 overflow-auto">
            <Roulette />
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
