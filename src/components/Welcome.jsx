import { Button } from './ui/Button.jsx'
import { Eyebrow, Divider } from './ui/Primitives.jsx'

export function Welcome({ hasExisting, onStart, onContinue, onReset }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full stagger">
          <Eyebrow>A personal compass</Eyebrow>

          <h1 className="font-display text-6xl md:text-7xl leading-[0.95] tracking-tightest text-ink mb-8">
            LifeQuest.
          </h1>

          <p className="font-display text-2xl md:text-3xl leading-snug text-ink/80 mb-12 max-w-xl">
            A guided journey to find what you love, what you&apos;re good at, what the world needs,
            and what pays — and what to actually do about it.
          </p>

          <Divider className="my-10 max-w-[120px]" />

          <div className="space-y-4 mb-12 text-ink/70 max-w-lg">
            <p>
              <span className="font-display text-ink">01.</span> Discover your{' '}
              <em className="font-display">Ikigai</em> through guided conversation.
            </p>
            <p>
              <span className="font-display text-ink">02.</span> Map your{' '}
              <em className="font-display">Wheel of Life</em> across eight areas.
            </p>
            <p>
              <span className="font-display text-ink">03.</span> Translate it into{' '}
              <em className="font-display">OKRs</em> with measurable key results.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {hasExisting ? (
              <>
                <Button size="lg" onClick={onContinue}>
                  Continue your journey
                </Button>
                <Button size="lg" variant="ghost" onClick={onStart}>
                  Start fresh
                </Button>
              </>
            ) : (
              <Button size="lg" onClick={onStart}>
                Begin →
              </Button>
            )}
          </div>

          {hasExisting && (
            <p className="mt-12 text-sm text-muted">
              <button
                onClick={() => {
                  if (confirm('This will erase all your saved data. Are you sure?')) onReset()
                }}
                className="underline-offset-4 hover:underline hover:text-terracotta"
              >
                Reset all data
              </button>
            </p>
          )}
        </div>
      </div>

      <footer className="text-xs text-muted text-center py-6 px-6">
        Local-first · Your data never leaves your browser · Powered by Claude
      </footer>
    </div>
  )
}
