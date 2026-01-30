'use client'

import { useState, useEffect } from 'react'

interface Bet {
  username: string
  amount: number
  multiplier: string
  color: 'red' | 'black' | 'green'
  level: number
}

interface RouletteItem {
  color: 'red' | 'black' | 'green'
  icon: string
}

export default function Roulette() {
  const [selectedAmount, setSelectedAmount] = useState(0.01)
  const [spinning, setSpinning] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [isBreak, setIsBreak] = useState(false)

  const rouletteItems: RouletteItem[] = [
    { color: 'red', icon: '🔥' },
    { color: 'black', icon: '⚔️' },
    { color: 'red', icon: '🔥' },
    { color: 'black', icon: '⚔️' },
    { color: 'red', icon: '🔥' },
    { color: 'black', icon: '⚔️' },
    { color: 'red', icon: '🔥' },
    { color: 'green', icon: '🎲' },
    { color: 'red', icon: '🔥' },
    { color: 'black', icon: '⚔️' },
    { color: 'red', icon: '🔥' },
    { color: 'black', icon: '⚔️' },
    { color: 'red', icon: '🔥' },
    { color: 'black', icon: '⚔️' },
  ]

  const handleSpin = () => {
    setSpinning(true)
    const itemWidth = 88
    const totalItems = rouletteItems.length
    const setWidth = totalItems * itemWidth
    
    const scrollDistance = setWidth * 2 + Math.random() * setWidth
    const newPosition = scrollPosition - scrollDistance
    
    const resetThreshold = -setWidth * 3
    setScrollPosition(newPosition > resetThreshold ? newPosition : newPosition + setWidth * 2)
    
    setTimeout(() => {
      setSpinning(false)
    }, 4000)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!isBreak) {
            handleSpin()
            setIsBreak(true)
            return 10
          } else {
            setIsBreak(false)
            return 15
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isBreak, scrollPosition])

  const previousRolls = [
    { color: 'red' as const, icon: '🔥' },
    { color: 'red' as const, icon: '🔥' },
    { color: 'black' as const, icon: '⚔️' },
    { color: 'black' as const, icon: '⚔️' },
    { color: 'red' as const, icon: '🔥' },
    { color: 'green' as const, icon: '🎲' },
    { color: 'black' as const, icon: '⚔️' },
    { color: 'red' as const, icon: '🔥' },
    { color: 'black' as const, icon: '⚔️' },
  ]

  const redBets: Bet[] = [
    { username: 'Lil-Cease', amount: 130.00, multiplier: '+130.00', color: 'red', level: 78 },
    { username: 'ILikID1ST', amount: 0, multiplier: '+0.53', color: 'red', level: 52 },
    { username: 'Johny R-d', amount: 0, multiplier: '+30.00', color: 'red', level: 75 },
    { username: 'B-JZERA', amount: 0, multiplier: '+13.00', color: 'red', level: 82 },
    { username: 'Siesta-even', amount: 0, multiplier: '+7.42', color: 'red', level: 95 },
    { username: 'magor', amount: 0, multiplier: '+0.02', color: 'red', level: 31 },
  ]

  const blackBets: Bet[] = [
    { username: 'Ishadong', amount: 0, multiplier: '-0.01', color: 'black', level: 61 },
    { username: 'WHITE', amount: 0, multiplier: '+0.53', color: 'black', level: 88 },
    { username: 'alexifoops2', amount: 0, multiplier: '-40.00', color: 'black', level: 21 },
    { username: 'LevelPride', amount: 0, multiplier: '-20.00', color: 'black', level: 19 },
    { username: 'DajinGomi', amount: 0, multiplier: '-25.62', color: 'black', level: 37 },
  ]

  const greenBets: Bet[] = [
    { username: 'KunmiUtan', amount: 0, multiplier: '-100.00', color: 'green', level: 43 },
    { username: 'Urvi_Dombrage', amount: 0, multiplier: '-50.00', color: 'green', level: 66 },
    { username: 'Jash-Ryan', amount: 0, multiplier: '-14.00', color: 'green', level: 61 },
    { username: 'B-JZERA', amount: 0, multiplier: '-0.50', color: 'green', level: 45 },
    { username: 'Kelo', amount: 0, multiplier: '-2.50', color: 'green', level: 24 },
  ]

  const betAmounts = [0.01, 0.61, 1, 10, 100, 0.5, 2]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="bg-empire-bg-light rounded-lg p-6 mb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">PREVIOUS ROLLS</span>
              {previousRolls.map((roll, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    roll.color === 'red' ? 'bg-red-600' : roll.color === 'green' ? 'bg-green-600' : 'bg-gray-700'
                  }`}
                >
                  {roll.icon}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-empire-gold">{timeLeft}s</div>
                <div className="text-xs text-gray-400">{isBreak ? 'BREAK TIME' : 'ROLLING IN'}</div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">LAST 100</span>
                <span className="text-red-500">🔥 42</span>
                <span className="text-green-500">🎲 3</span>
                <span className="text-gray-400">⚔️ 55</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg mb-6" style={{ height: '120px' }}>
            <div className="absolute top-0 left-1/2 w-1 h-full bg-empire-gold z-10 transform -translate-x-1/2"></div>
            <div 
              className="flex gap-2 absolute left-1/2 top-1/2 -translate-y-1/2 transition-transform duration-[4000ms] ease-out"
              style={{ 
                transform: `translateX(calc(-50% + ${scrollPosition}px)) translateY(-50%)`
              }}
            >
              {[...rouletteItems, ...rouletteItems, ...rouletteItems, ...rouletteItems, ...rouletteItems, ...rouletteItems, ...rouletteItems, ...rouletteItems].map((item, i) => (
                <div
                  key={i}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg flex items-center justify-center text-3xl ${
                    item.color === 'red' ? 'bg-red-600' : item.color === 'green' ? 'bg-green-600' : 'bg-gray-700'
                  }`}
                >
                  {item.icon}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-empire-gold">💰</span>
            <span className="text-sm">Enter bet amount...</span>
            <div className="flex gap-2">
              {betAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`px-3 py-1 rounded text-xs ${
                    selectedAmount === amount
                      ? 'bg-empire-gold text-empire-bg'
                      : 'bg-empire-bg-lighter text-gray-300 hover:bg-empire-bg'
                  }`}
                >
                  {amount < 1 ? `+${amount}` : amount}
                </button>
              ))}
              <button className="px-3 py-1 rounded text-xs bg-empire-bg-lighter text-gray-300">MAX</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-empire-bg-light rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">🔥</div>
                <span className="font-semibold">PLACE BET</span>
                <span className="text-red-400 text-sm">WIN 2x</span>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-empire-gold">💰 {redBets.length} Bets Total</span>
                <span className="text-empire-gold">💰 +260.50</span>
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {redBets.map((bet, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-empire-bg p-2 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">🏆 {bet.level}</span>
                    <span className="text-white">{bet.username}</span>
                  </div>
                  <span className={bet.multiplier.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                    {bet.multiplier}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-empire-bg-light rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">⚔️</div>
                <span className="font-semibold">PLACE BET</span>
                <span className="text-gray-400 text-sm">WIN 2x</span>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-empire-gold">💰 {blackBets.length} Bets Total</span>
                <span className="text-red-500">💰 -350.40</span>
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {blackBets.map((bet, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-empire-bg p-2 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">🏆 {bet.level}</span>
                    <span className="text-white">{bet.username}</span>
                  </div>
                  <span className={bet.multiplier.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                    {bet.multiplier}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-empire-bg-light rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">🎲</div>
                <span className="font-semibold">PLACE BET</span>
                <span className="text-green-400 text-sm">WIN 14x</span>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-empire-gold">💰 {greenBets.length} Bets Total</span>
                <span className="text-red-500">💰 -178.51</span>
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {greenBets.map((bet, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-empire-bg p-2 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">🏆 {bet.level}</span>
                    <span className="text-white">{bet.username}</span>
                  </div>
                  <span className={bet.multiplier.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                    {bet.multiplier}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
