/** Deterministic roommate-vibes translator — maps angry → soft chaos */
export function translatePassiveAggressive(input: string): string {
  const raw = input.trim()
  if (!raw) return 'type something chaotic and we polish it ✨'

  const lower = raw.toLowerCase()

  if (/raw\s*chicken|chicken\s*in\s*(the\s*)?sink/.test(lower)) {
    return 'hey besties maybe we revisit kitchen sanitation together'
  }
  if (/trash/.test(lower) && /goblin|animal|monster|disgusting/.test(lower)) {
    return 'friendly reminder that the trash is entering its villain era'
  }
  if (/charger|cable/.test(lower) && /stole|took|missing|where\s*is/.test(lower)) {
    return 'has anyone seen my charger? no pressure, but it is emotionally missed'
  }
  if (/dirty\s*dishes|sink/.test(lower) && !/spoon\s*singular/.test(lower)) {
    return 'the sink is auditioning for a soap commercial — who wants co-star billing?'
  }
  if (/who\s+(left|put)/.test(lower) && /(milk|food|container)/.test(lower)) {
    return 'gentle group quest: relocate perishables to their Forever Home™ (the fridge)'
  }
  if (/noise|loud|music|3\s*am|midnight/.test(lower)) {
    return 'vibes check: volume slider could use a wholesome nudge softer pls 💛'
  }
  if (/mold|bugs|flies|flies!/.test(lower)) {
    return 'biohazard DLC detected — teamwork speedrun when someone has bandwidth?'
  }
  if (/clean|cleaned|kitchen|bathroom/.test(lower) && /!/.test(raw)) {
    return 'love the energy — can we keep the commune sparkle going in tiny daily wins?'
  }

  const softened = raw
    .replace(/\bWHO\b/g, 'friends')
    .replace(/\byou\s+lazy\b/gi, 'my dear lab rats')
    .replace(/\bDISGUSTING\b/i, 'a little unhinged')

  return `kitchen translation bot says: let's try "${softened}" but with roommate-grade kindness 🧈`
}
