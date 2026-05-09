// Default app state shape and helpers

export const STORAGE_KEY = 'lifequest:state:v1'
export const SCHEMA_VERSION = 1

export const STAGES = ['welcome', 'ikigai', 'wheel', 'okr', 'dashboard']

export const WHEEL_AREAS = [
  { key: 'career', label: 'Career', hint: 'Work, profession, calling' },
  { key: 'finance', label: 'Finance', hint: 'Money, savings, freedom' },
  { key: 'health', label: 'Health', hint: 'Body, energy, vitality' },
  { key: 'relationships', label: 'Relationships', hint: 'Friends, partner, community' },
  { key: 'personalGrowth', label: 'Personal Growth', hint: 'Learning, skills, character' },
  { key: 'funRecreation', label: 'Fun & Recreation', hint: 'Play, hobbies, joy' },
  { key: 'environment', label: 'Environment', hint: 'Home, workspace, surroundings' },
  { key: 'family', label: 'Family', hint: 'Origin family, chosen family' },
]

export const IKIGAI_QUADRANTS = [
  {
    key: 'love',
    label: 'What you love',
    hint: 'Activities, topics, or moments that energize you',
    color: '#C2410C',
  },
  {
    key: 'goodAt',
    label: 'What you are good at',
    hint: 'Skills, strengths, things people thank you for',
    color: '#0F2A3F',
  },
  {
    key: 'worldNeeds',
    label: 'What the world needs',
    hint: 'Problems, causes, gaps you feel called to address',
    color: '#9A330A',
  },
  {
    key: 'paidFor',
    label: 'What you can be paid for',
    hint: 'Marketable skills, services, things people pay for',
    color: '#1E4A6B',
  },
]

export function createDefaultState() {
  const now = new Date().toISOString()
  return {
    version: SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    currentStage: 'welcome',
    ikigai: {
      love: [],
      goodAt: [],
      worldNeeds: [],
      paidFor: [],
      synthesis: '',
      completedAt: null,
    },
    wheelOfLife: {
      scores: WHEEL_AREAS.reduce((acc, a) => ({ ...acc, [a.key]: 5 }), {}),
      reflections: WHEEL_AREAS.reduce((acc, a) => ({ ...acc, [a.key]: '' }), {}),
      insights: '',
      completedAt: null,
    },
    okrs: [],
    conversations: {
      ikigai: [],
      wheel: [],
      okr: [],
    },
  }
}

export function isValidState(obj) {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.version === SCHEMA_VERSION &&
    obj.ikigai &&
    obj.wheelOfLife &&
    Array.isArray(obj.okrs)
  )
}
