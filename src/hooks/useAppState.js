import { useEffect, useState, useCallback } from 'react'
import { loadState, saveState, resetState as resetStorage } from '../lib/storage.js'
import { createDefaultState } from '../lib/schema.js'

export function useAppState() {
  const [state, setState] = useState(() => loadState() || createDefaultState())

  // Persist on every change
  useEffect(() => {
    saveState(state)
  }, [state])

  const update = useCallback((updater) => {
    setState((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  const reset = useCallback(() => {
    const fresh = resetStorage()
    setState(fresh)
  }, [])

  const setStage = useCallback((stage) => {
    setState((prev) => ({ ...prev, currentStage: stage }))
  }, [])

  return { state, update, reset, setStage }
}
