import { STORAGE_KEY, createDefaultState, isValidState } from './schema.js'

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!isValidState(parsed)) {
      console.warn('[storage] Invalid state shape, resetting.')
      return null
    }
    return parsed
  } catch (err) {
    console.error('[storage] Failed to load state:', err)
    return null
  }
}

export function saveState(state) {
  try {
    const next = { ...state, updatedAt: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return true
  } catch (err) {
    console.error('[storage] Failed to save:', err)
    return false
  }
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY)
  return createDefaultState()
}

export function exportJSON(state) {
  return JSON.stringify(state, null, 2)
}

export function importJSON(jsonStr) {
  const parsed = JSON.parse(jsonStr)
  if (!isValidState(parsed)) throw new Error('Invalid state file')
  saveState(parsed)
  return parsed
}

export function exportMarkdown(state) {
  const { ikigai, wheelOfLife, okrs } = state
  const lines = []

  lines.push('# My LifeQuest Journey')
  lines.push('')
  lines.push(`_Generated ${new Date().toLocaleDateString()}_`)
  lines.push('')

  // Ikigai
  lines.push('## Ikigai')
  lines.push('')
  if (ikigai.synthesis) {
    lines.push('### Synthesis')
    lines.push('')
    lines.push(ikigai.synthesis)
    lines.push('')
  }
  lines.push('### What I love')
  ikigai.love.forEach((item) => lines.push(`- ${item}`))
  lines.push('')
  lines.push('### What I am good at')
  ikigai.goodAt.forEach((item) => lines.push(`- ${item}`))
  lines.push('')
  lines.push('### What the world needs')
  ikigai.worldNeeds.forEach((item) => lines.push(`- ${item}`))
  lines.push('')
  lines.push('### What I can be paid for')
  ikigai.paidFor.forEach((item) => lines.push(`- ${item}`))
  lines.push('')

  // Wheel of Life
  lines.push('## Wheel of Life')
  lines.push('')
  lines.push('| Area | Score |')
  lines.push('|------|-------|')
  Object.entries(wheelOfLife.scores).forEach(([k, v]) => {
    lines.push(`| ${k} | ${v}/10 |`)
  })
  lines.push('')
  if (wheelOfLife.insights) {
    lines.push('### Insights')
    lines.push('')
    lines.push(wheelOfLife.insights)
    lines.push('')
  }

  // OKRs
  if (okrs.length > 0) {
    lines.push('## OKRs')
    lines.push('')
    okrs.forEach((okr, i) => {
      lines.push(`### ${i + 1}. ${okr.objective}`)
      lines.push(`_Timeframe: ${okr.timeframe}_`)
      lines.push('')
      okr.keyResults.forEach((kr) => {
        const progress = kr.target ? Math.round((kr.current / kr.target) * 100) : 0
        lines.push(`- ${kr.text} — ${kr.current}/${kr.target} ${kr.unit || ''} (${progress}%)`)
      })
      lines.push('')
    })
  }

  return lines.join('\n')
}

export function downloadFile(filename, content, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
