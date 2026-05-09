import { useState } from 'react'
import { OKR_GENERATOR } from '../lib/prompts.js'
import { chat } from '../lib/ai.js'
import { Button } from './ui/Button.jsx'
import { Eyebrow, Divider, Input, Label } from './ui/Primitives.jsx'

export function OKRBuilder({ state, update, onComplete }) {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)

  const okrs = state.okrs

  const generateOKRs = async () => {
    setGenerating(true)
    setError(null)
    try {
      const wheelSummary = Object.entries(state.wheelOfLife.scores)
        .map(([k, v]) => `${k}: ${v}/10`)
        .join(', ')

      const prompt = `
Ikigai synthesis:
${state.ikigai.synthesis || '(not provided)'}

Wheel of Life scores: ${wheelSummary}

Wheel of Life insights:
${state.wheelOfLife.insights || '(not provided)'}

Generate 2-4 OKRs based on this. Return ONLY a JSON array.
`.trim()

      const result = await chat(
        [{ role: 'user', content: prompt }],
        { system: OKR_GENERATOR, maxTokens: 2048 }
      )

      // Strip any markdown fences if present
      const cleaned = result.replace(/```json\n?|```\n?/g, '').trim()
      const parsed = JSON.parse(cleaned)
      if (!Array.isArray(parsed)) throw new Error('AI did not return an array')

      const withIds = parsed.map((o, i) => ({
        id: `okr_${Date.now()}_${i}`,
        objective: o.objective || '',
        keyResults: (o.keyResults || []).map((kr, j) => ({
          id: `kr_${Date.now()}_${i}_${j}`,
          text: kr.text || '',
          target: Number(kr.target) || 0,
          current: Number(kr.current) || 0,
          unit: kr.unit || '',
        })),
        timeframe: o.timeframe || 'Q1 2027',
        linkedTo: o.linkedTo || [],
        createdAt: new Date().toISOString(),
      }))

      update((s) => ({ ...s, okrs: [...s.okrs, ...withIds] }))
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to generate OKRs.')
    } finally {
      setGenerating(false)
    }
  }

  const updateOKR = (id, patch) => {
    update((s) => ({
      ...s,
      okrs: s.okrs.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }))
  }

  const updateKR = (okrId, krId, patch) => {
    update((s) => ({
      ...s,
      okrs: s.okrs.map((o) =>
        o.id === okrId
          ? { ...o, keyResults: o.keyResults.map((kr) => (kr.id === krId ? { ...kr, ...patch } : kr)) }
          : o
      ),
    }))
  }

  const addEmptyOKR = () => {
    update((s) => ({
      ...s,
      okrs: [
        ...s.okrs,
        {
          id: `okr_${Date.now()}`,
          objective: '',
          keyResults: [],
          timeframe: 'Q1 2027',
          linkedTo: [],
          createdAt: new Date().toISOString(),
        },
      ],
    }))
  }

  const addKR = (okrId) => {
    update((s) => ({
      ...s,
      okrs: s.okrs.map((o) =>
        o.id === okrId
          ? {
              ...o,
              keyResults: [
                ...o.keyResults,
                { id: `kr_${Date.now()}`, text: '', target: 0, current: 0, unit: '' },
              ],
            }
          : o
      ),
    }))
  }

  const removeOKR = (id) => {
    if (!confirm('Delete this OKR?')) return
    update((s) => ({ ...s, okrs: s.okrs.filter((o) => o.id !== id) }))
  }

  const removeKR = (okrId, krId) => {
    update((s) => ({
      ...s,
      okrs: s.okrs.map((o) =>
        o.id === okrId ? { ...o, keyResults: o.keyResults.filter((kr) => kr.id !== krId) } : o
      ),
    }))
  }

  return (
    <div className="px-6 py-12 stage-enter">
      <div className="max-w-5xl mx-auto">
        <header className="max-w-prose mb-12">
          <Eyebrow>Stage 03</Eyebrow>
          <h2 className="font-display text-5xl tracking-tightest leading-[1] mb-6">
            Build your OKRs.
          </h2>
          <p className="text-ink/70 text-lg leading-relaxed">
            Translate insight into action. Each Objective is an aspiration; each Key Result is a
            measurable outcome with a target. Edit, add, or remove freely.
          </p>
        </header>

        <Divider className="max-w-[120px] mb-12" />

        {okrs.length === 0 && (
          <div className="text-center py-16 border border-rule mb-8">
            <p className="text-ink/70 mb-6 max-w-md mx-auto">
              Start with AI-generated OKRs based on your Ikigai and Wheel of Life, or create one
              from scratch.
            </p>
            {error && (
              <p className="text-sm text-terracotta mb-4 border-l-2 border-terracotta pl-3 max-w-md mx-auto text-left">
                {error}
              </p>
            )}
            <div className="flex gap-3 justify-center flex-wrap">
              <Button onClick={generateOKRs} disabled={generating} size="lg">
                {generating ? 'Generating…' : 'Generate with AI'}
              </Button>
              <Button onClick={addEmptyOKR} variant="ghost" size="lg">
                Start blank
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {okrs.map((okr, i) => (
            <OKRCard
              key={okr.id}
              okr={okr}
              index={i}
              onUpdate={(patch) => updateOKR(okr.id, patch)}
              onUpdateKR={(krId, patch) => updateKR(okr.id, krId, patch)}
              onAddKR={() => addKR(okr.id)}
              onRemoveKR={(krId) => removeKR(okr.id, krId)}
              onRemove={() => removeOKR(okr.id)}
            />
          ))}
        </div>

        {okrs.length > 0 && (
          <div className="mt-10 flex gap-3 flex-wrap">
            <Button onClick={addEmptyOKR} variant="ghost">
              + Add another OKR
            </Button>
            <Button onClick={generateOKRs} variant="ghost" disabled={generating}>
              {generating ? 'Generating…' : '+ Generate more with AI'}
            </Button>
            <div className="flex-1" />
            <Button onClick={onComplete} size="lg">
              Continue to Dashboard →
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function OKRCard({ okr, index, onUpdate, onUpdateKR, onAddKR, onRemoveKR, onRemove }) {
  return (
    <div className="border border-rule p-6 md:p-8 bg-cream">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <Eyebrow>Objective {String(index + 1).padStart(2, '0')}</Eyebrow>
          <Input
            value={okr.objective}
            onChange={(e) => onUpdate({ objective: e.target.value })}
            placeholder="Write your objective…"
            className="font-display text-2xl"
          />
        </div>
        <button
          onClick={onRemove}
          className="text-muted hover:text-terracotta text-sm whitespace-nowrap"
        >
          Remove
        </button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <Label className="!mb-0">Timeframe</Label>
        <Input
          value={okr.timeframe}
          onChange={(e) => onUpdate({ timeframe: e.target.value })}
          className="!w-auto max-w-[160px] text-sm"
        />
        {okr.linkedTo && okr.linkedTo.length > 0 && (
          <span className="text-xs text-muted ml-auto">
            Linked to: {okr.linkedTo.join(', ')}
          </span>
        )}
      </div>

      <div className="space-y-4 border-t border-rule pt-6">
        <Label>Key Results</Label>
        {okr.keyResults.length === 0 && (
          <p className="text-sm text-muted italic">No key results yet.</p>
        )}
        {okr.keyResults.map((kr) => {
          const progress = kr.target > 0 ? Math.min(100, (kr.current / kr.target) * 100) : 0
          return (
            <div key={kr.id} className="grid grid-cols-1 md:grid-cols-[1fr_80px_80px_80px_auto] gap-3 items-center">
              <Input
                value={kr.text}
                onChange={(e) => onUpdateKR(kr.id, { text: e.target.value })}
                placeholder="Key result text"
              />
              <Input
                type="number"
                value={kr.current}
                onChange={(e) => onUpdateKR(kr.id, { current: Number(e.target.value) })}
                placeholder="Current"
              />
              <Input
                type="number"
                value={kr.target}
                onChange={(e) => onUpdateKR(kr.id, { target: Number(e.target.value) })}
                placeholder="Target"
              />
              <Input
                value={kr.unit}
                onChange={(e) => onUpdateKR(kr.id, { unit: e.target.value })}
                placeholder="Unit"
              />
              <button
                onClick={() => onRemoveKR(kr.id)}
                className="text-muted hover:text-terracotta text-lg leading-none px-2"
                aria-label="Remove KR"
              >
                ×
              </button>
              <div className="md:col-span-5 -mt-1">
                <div className="h-1 bg-rule">
                  <div
                    className="h-1 bg-terracotta transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
        <Button onClick={onAddKR} size="sm" variant="ghost">
          + Add key result
        </Button>
      </div>
    </div>
  )
}
