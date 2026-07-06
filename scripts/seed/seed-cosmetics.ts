import { db } from '../../src/lib/db'

async function main() {
  const frames = [
    { key: 'bronze-frame', name: 'Bronze Frame', rarity: 'COMMON' as const, unlock_value: 5 },
    { key: 'silver-frame', name: 'Silver Frame', rarity: 'RARE' as const, unlock_value: 10 },
    { key: 'gold-frame', name: 'Gold Frame', rarity: 'EPIC' as const, unlock_value: 20 },
    { key: 'platinum-frame', name: 'Platinum Frame', rarity: 'LEGENDARY' as const, unlock_value: 30 },
    { key: 'diamond-frame', name: 'Diamond Frame', rarity: 'LEGENDARY' as const, unlock_value: 40 },
    { key: 'legendary-frame', name: 'Legendary Frame', rarity: 'MYTHIC' as const, unlock_value: 50 },
  ]
  for (const f of frames) {
    await db.cosmetic_item.upsert({
      where: { key: f.key },
      create: { type: 'FRAME' as const, unlock_type: 'LEVEL' as const, ...f },
      update: {},
    })
  }
  console.log('Cosmetic items seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
