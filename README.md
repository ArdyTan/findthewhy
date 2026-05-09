# LifeQuest

A personal AI-guided web app to help you find your life direction through three integrated frameworks: **Ikigai**, **Wheel of Life**, and **OKRs**.

Local-first. No login. No backend database. Your data stays in your browser.

---

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Add your Claude API key

```bash
cp .env.example .env.local
```

Open `.env.local` and replace `sk-ant-your-key-here` with your actual key from [console.anthropic.com](https://console.anthropic.com/).

> ⚠️ **Important**: The variable must be `ANTHROPIC_API_KEY` (not `VITE_ANTHROPIC_API_KEY`). The Vite dev server proxy injects it server-side so the key never reaches your browser.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## How it works

The app guides you through three stages:

1. **Ikigai Discovery** — Add at least 3 items to each of the four quadrants (what you love, what you're good at, what the world needs, what you can be paid for). The AI coach helps you go deeper than your first answer. When all four are filled, the AI synthesizes them into a 2-3 paragraph statement.

2. **Wheel of Life** — Rate eight life areas from 1-10. Add reflection notes. The AI looks for patterns, trade-offs, and one area to focus on first.

3. **OKR Builder** — Based on your Ikigai and Wheel data, the AI generates 2-4 starter OKRs with measurable Key Results. Edit, add, or remove freely.

A final **Dashboard** lets you see everything together and export to Markdown (for Notion), JSON (for backup), or print.

---

## Tech stack

- **Vite + React 18** — Fast dev server, simple build
- **TailwindCSS** — Custom design tokens (warm palette, Fraunces + DM Sans)
- **localStorage** — Single versioned JSON blob, persists across reloads
- **Claude API** — `claude-sonnet-4-5-20250929` via Vite proxy (key stays server-side)
- **No router** — Simple state machine in `App.jsx`
- **No UI libs** — All components custom in `src/components/ui/`
- **No chart libs** — Wheel of Life is a custom SVG

---

## File structure

```
src/
  main.jsx              # React entry
  App.jsx               # Stage routing
  index.css             # Global styles, grain texture, slider styling
  lib/
    schema.js           # Default state shape, constants
    storage.js          # localStorage helpers, exports
    ai.js               # Claude API client (chat, chatStream)
    prompts.js          # System prompts for each AI interaction
  hooks/
    useAppState.js      # Persisted state hook
  components/
    Welcome.jsx
    ProgressNav.jsx
    IkigaiDiscovery.jsx
    WheelOfLife.jsx     # Includes custom SVG radial chart
    OKRBuilder.jsx
    Dashboard.jsx
    AICoach.jsx         # Reusable streaming chat panel
    ui/
      Button.jsx
      Primitives.jsx    # Card, Input, Textarea, Tag, Eyebrow, etc.
functions/
  api/anthropic/v1/
    messages.js         # Cloudflare Pages Function — production API proxy
```

---

## Customizing

### Change the AI's tone

Edit the system prompts in `src/lib/prompts.js`. Each prompt is a constant: `IKIGAI_COACH`, `IKIGAI_SYNTHESIS`, `WHEEL_REFLECTION`, `OKR_GENERATOR`.

### Change the design

Color tokens are in `tailwind.config.js`. Fonts are loaded in `index.html`. Most components use Tailwind classes inline — easy to find and modify.

### Add a new life area to the Wheel

Edit `WHEEL_AREAS` in `src/lib/schema.js`. The wheel chart will adapt automatically.

### Switch the model

Change `DEFAULT_MODEL` in `src/lib/ai.js`.

---

## Deploying to Cloudflare Pages

This project is set up to deploy on **Cloudflare Pages** with Functions. The `functions/api/anthropic/v1/messages.js` file is automatically discovered by Cloudflare and acts as the production replacement for the Vite dev proxy — the frontend code in `src/lib/ai.js` works identically in dev and production.

### Step-by-step

1. **Push to GitHub** — commit your code (make sure `.env.local` is not committed; `.gitignore` already excludes it).

2. **Connect to Cloudflare Pages**:
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com/) → Workers & Pages → Create → Pages → Connect to Git
   - Select your repo
   - Build command: `npm run build` (or `bun run build`)
   - Output directory: `dist`

3. **Add the API key as a secret** (this is the most important step):
   - In your Pages project: Settings → Environment variables → Production
   - Add variable: name `ANTHROPIC_API_KEY`, value `sk-ant-...`, **type: Secret** (encrypted)
   - Add the same to Preview environment if you want preview deploys to work

4. **Trigger a redeploy** — push a commit, or hit "Retry deployment" in Cloudflare.

The Function will pick up `env.ANTHROPIC_API_KEY` server-side. The key never reaches the browser.

### About the Vite version

This project uses Vite 6 (`^6.0.7`). Cloudflare's Wrangler 4.x requires Vite 6+ for automatic configuration — Vite 5 will fail with `"The version of Vite ... cannot be automatically configured"`.

### Deploying elsewhere (Vercel, Netlify)

Replace the Cloudflare Function with the equivalent serverless function for your platform:

- **Vercel**: Move the file to `api/anthropic/v1/messages.js` and adapt to the Vercel handler signature (`req, res`). Set `ANTHROPIC_API_KEY` in Project Settings → Environment Variables.
- **Netlify**: Use Netlify Functions in `netlify/functions/anthropic.js` and add a redirect rule so `/api/anthropic/v1/messages` → `/.netlify/functions/anthropic`.

---

## Troubleshooting

**"Cannot reach the API"** — Make sure `npm run dev` is running and you opened the actual port it printed (default `5173`).

**"API key missing or invalid"** — Check `.env.local` exists, has `ANTHROPIC_API_KEY=sk-ant-...`, and you restarted the dev server after creating it.

**"OKR generation parsed as not-an-array"** — The AI sometimes wraps JSON in markdown fences or adds prose. The code already strips fences; if it still fails, regenerate. You can also strengthen the `OKR_GENERATOR` prompt.

**Wheel chart looks broken** — If you added new areas, make sure each has a unique `key` in `WHEEL_AREAS`.

---

## License

Personal use. Build on it freely.
