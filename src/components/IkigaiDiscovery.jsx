import { useState } from 'react'
import { IKIGAI_QUADRANTS } from '../lib/schema.js'
import { IKIGAI_COACH, IKIGAI_SYNTHESIS } from '../lib/prompts.js'
import { chat } from '../lib/ai.js'
import { Button } from './ui/Button.jsx'
import { Eyebrow, Tag, Input, Divider } from './ui/Primitives.jsx'
import { AICoach } from './AICoach.jsx'

const MIN_ITEMS_PER_QUADRANT = 3

export function IkigaiDiscovery({ state, update, onComplete }) {
  const [activeQuadrant, setActiveQuadrant] = useState(IKIGAI_QUADRANTS[0].key)
  const [input, setInput] = useState('')
  const [synthesizing, setSynthesizing] = useState(false)
  const [synthError, setSynthError] = useState(null)

  const ikigai = state.ikigai
  const conversation = state.conversations.ikigai

  const allFilled = IKIGAI_QUADRANTS.every(
    (q) => ikigai[q.key].length >= MIN_ITEMS_PER_QUADRANT
  )

  const addItem = (quadrant, value) => {
    const trimmed = value.trim()
    if (!trimmed) return
    update((s) => ({
      ...s,
      ikigai: { ...s.ikigai, [quadrant]: [...s.ikigai[quadrant], trimmed] },
    }))
  }

  const removeItem = (quadrant, index) => {
    update((s) => ({
      ...s,
      ikigai: { ...s.ikigai, [quadrant]: s.ikigai[quadrant].filter((_, i) => i !== index) },
    }))
  }

  const handleAdd = () => {
    addItem(activeQuadrant, input)
    setInput('')
  }

  const updateConversation = (next) => {
    update((s) => ({ ...s, conversations: { ...s.conversations, ikigai: next } }))
  }

  const synthesize = async () => {
    setSynthesizing(true)
    setSynthError(null)
    try {
      const summary = IKIGAI_QUADRANTS.map((q) => {
        const items = ikigai[q.key].map((x) => `- ${x}`).join('\n')
        return `### ${q.label}\n${items}`
      }).join('\n\n')

      const result = await chat(
        [{ role: 'user', content: summary }],
        { system: IKIGAI_SYNTHESIS, maxTokens: 1024 }
      )

      update((s) => ({
        ...s,
        ikigai: { ...s.ikigai, synthesis: result, completedAt: new Date().toISOString() },
      }))
    } catch (err) {
      setSynthError(err.message || 'Failed to synthesize.')
    } finally {
      setSynthesizing(false)
    }
  }

  const activeQ = IKIGAI_QUADRANTS.find((q) => q.key === activeQuadrant)
  const contextHint = `I'm working on the "${activeQ.label}" quadrant of my Ikigai. Help me think through this. ${activeQ.hint}.`

  return (
    <div className="px-6 py-12 stage-enter">
      <div className="max-w-6xl mx-auto">
        <header className="max-w-prose mb-12">
          <Eyebrow>Stage 01</Eyebrow>
          <h2 className="font-display text-5xl tracking-tightest leading-[1] mb-6">
            Discover your Ikigai.
          </h2>
          <p className="text-ink/70 text-lg leading-relaxed">
            Add at least {MIN_ITEMS_PER_QUADRANT} items to each quadrant. Use the AI coach on the
            right to think out loud — it will help you go deeper than your first answer.
          </p>
        </header>

        <Divider className="max-w-[120px] mb-12" />

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left: 4 quadrants */}
          <div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {IKIGAI_QUADRANTS.map((q) => {
                const count = ikigai[q.key].length
                const enough = count >= MIN_ITEMS_PER_QUADRANT
                const isActive = activeQuadrant === q.key
                return (
                  <button
                    key={q.key}
                    onClick={() => setActiveQuadrant(q.key)}
                    className={`text-left p-4 border transition-all ${
                      isActive
                        ? 'border-terracotta bg-terracotta/5'
                        : 'border-rule hover:border-ink/40'
                    }`}
                  >
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-display text-base">{q.label}</span>
                      <span className={`text-xs ${enough ? 'text-terracotta' : 'text-muted'}`}>
                        {count}/{MIN_ITEMS_PER_QUADRANT}+
                      </span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">{q.hint}</p>
                  </button>
                )
              })}
            </div>

            {/* Active quadrant editor */}
            <div className="border border-rule p-6">
              <Eyebrow>{activeQ.label}</Eyebrow>

              <div className="flex gap-3 mb-5">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  placeholder="Add a specific example…"
                  autoFocus
                />
                <Button size="sm" onClick={handleAdd} disabled={!input.trim()}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[60px]">
                {ikigai[activeQuadrant].length === 0 && (
                  <p className="text-sm text-muted italic">No items yet. Add specific moments or examples, not abstractions.</p>
                )}
                {ikigai[activeQuadrant].map((item, i) => (
                  <Tag key={i} onRemove={() => removeItem(activeQuadrant, i)}>
                    {item}
                  </Tag>
                ))}
              </div>
            </div>
          </div>

          {/* Right: AI Coach */}
          <div>
            <Eyebrow>AI Coach — {activeQ.label}</Eyebrow>
            <AICoach
              systemPrompt={IKIGAI_COACH}
              conversation={conversation}
              onConversationChange={updateConversation}
              placeholder="Ask for prompts, share an answer, or think out loud…"
              contextHint={contextHint}
            />
          </div>
        </div>

        {/* Synthesis */}
        <div className="mt-16 max-w-prose">
          <Divider className="mb-10 max-w-[120px]" />

          {ikigai.synthesis ? (
            <div className="border border-rule p-8 bg-cream">
              <Eyebrow>Your Ikigai</Eyebrow>
              <div className="font-display text-xl leading-relaxed text-ink whitespace-pre-wrap">
                {ikigai.synthesis}
              </div>
              <div className="mt-8 flex gap-3">
                <Button onClick={synthesize} variant="ghost" size="sm" disabled={synthesizing}>
                  {synthesizing ? 'Regenerating…' : 'Regenerate'}
                </Button>
                <Button onClick={onComplete}>Continue to Wheel of Life →</Button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-display text-2xl mb-3">Synthesize your Ikigai</h3>
              <p className="text-ink/70 mb-6">
                When all four quadrants have at least {MIN_ITEMS_PER_QUADRANT} items, the AI will
                connect them into a 2-3 paragraph synthesis.
              </p>
              {synthError && (
                <p className="text-sm text-terracotta mb-4 border-l-2 border-terracotta pl-3">
                  {synthError}
                </p>
              )}
              <Button onClick={synthesize} disabled={!allFilled || synthesizing} size="lg">
                {synthesizing ? 'Synthesizing…' : allFilled ? 'Synthesize my Ikigai' : 'Fill all four quadrants first'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
