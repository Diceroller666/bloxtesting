import fs from 'fs'
import path from 'path'

export interface CaseItem {
  itemId: string
  dropRate: number // percentage (0-100)
}

export interface Case {
  id: string
  name: string
  imageUrl?: string
  price: number
  items: CaseItem[]
  description?: string
}

const CASES_DB_PATH = path.join(process.cwd(), 'data', 'cases.json')

function ensureCasesDbExists() {
  const dir = path.dirname(CASES_DB_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(CASES_DB_PATH)) {
    fs.writeFileSync(CASES_DB_PATH, JSON.stringify([]))
  }
}

export function getAllCases(): Case[] {
  ensureCasesDbExists()
  const data = fs.readFileSync(CASES_DB_PATH, 'utf-8')
  return JSON.parse(data)
}

export function saveCases(cases: Case[]) {
  ensureCasesDbExists()
  fs.writeFileSync(CASES_DB_PATH, JSON.stringify(cases, null, 2))
}

export function getCaseById(id: string): Case | undefined {
  const cases = getAllCases()
  return cases.find(c => c.id === id)
}

export function addCase(caseData: Omit<Case, 'id'>): Case {
  const cases = getAllCases()
  const newCase: Case = {
    ...caseData,
    id: `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  cases.push(newCase)
  saveCases(cases)
  return newCase
}

export function updateCase(id: string, updates: Partial<Omit<Case, 'id'>>): Case | null {
  const cases = getAllCases()
  const caseIndex = cases.findIndex(c => c.id === id)
  
  if (caseIndex === -1) return null
  
  cases[caseIndex] = { ...cases[caseIndex], ...updates }
  saveCases(cases)
  return cases[caseIndex]
}

export function deleteCase(id: string): boolean {
  const cases = getAllCases()
  const filteredCases = cases.filter(c => c.id !== id)
  
  if (filteredCases.length === cases.length) return false
  
  saveCases(filteredCases)
  return true
}
