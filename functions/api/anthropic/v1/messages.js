// Cloudflare Pages Function — production proxy for Claude API.
// File location maps to URL: /api/anthropic/v1/messages
// Reads ANTHROPIC_API_KEY from Cloudflare environment variables (set as a secret
// in the Cloudflare dashboard, NOT committed to the repo).
//
// This mirrors the Vite dev proxy in vite.config.js so the frontend code in
// src/lib/ai.js works identically in dev and production.

export async function onRequestPost(context) {
  const { request, env } = context

  if (!env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({
        error: {
          type: 'configuration_error',
          message: 'ANTHROPIC_API_KEY is not set. Add it as a secret in the Cloudflare dashboard.',
        },
      }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    )
  }

  // Pass the request body straight through to Claude API
  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: request.body,
    // Required so the streaming body is forwarded correctly
    duplex: 'half',
  })

  // Stream the response straight back so chatStream() in src/lib/ai.js works
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') || 'application/json',
      'cache-control': 'no-store',
    },
  })
}

// Reject other methods explicitly
export async function onRequest({ request }) {
  if (request.method === 'POST') return // handled above
  return new Response('Method not allowed', { status: 405 })
}
