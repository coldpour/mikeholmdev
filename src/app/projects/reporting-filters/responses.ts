export type ResponseMode = 'realistic' | 'fast' | 'slow' | 'failure'

// Choose again for every attempt, including retries. A retry can fail too.
export function planResponse(mode: ResponseMode, random = Math.random) {
  if (mode === 'fast') return { delay: 180, fail: false }
  if (mode === 'slow') return { delay: 2800, fail: false }
  if (mode === 'failure') return { delay: 450, fail: true }

  const outcome = random()
  const variation = random()
  if (outcome < 0.55) return { delay: 100 + Math.round(variation * 350), fail: false }
  if (outcome < 0.8) return { delay: 2400 + Math.round(variation * 1800), fail: false }
  return { delay: 400 + Math.round(variation * 800), fail: true }
}
