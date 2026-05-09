import { STAGES } from '../lib/schema.js'

const LABELS = {
  welcome: 'Start',
  ikigai: 'Ikigai',
  wheel: 'Wheel',
  okr: 'OKRs',
  dashboard: 'Dashboard',
}

export function ProgressNav({ currentStage, onNavigate, completedStages = [] }) {
  return (
    <nav className="border-b border-rule px-6 py-4 sticky top-0 bg-cream/95 backdrop-blur z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => onNavigate('welcome')}
          className="font-display text-xl tracking-tightest text-ink hover:text-terracotta transition-colors"
        >
          LifeQuest
        </button>

        <ol className="flex items-center gap-1 md:gap-2 text-sm">
          {STAGES.filter((s) => s !== 'welcome').map((stage, i) => {
            const isActive = currentStage === stage
            const isCompleted = completedStages.includes(stage)
            const isAccessible = isCompleted || isActive
            return (
              <li key={stage} className="flex items-center">
                {i > 0 && <span className="text-rule mx-1">/</span>}
                <button
                  onClick={() => isAccessible && onNavigate(stage)}
                  disabled={!isAccessible}
                  className={`px-2 py-1 transition-colors ${
                    isActive
                      ? 'text-terracotta font-medium'
                      : isAccessible
                        ? 'text-ink/70 hover:text-ink'
                        : 'text-muted cursor-not-allowed'
                  }`}
                >
                  <span className="font-display text-xs mr-1.5 text-muted">
                    0{i + 1}
                  </span>
                  {LABELS[stage]}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
