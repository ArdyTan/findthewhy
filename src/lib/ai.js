// Claude API wrapper. All requests go through the Vite proxy at /api/anthropic
// so the API key never reaches the browser.

const API_URL = '/api/anthropic/v1/messages'
const DEFAULT_MODEL = 'claude-sonnet-4-5-20250929'
const DEFAULT_MAX_TOKENS = 2048

export class AIError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'AIError'
    this.status = status
  }
}

/**
 * Send a chat request and get the full response.
 * @param {Array<{role: 'user'|'assistant', content: string}>} messages
 * @param {{ system?: string, model?: string, maxTokens?: number }} options
 * @returns {Promise<string>} The assistant's text response
 */
export async function chat(messages, options = {}) {
  const body = {
    model: options.model || DEFAULT_MODEL,
    max_tokens: options.maxTokens || DEFAULT_MAX_TOKENS,
    messages,
  }
  if (options.system) body.system = options.system

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new AIError(`API error (${res.status}): ${errText}`, res.status)
  }

  const data = await res.json()
  const textBlock = data.content?.find((b) => b.type === 'text')
  return textBlock?.text || ''
}

/**
 * Send a chat request and stream the response chunk by chunk.
 * @param {Array} messages
 * @param {Object} options
 * @param {(delta: string, full: string) => void} onDelta
 * @returns {Promise<string>} The full response text
 */
export async function chatStream(messages, options = {}, onDelta) {
  const body = {
    model: options.model || DEFAULT_MODEL,
    max_tokens: options.maxTokens || DEFAULT_MAX_TOKENS,
    messages,
    stream: true,
  }
  if (options.system) body.system = options.system

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new AIError(`API error (${res.status}): ${errText}`, res.status)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // SSE format: lines separated by \n\n, each event has "data: {json}"
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const payload = line.slice(6).trim()
      if (!payload || payload === '[DONE]') continue
      try {
        const event = JSON.parse(payload)
        if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
          full += event.delta.text
          onDelta?.(event.delta.text, full)
        }
      } catch (err) {
        // Skip malformed events
      }
    }
  }

  return full
}

/**
 * Heuristic check: is the API likely configured?
 * Returns a Promise<boolean> by sending a tiny request.
 */
export async function isConfigured() {
  try {
    await chat([{ role: 'user', content: 'hi' }], { maxTokens: 10 })
    return true
  } catch (err) {
    return false
  }
}
