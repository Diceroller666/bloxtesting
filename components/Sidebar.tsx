'use client'

import { useState } from 'react'

interface ChatMessage {
  id: number
  username: string
  level: number
  message: string
  avatar: string
}

export default function Sidebar() {
  const [isVisible, setIsVisible] = useState(true)
  const [messages] = useState<ChatMessage[]>([
    { id: 1, username: 'Tuff palte', level: 48, message: 'EPSTEIN WHERE HAVE YOU BEEEEEEEEEEEEEEEEEEEEEEEEEE', avatar: '👤' },
    { id: 2, username: 'Utata', level: 56, message: 'kkkkkkkkkkkk', avatar: '👤' },
    { id: 3, username: 'José Mourinho', level: 46, message: 'The messiddd', avatar: '👤' },
    { id: 4, username: 'Drvar', level: 23, message: 'ufuuuu one mirro', avatar: '👤' },
    { id: 5, username: 'Drvar', level: 23, message: 'mrrr', avatar: '👤' },
    { id: 6, username: 'threefive', level: 74, message: 'died?', avatar: '👤' },
    { id: 7, username: 'Lineee', level: 51, message: 'one more?', avatar: '👤' },
    { id: 8, username: 'Drvar', level: 23, message: 'this is kt', avatar: '👤' },
    { id: 9, username: 'Bobby mavrick', level: 41, message: 'uno 1V1V1', avatar: '👤' },
    { id: 10, username: 'José Mourinho', level: 46, message: 'Pvnt better', avatar: '👤' },
  ])

  return (
    <aside className={`bg-empire-bg-light border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out relative ${
      isVisible ? 'w-80' : 'w-12'
    }`}>
      {/* Hide/Show Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="absolute -right-3 top-4 z-10 w-6 h-6 bg-empire-gold rounded-full flex items-center justify-center text-empire-bg hover:bg-empire-gold-dark transition shadow-lg"
        title={isVisible ? 'Hide Chat' : 'Show Chat'}
      >
        <span className="text-xs font-bold">{isVisible ? '←' : '→'}</span>
      </button>

      <div className={`p-4 border-b border-gray-800 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold">English</span>
          <span className="text-xs text-gray-400">▼</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-500">●</span>
          <span className="text-empire-gold font-semibold">809</span>
          <span className="text-gray-400">/ 1,370</span>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto scrollbar-hide p-3 space-y-3 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-2 text-sm">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-empire-bg-lighter rounded-full flex items-center justify-center text-xs">
                {msg.avatar}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-400">🏆 {msg.level}</span>
                <span className="text-xs font-semibold text-white truncate">{msg.username}</span>
              </div>
              <p className="text-xs text-gray-300 break-words">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`p-3 border-t border-gray-800 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type Message..."
            className="flex-1 bg-empire-bg-lighter text-sm px-3 py-2 rounded border border-gray-700 focus:border-empire-gold focus:outline-none text-white placeholder-gray-500"
          />
          <button className="text-gray-400 hover:text-white">
            <span className="text-lg">⋮</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
