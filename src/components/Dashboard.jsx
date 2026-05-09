import { exportMarkdown, exportJSON, downloadFile } from '../lib/storage.js'
import { WHEEL_AREAS } from '../lib/schema.js'
import { Button } from './ui/Button.jsx'
import { Eyebrow, Divider } from './ui/Primitives.jsx'

export function Dashboard({ state, onNavigate }) {
  const { ikigai, wheelOfLife, okrs } = state

  const handleExportMarkdown = () => {
    const md = exportMarkdown(state)
    downloadFile('lifequest.md', md, 'text/markdown')
  }

  const handleExportJSON = () => {
    const json = exportJSON(state)
    downloadFile('lifequest.json', json, 'application/json')
  }

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(exportMarkdown(state))
      alert('Copied to clipboard.')
    } catch (err) {
      alert('Could not copy. Use the download button instead.')
    }
  }

  const avgScore = (
    Object.values(wheelOfLife.scores).reduce((a, b) => a + b, 0) / WHEEL_AREAS.length
  ).toFixed(1)

  return (
    <div className="px-6 py-12 stage-enter">
      <div className="max-w-5xl mx-auto">
        <header className="max-w-prose mb-12">
          <Eyebrow>Your dashboard</Eyebrow>
          <h2 className="font-display text-5xl tracking-tightest leading-[1] mb-6">
            The whole picture.
          </h2>
          <p className="text-ink/70 text-lg leading-relaxed">
            Everything you&apos;ve built so far. Export it, print it, or come back to refine it.
          </p>
        </header>

        <Divider className="max-w-[120px] mb-12" />

        <div className="flex gap-3 flex-wrap mb-12">
          <Button onClick={handleCopyMarkdown}>Copy as Markdown</Button>
          <Button onClick={handleExportMarkdown} variant="ghost">
            Download .md
          </Button>
          <Button onClick={handleExportJSON} variant="ghost">
            Download .json
          </Button>
          <Button onClick={() => window.print()} variant="ghost">
            Print
          </Button>
        </div>

        {/* Ikigai Section */}
        {ikigai.synthesis && (
          <section className="mb-16">
            <Eyebrow>01 — Ikigai</Eyebrow>
            <div className="border border-rule p-8 mb-6 bg-cream">
              <div className="font-display text-xl leading-relaxed whitespace-pre-wrap">
                {ikigai.synthesis}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: 'love', label: 'I love' },
                { key: 'goodAt', label: 'I am good at' },
                { key: 'worldNeeds', label: 'World needs' },
                { key: 'paidFor', label: 'I can be paid for' },
              ].map((q) => (
                <div key={q.key} className="border border-rule p-5">
                  <Eyebrow>{q.label}</Eyebrow>
                  <ul className="space-y-1 text-sm">
                    {ikigai[q.key].length === 0 && <li className="text-muted italic">—</li>}
                    {ikigai[q.key].map((item, i) => (
                      <li key={i}>· {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate('ikigai')}
              className="mt-4 text-sm text-muted hover:text-terracotta underline-offset-4 hover:underline"
            >
              Edit Ikigai →
            </button>
          </section>
        )}

        {/* Wheel Section */}
        {wheelOfLife.completedAt && (
          <section className="mb-16">
            <Eyebrow>02 — Wheel of Life · Avg {avgScore}/10</Eyebrow>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="border border-rule p-6">
                <div className="space-y-3">
                  {WHEEL_AREAS.map((area) => {
                    const score = wheelOfLife.scores[area.key]
                    return (
                      <div key={area.key}>
                        <div className="flex items-baseline justify-between mb-1 text-sm">
                          <span>{area.label}</span>
                          <span className="font-display text-base text-terracotta">{score}</span>
                        </div>
                        <div className="h-1 bg-rule">
                          <div
                            className="h-1 bg-terracotta transition-all"
                            style={{ width: `${(score / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {wheelOfLife.insights && (
                <div className="border border-rule p-6 bg-cream">
                  <Eyebrow>Insights</Eyebrow>
                  <div className="font-display text-base leading-relaxed whitespace-pre-wrap">
                    {wheelOfLife.insights}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => onNavigate('wheel')}
              className="text-sm text-muted hover:text-terracotta underline-offset-4 hover:underline"
            >
              Edit Wheel →
            </button>
          </section>
        )}

        {/* OKR Section */}
        {okrs.length > 0 && (
          <section className="mb-16">
            <Eyebrow>03 — OKRs</Eyebrow>
            <div className="space-y-6">
              {okrs.map((okr, i) => (
                <div key={okr.id} className="border border-rule p-6 bg-cream">
                  <div className="flex items-baseline justify-between gap-4 mb-4">
                    <h3 className="font-display text-2xl leading-tight">
                      {okr.objective || '(untitled)'}
                    </h3>
                    <span className="text-xs text-muted whitespace-nowrap">{okr.timeframe}</span>
                  </div>
                  <div className="space-y-3">
                    {okr.keyResults.map((kr) => {
                      const progress = kr.target > 0 ? Math.min(100, (kr.current / kr.target) * 100) : 0
                      return (
                        <div key={kr.id}>
                          <div className="flex items-baseline justify-between mb-1 text-sm">
                            <span>{kr.text}</span>
                            <span className="text-muted">
                              {kr.current}/{kr.target} {kr.unit} · {Math.round(progress)}%
                            </span>
                          </div>
                          <div className="h-1 bg-rule">
                            <div
                              className="h-1 bg-terracotta transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate('okr')}
              className="mt-4 text-sm text-muted hover:text-terracotta underline-offset-4 hover:underline"
            >
              Edit OKRs →
            </button>
          </section>
        )}

        {!ikigai.synthesis && !wheelOfLife.completedAt && okrs.length === 0 && (
          <div className="text-center py-16 border border-rule">
            <p className="text-ink/70 mb-6">You haven&apos;t completed any stage yet.</p>
            <Button onClick={() => onNavigate('ikigai')}>Start with Ikigai</Button>
          </div>
        )}
      </div>
    </div>
  )
}
