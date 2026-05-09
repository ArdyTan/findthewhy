import { useAppState } from './hooks/useAppState.js'
import { Welcome } from './components/Welcome.jsx'
import { ProgressNav } from './components/ProgressNav.jsx'
import { IkigaiDiscovery } from './components/IkigaiDiscovery.jsx'
import { WheelOfLife } from './components/WheelOfLife.jsx'
import { OKRBuilder } from './components/OKRBuilder.jsx'
import { Dashboard } from './components/Dashboard.jsx'

export default function App() {
  const { state, update, reset, setStage } = useAppState()

  const completedStages = []
  if (state.ikigai.completedAt) completedStages.push('ikigai')
  if (state.wheelOfLife.completedAt) completedStages.push('wheel')
  if (state.okrs.length > 0) completedStages.push('okr')
  if (completedStages.length > 0) completedStages.push('dashboard')

  const hasExisting =
    state.ikigai.love.length > 0 ||
    state.ikigai.goodAt.length > 0 ||
    state.ikigai.worldNeeds.length > 0 ||
    state.ikigai.paidFor.length > 0 ||
    completedStages.length > 0

  if (state.currentStage === 'welcome') {
    return (
      <Welcome
        hasExisting={hasExisting}
        onStart={() => {
          if (hasExisting) reset()
          setStage('ikigai')
        }}
        onContinue={() => {
          // Resume at the latest incomplete stage
          if (!state.ikigai.completedAt) setStage('ikigai')
          else if (!state.wheelOfLife.completedAt) setStage('wheel')
          else if (state.okrs.length === 0) setStage('okr')
          else setStage('dashboard')
        }}
        onReset={reset}
      />
    )
  }

  return (
    <div>
      <ProgressNav
        currentStage={state.currentStage}
        onNavigate={setStage}
        completedStages={completedStages}
      />

      {state.currentStage === 'ikigai' && (
        <IkigaiDiscovery state={state} update={update} onComplete={() => setStage('wheel')} />
      )}
      {state.currentStage === 'wheel' && (
        <WheelOfLife state={state} update={update} onComplete={() => setStage('okr')} />
      )}
      {state.currentStage === 'okr' && (
        <OKRBuilder state={state} update={update} onComplete={() => setStage('dashboard')} />
      )}
      {state.currentStage === 'dashboard' && <Dashboard state={state} onNavigate={setStage} />}
    </div>
  )
}
