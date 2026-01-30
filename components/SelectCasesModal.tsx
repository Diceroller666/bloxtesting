'use client'

import { useState, useEffect } from 'react'

interface CaseItem {
  itemId: string
  dropRate: number
  item?: any
}

interface Case {
  id: string
  name: string
  price: number
  items: CaseItem[]
  description?: string
}

interface SelectCasesModalProps {
  isOpen: boolean
  onClose: () => void
  onAddCases: (cases: Case[]) => void
}

export default function SelectCasesModal({ isOpen, onClose, onAddCases }: SelectCasesModalProps) {
  const [cases, setCases] = useState<Case[]>([])
  const [selectedCases, setSelectedCases] = useState<Case[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchCases()
    }
  }, [isOpen])

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/cases')
      const data = await response.json()
      setCases(data.cases || [])
    } catch (error) {
      console.error('Failed to fetch cases:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCase = (caseItem: Case) => {
    // Always add the case - allow multiple of the same case
    setSelectedCases([...selectedCases, caseItem])
  }

  const handleAddCases = () => {
    onAddCases(selectedCases)
    setSelectedCases([])
    onClose()
  }

  const totalCost = selectedCases.reduce((sum, c) => sum + c.price, 0)

  const filteredCases = cases.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-empire-bg-light rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Select Cases</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">×</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-empire-bg border border-gray-700 rounded-lg px-4 py-3 pl-10 text-white focus:border-empire-gold focus:outline-none"
            />
            <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <select className="w-full bg-empire-bg border border-gray-700 rounded-lg px-4 py-2 text-white">
                <option>Featured</option>
                <option>All Cases</option>
                <option>Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Price Range</label>
              <select className="w-full bg-empire-bg border border-gray-700 rounded-lg px-4 py-2 text-white">
                <option>💰 All</option>
                <option>Under $10</option>
                <option>$10 - $25</option>
                <option>Over $25</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Sort By</label>
              <select className="w-full bg-empire-bg border border-gray-700 rounded-lg px-4 py-2 text-white">
                <option>Highest Price First</option>
                <option>Lowest Price First</option>
                <option>Name A-Z</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 max-h-96 overflow-y-auto pr-2">
            {loading ? (
              <div className="col-span-5 text-center py-12 text-gray-400">Loading cases...</div>
            ) : filteredCases.length === 0 ? (
              <div className="col-span-5 text-center py-12 text-gray-400">No cases found</div>
            ) : (
              filteredCases.map((caseItem) => {
                const selectedCount = selectedCases.filter(c => c.id === caseItem.id).length
                return (
                  <div
                    key={caseItem.id}
                    onClick={() => toggleCase(caseItem)}
                    className={`cursor-pointer rounded-lg p-4 transition relative ${
                      selectedCount > 0
                        ? 'bg-empire-gold bg-opacity-20 border-2 border-empire-gold' 
                        : 'bg-empire-bg-lighter border-2 border-transparent hover:border-gray-600'
                    }`}
                  >
                    {selectedCount > 0 && (
                      <div className="absolute -top-2 -right-2 w-7 h-7 bg-empire-gold rounded-full flex items-center justify-center text-empire-bg font-bold text-sm">
                        {selectedCount}
                      </div>
                    )}
                    <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-3 flex items-center justify-center text-4xl">
                      📦
                    </div>
                    <h3 className="text-sm font-semibold text-center mb-2">{caseItem.name}</h3>
                    <div className="text-center">
                      <span className="text-empire-gold font-bold">💰 {caseItem.price.toFixed(2)}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-800 flex items-center justify-between">
          <div className="text-gray-400">
            <span className="font-semibold text-white">{selectedCases.length}</span> Cases
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Total Cost</div>
              <div className="text-xl font-bold text-empire-gold">💰 {totalCost.toFixed(2)}</div>
            </div>
            <button
              onClick={handleAddCases}
              disabled={selectedCases.length === 0}
              className="bg-empire-gold text-empire-bg px-8 py-3 rounded-lg font-semibold hover:bg-empire-gold-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Cases
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
