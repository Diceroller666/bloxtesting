import { Case, saveCases } from './cases-db'

// Test cases with items from the database
const cases: Omit<Case, 'id'>[] = [
  {
    name: 'Majesty',
    price: 25.00,
    description: 'Premium case with legendary knives and weapons',
    items: [
      { itemId: 'item_seed_31_karambit_aurora', dropRate: 2 },        // Karambit Aurora $520
      { itemId: 'item_seed_33_karambit_midnight', dropRate: 3 },      // Karambit Midnight $480
      { itemId: 'item_seed_36_flip_knife_fade', dropRate: 5 },        // Flip Knife Fade $420
      { itemId: 'item_seed_17_awp_typhon', dropRate: 8 },             // AWP Typhon $125
      { itemId: 'item_seed_21_aug_hot_rod', dropRate: 10 },           // AUG Hot Rod $95
      { itemId: 'item_seed_16_ak-47_sakura', dropRate: 12 },          // AK-47 Sakura $68
      { itemId: 'item_seed_19_glock-18_fade', dropRate: 15 },         // Glock-18 Fade $58
      { itemId: 'item_seed_11_aug_overgrowth', dropRate: 20 },        // AUG Overgrowth $55
      { itemId: 'item_seed_22_p90_big_cat', dropRate: 25 },           // P90 Big Cat $52
    ]
  },
  {
    name: 'Bishop',
    price: 15.00,
    description: 'Mid-tier case with epic weapons and knives',
    items: [
      { itemId: 'item_seed_47_gut_knife_aurora', dropRate: 5 },       // Gut Knife Aurora $250
      { itemId: 'item_seed_51_gut_knife_fade', dropRate: 8 },         // Gut Knife Fade $240
      { itemId: 'item_seed_49_gut_knife_midnight', dropRate: 10 },    // Gut Knife Midnight $230
      { itemId: 'item_seed_2_m4a4_b-hop', dropRate: 12 },             // M4A4 B-Hop $52
      { itemId: 'item_seed_11_negev_noctiflora', dropRate: 15 },      // Negev Noctiflora $48
      { itemId: 'item_seed_1_m4a1-s_orchids', dropRate: 18 },         // M4A1-S Orchids $45
      { itemId: 'item_seed_28_galil_irradiated', dropRate: 20 },      // GALIL Irradiated $45
      { itemId: 'item_seed_8_ssg-08_labyrinth', dropRate: 12 },       // SSG-08 Labyrinth $42
    ]
  },
  {
    name: 'Stronghold',
    price: 8.00,
    description: 'Budget-friendly case with rare weapons',
    items: [
      { itemId: 'item_seed_50_gut_knife_vanilla', dropRate: 3 },      // Gut Knife Vanilla $170
      { itemId: 'item_seed_46_gut_knife_noir', dropRate: 5 },         // Gut Knife Noir $180
      { itemId: 'item_seed_25_ssg-08_desert_strike', dropRate: 10 },  // SSG-08 Desert Strike $38
      { itemId: 'item_seed_18_deagle_marcy', dropRate: 15 },          // Deagle Marcy $35
      { itemId: 'item_seed_15_m4a1-s_retro', dropRate: 18 },          // M4A1-S Retro $32
      { itemId: 'item_seed_7_dual_berettas_vernal', dropRate: 20 },   // Dual Berettas Vernal $28
      { itemId: 'item_seed_20_xm1014_abstract', dropRate: 15 },       // XM1014 Abstract $28
      { itemId: 'item_seed_10_tec-9_monarch', dropRate: 14 },         // Tec-9 Monarch $25
    ]
  }
]

export function seedCasesDatabase() {
  const casesWithIds = cases.map((caseData, index) => ({
    ...caseData,
    id: `case_seed_${index + 1}_${caseData.name.toLowerCase().replace(/\s+/g, '_')}`
  }))
  
  saveCases(casesWithIds)
  console.log(`✅ Seeded ${casesWithIds.length} cases to database`)
  return casesWithIds
}

if (require.main === module) {
  seedCasesDatabase()
}
