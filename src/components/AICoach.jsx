import { useState, useRef, useEffect } from 'react'
import { chatStream, AIError } from '../lib/ai.js'
import { Button } from './ui/Button.jsx'

export function AICoach({ systemPrompt, conversation, onConversationChange, placeholder, contextHint }) {
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversation, streamText])

  const send = async () => {
    const text = input.trim()
    if (!text || streaming) return
    setError(null)
    setInput('')

    const userMessage = { role: 'user', content: text, timestamp: Date.now() }
    const nextConv = [...conversation, userMessage]
    onConversationChange(nextConv)
    setStreaming(true)
    setStreamText('')

    try {
      // Prepend context hint as first user message if conversation is empty
      const messagesForAPI = []
      if (contextHint && nextConv.length === 1) {
        messagesForAPI.push({ role: 'user', content: `${contextHint}\n\n${text}` })
      } else {
        nextConv.forEach((m) => {
          messagesForAPI.push({ role: m.role, content: m.content })
        })
      }

      const full = await chatStream(
        messagesForAPI,
        { system: systemPrompt },
        (_delta, fullSoFar) => setStreamText(fullSoFar)
      )

      const assistantMessage = { role: 'assistant', content: full, timestamp: Date.now() }
      onConversationChange([...nextConv, assistantMessage])
      setStreamText('')
    } catch (err) {
      console.error(err)
      if (err instanceof AIError && err.status === 401) {
        setError('API key missing or invalid. Check your .env.local file.')
      } else if (err.message?.includes('Failed to fetch')) {
        setError('Cannot reach the API. Is the dev server running?')
      } else {
        setError(err.message || 'Something went wrong.')
      }
    } finally {
      setStreaming(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col bg-ink/[0.02] border border-rule">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-4 max-h-[420px] min-h-[240px]"
      >
        {conversation.length === 0 && !streamText && (
          <p className="text-sm text-muted italic">
            Start a conversation. The AI coach will help you go deeper.
          </p>
        )}

        {conversation.map((m, i) => (
          <Message key={i} role={m.role} content={m.content} />
        ))}

        {streamText && <Message role="assistant" content={streamText} streaming />}

        {error && (
          <div className="text-sm text-terracotta border-l-2 border-terracotta pl-3 py-1">
            {error}
          </div>
        )}
      </div>

      <div className="border-t border-rule px-5 py-3 bg-cream">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'Type here. Enter to send, Shift+Enter for newline.'}
            rows={2}
            className="flex-1 bg-transparent border-0 p-0 font-sans text-ink placeholder:text-muted focus:outline-none resize-none text-sm"
            disabled={streaming}
          />
          <Button onClick={send} disabled={streaming || !input.trim()} size="sm">
            {streaming ? '…' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function Message({ role, content, streaming }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${
          isUser ? 'bg-navy text-cream' : 'bg-cream border border-rule text-ink'
        }`}
      >
        <p className="whitespace-pre-wrap">
          {content}
          {streaming && <span className="inline-block w-1.5 h-4 bg-terracotta ml-0.5 animate-pulse" />}
        </p>
      </div>
    </div>
  )
}
