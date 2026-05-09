import { useState } from 'react'
import { WHEEL_AREAS } from '../lib/schema.js'
import { WHEEL_REFLECTION } from '../lib/prompts.js'
import { chat } from '../lib/ai.js'
import { Button } from './ui/Button.jsx'
import { Eyebrow, Divider, Textarea } from './ui/Primitives.jsx'

export function WheelOfLife({ state, update, onComplete }) {
  const wheel = state.wheelOfLife
  const [activeArea, setActiveArea] = useState(WHEEL_AREAS[0].key)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)

  const setScore = (key, value) => {
    update((s) => ({
      ...s,
      wheelOfLife: {
        ...s.wheelOfLife,
        scores: { ...s.wheelOfLife.scores, [key]: Number(value) },
      },
    }))
  }

  const setReflection = (key, value) => {
    update((s) => ({
      ...s,
      wheelOfLife: {
        ...s.wheelOfLife,
        reflections: { ...s.wheelOfLife.reflections, [key]: value },
      },
    }))
  }

  const generateInsights = async () => {
    setGenerating(true)
    setError(null)
    try {
      const summary = WHEEL_AREAS.map((a) => {
        const score = wheel.scores[a.key]
        const reflection = wheel.reflections[a.key] || '(no reflection)'
        return `${a.label}: ${score}/10 — ${reflection}`
      }).join('\n')

      const ikigaiContext = state.ikigai.synthesis
        ? `\n\nUser's Ikigai synthesis (for context):\n${state.ikigai.synthesis}`
        : ''

      const result = await chat(
        [{ role: 'user', content: `${summary}${ikigaiContext}` }],
        { system: WHEEL_REFLECTION, maxTokens: 1024 }
      )

      update((s) => ({
        ...s,
        wheelOfLife: {
          ...s.wheelOfLife,
          insights: result,
          completedAt: new Date().toISOString(),
        },
      }))
    } catch (err) {
      setError(err.message || 'Failed to generate insights.')
    } finally {
      setGenerating(false)
    }
  }

  const activeA = WHEEL_AREAS.find((a) => a.key === activeArea)

  return (
    <div className="px-6 py-12 stage-enter">
      <div className="max-w-6xl mx-auto">
        <header className="max-w-prose mb-12">
          <Eyebrow>Stage 02</Eyebrow>
          <h2 className="font-display text-5xl tracking-tightest leading-[1] mb-6">
            Map your Wheel of Life.
          </h2>
          <p className="text-ink/70 text-lg leading-relaxed">
            Rate each area honestly from 1 (very dissatisfied) to 10 (deeply fulfilled). Add a brief
            note where you have one — patterns emerge from specifics, not scores alone.
          </p>
        </header>

        <Divider className="max-w-[120px] mb-12" />

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          {/* SVG wheel */}
          <div className="order-2 lg:order-1">
            <WheelChart scores={wheel.scores} activeKey={activeArea} onSelect={setActiveArea} />
          </div>

          {/* Sliders + reflection */}
          <div className="order-1 lg:order-2 space-y-6">
            {WHEEL_AREAS.map((area) => {
              const score = wheel.scores[area.key]
              const isActive = activeArea === area.key
              return (
                <div
                  key={area.key}
                  onClick={() => setActiveArea(area.key)}
                  className={`p-4 border transition-all cursor-pointer ${
                    isActive ? 'border-terracotta bg-terracotta/5' : 'border-rule hover:border-ink/40'
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <div>
                      <span className="font-display text-lg">{area.label}</span>
                      <span className="ml-2 text-xs text-muted">{area.hint}</span>
                    </div>
                    <span className="font-display text-2xl text-terracotta">{score}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={score}
                    onChange={(e) => setScore(area.key, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full"
                  />
                  {isActive && (
                    <div className="mt-4">
                      <Textarea
                        value={wheel.reflections[area.key] || ''}
                        onChange={(e) => setReflection(area.key, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder={`Why a ${score} for ${area.label}? Be specific.`}
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Insights */}
        <div className="mt-16 max-w-prose">
          <Divider className="mb-10 max-w-[120px]" />

          {wheel.insights ? (
            <div className="border border-rule p-8 bg-cream">
              <Eyebrow>Insights</Eyebrow>
              <div className="font-display text-xl leading-relaxed text-ink whitespace-pre-wrap">
                {wheel.insights}
              </div>
              <div className="mt-8 flex gap-3">
                <Button onClick={generateInsights} variant="ghost" size="sm" disabled={generating}>
                  {generating ? 'Regenerating…' : 'Regenerate'}
                </Button>
                <Button onClick={onComplete}>Continue to OKRs →</Button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-display text-2xl mb-3">Generate insights</h3>
              <p className="text-ink/70 mb-6">
                The AI will identify patterns, trade-offs, and one area to focus on first.
              </p>
              {error && (
                <p className="text-sm text-terracotta mb-4 border-l-2 border-terracotta pl-3">
                  {error}
                </p>
              )}
              <Button onClick={generateInsights} disabled={generating} size="lg">
                {generating ? 'Analyzing your wheel…' : 'Generate insights'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function WheelChart({ scores, activeKey, onSelect }) {
  const size = 480
  const cx = size / 2
  const cy = size / 2
  const outerR = 200
  const innerR = 30
  const segments = WHEEL_AREAS.length
  const anglePerSeg = (2 * Math.PI) / segments

  const polarToCartesian = (r, angle) => ({
    x: cx + r * Math.cos(angle - Math.PI / 2),
    y: cy + r * Math.sin(angle - Math.PI / 2),
  })

  const segmentPath = (i, scoreR) => {
    const startAngle = i * anglePerSeg
    const endAngle = (i + 1) * anglePerSeg
    const p1 = polarToCartesian(innerR, startAngle)
    const p2 = polarToCartesian(scoreR, startAngle)
    const p3 = polarToCartesian(scoreR, endAngle)
    const p4 = polarToCartesian(innerR, endAngle)
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${scoreR} ${scoreR} 0 0 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${innerR} ${innerR} 0 0 0 ${p1.x} ${p1.y} Z`
  }

  return (
    <div className="aspect-square w-full max-w-[480px] mx-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        {/* Concentric guide circles */}
        {[2, 4, 6, 8, 10].map((s) => {
          const r = innerR + ((outerR - innerR) * s) / 10
          return (
            <circle
              key={s}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="#E8E1D5"
              strokeWidth="1"
            />
          )
        })}

        {/* Segments */}
        {WHEEL_AREAS.map((area, i) => {
          const score = scores[area.key]
          const scoreR = innerR + ((outerR - innerR) * score) / 10
          const isActive = activeKey === area.key
          return (
            <path
              key={area.key}
              d={segmentPath(i, scoreR)}
              fill={isActive ? '#C2410C' : '#0F2A3F'}
              fillOpacity={isActive ? 0.85 : 0.65}
              stroke="#FAF7F2"
              strokeWidth="2"
              style={{ transition: 'all 0.4s ease', cursor: 'pointer' }}
              onClick={() => onSelect(area.key)}
            />
          )
        })}

        {/* Spokes */}
        {WHEEL_AREAS.map((_, i) => {
          const angle = i * anglePerSeg
          const inner = polarToCartesian(innerR, angle)
          const outer = polarToCartesian(outerR, angle)
          return (
            <line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#FAF7F2"
              strokeWidth="2"
            />
          )
        })}

        {/* Labels */}
        {WHEEL_AREAS.map((area, i) => {
          const angle = i * anglePerSeg + anglePerSeg / 2
          const labelR = outerR + 24
          const pos = polarToCartesian(labelR, angle)
          const isActive = activeKey === area.key
          return (
            <text
              key={area.key}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Fraunces, serif"
              fontSize="14"
              fill={isActive ? '#C2410C' : '#1A1B1F'}
              fontWeight={isActive ? 600 : 400}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => onSelect(area.key)}
            >
              {area.label}
            </text>
          )
        })}

        {/* Center */}
        <circle cx={cx} cy={cy} r={innerR - 2} fill="#FAF7F2" stroke="#C2410C" strokeWidth="1" />
      </svg>
    </div>
  )
}
