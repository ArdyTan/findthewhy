/* ============================================================
   IKIGAI — App logic
   - Screen flow: splash -> welcome -> form -> result
   - 20 questions from the Ikigai Career Questionnaire PDF
   - Each question is mapped to a circle: passion / skills / mission / vocation
   - Mode "multi"  = select all that apply
   - Mode "single" = choose your top one
   ============================================================ */

const QUESTIONS = [
  // -------- CIRCLE 1: PASSION --------
  {
    circle: "passion",
    mode: "multi",
    title: "When do you most lose track of time?",
    options: [
      "When I'm building or making something from scratch",
      "When I'm talking to people, helping or coaching someone",
      "When I'm solving a complex problem or puzzle",
      "When I'm learning something new through research or reading",
      "When I'm organizing, planning, or bringing structure to chaos",
    ],
  },
  {
    circle: "passion",
    mode: "multi",
    title: "If money were not a concern, how would you spend your time?",
    options: [
      "Creating art, music, writing, or something expressive",
      "Traveling and learning about different cultures or communities",
      "Building products, tools, or systems that solve problems",
      "Teaching, mentoring, or working with youth or students",
      "Doing research or deep work in a subject I care about",
    ],
  },
  {
    circle: "passion",
    mode: "multi",
    title:
      "What kind of content do you consume on your own time — without being asked?",
    options: [
      "Technology, startups, or product design",
      "Psychology, personal development, or human behavior",
      "Social issues, environment, or global challenges",
      "Business, finance, or strategy",
      "Arts, storytelling, culture, or philosophy",
    ],
  },
  {
    circle: "passion",
    mode: "single",
    title: "What feeling do you most want to experience at work?",
    options: [
      "Creative expression — I made this",
      "Deep focus — I was completely absorbed",
      "Connection — I really helped someone today",
      "Growth — I learned something that challenged me",
      "Impact — what I did actually mattered",
    ],
  },
  {
    circle: "passion",
    mode: "single",
    title: "Which environment makes you feel most energized?",
    options: [
      "Fast-moving, unpredictable, high-energy teams",
      "Quiet, focused, solo deep work",
      "Collaborative, close-knit groups with shared mission",
      "External-facing work with clients, customers, or community",
      "Structured environments with clear goals and milestones",
    ],
  },

  // -------- CIRCLE 2: SKILLS --------
  {
    circle: "skills",
    mode: "multi",
    title: "What do people most often come to you for help with?",
    options: [
      "Advice on decisions, problems, or how to think about something",
      "Technical or specialized help (code, design, analysis, etc.)",
      "Emotional support, listening, or conflict resolution",
      "Creative input — ideas, writing, or visual work",
      "Getting things organized or executed efficiently",
    ],
  },
  {
    circle: "skills",
    mode: "multi",
    title: "Which of these skills feel most natural to you?",
    options: [
      "Communicating clearly — speaking, writing, or presenting",
      "Seeing patterns or making sense of complex information",
      "Building rapport and trust with people quickly",
      "Turning ideas into tangible things — prototyping, building, shipping",
      "Leading, motivating, or pulling a team toward a goal",
    ],
  },
  {
    circle: "skills",
    mode: "single",
    title: "Think of a time you received genuine praise. What was it for?",
    options: [
      "The quality or originality of my work or output",
      "How I handled people, relationships, or a difficult situation",
      "Getting results or delivering something under pressure",
      "My strategic thinking or a decision I made",
      "Teaching, explaining, or making something easier to understand",
    ],
  },
  {
    circle: "skills",
    mode: "single",
    title: "In a team project, what role do you naturally fall into?",
    options: [
      "The visionary — generating ideas and direction",
      "The executor — turning plans into action",
      "The connector — keeping people aligned and motivated",
      "The analyst — questioning assumptions and stress-testing plans",
      "The specialist — going deep on a specific part of the work",
    ],
  },
  {
    circle: "skills",
    mode: "multi",
    title: "Where do you learn fastest compared to most people around you?",
    options: [
      "Technology, software, or digital tools",
      "People skills — reading rooms, negotiation, influence",
      "Creative disciplines — design, writing, storytelling",
      "Business and systems thinking",
      "Science, research, or data",
    ],
  },

  // -------- CIRCLE 3: MISSION --------
  {
    circle: "mission",
    mode: "multi",
    title: "What problem in the world makes you most angry or frustrated?",
    options: [
      "Inequality — in education, health, wealth, or opportunity",
      "Environmental destruction or climate inaction",
      "Mental health crisis and lack of emotional support",
      "Broken or outdated systems — healthcare, education, government",
      "People unable to reach their potential due to lack of access",
    ],
  },
  {
    circle: "mission",
    mode: "single",
    title: "Whose lives do you most want to improve through your work?",
    options: [
      "Children and young people",
      "People in underserved or marginalized communities",
      "Professionals or teams in a specific industry",
      "Individuals navigating a major life transition",
      "Society as a whole — through better systems or policies",
    ],
  },
  {
    circle: "mission",
    mode: "single",
    title:
      "If you could fix one broken thing in your city or country, what would it be?",
    options: [
      "Access to quality education for all",
      "Economic opportunity and job creation",
      "Mental health services and community support",
      "Environmental sustainability and green infrastructure",
      "Corruption, transparency, or civic trust in institutions",
    ],
  },
  {
    circle: "mission",
    mode: "single",
    title: "What kind of impact would make you feel your career was worth it?",
    options: [
      "Directly improving lives — I can see the people I helped",
      "Building something that outlasts me — a product, org, or idea",
      "Shifting how an industry or system works at scale",
      "Inspiring or enabling others to reach their own potential",
      "Contributing knowledge or creativity that moves the field forward",
    ],
  },
  {
    circle: "mission",
    mode: "multi",
    title: "What cause do you find yourself defending — even when unprompted?",
    options: [
      "Women's rights, gender equity, or inclusion",
      "Animal welfare or environmental protection",
      "Education reform or access to knowledge",
      "Tech ethics, data privacy, or AI responsibility",
      "Economic justice, fair wages, or local community empowerment",
    ],
  },

  // -------- CIRCLE 4: VOCATION --------
  {
    circle: "vocation",
    mode: "multi",
    title:
      "What are you currently being paid to do — or have been paid for in the past?",
    options: [
      "Technical skills — engineering, coding, data, design",
      "Business skills — sales, marketing, operations, finance",
      "People skills — HR, coaching, facilitation, customer success",
      "Creative skills — writing, design, video, content",
      "Domain expertise — law, medicine, education, research",
    ],
  },
  {
    circle: "vocation",
    mode: "single",
    title: "Which best describes your current career stage?",
    options: [
      "Student or early career — still exploring what I want to do",
      "Mid-career — established in a field but considering a pivot",
      "Senior — experienced but seeking more meaning or purpose",
      "Entrepreneur or freelancer — building on my own terms",
      "Career break or transition — restarting from a new chapter",
    ],
  },
  {
    circle: "vocation",
    mode: "multi",
    title:
      "Which skill of yours do you think is rare or hard to find in the job market?",
    options: [
      "Combining technical and human skills (e.g. engineer who can communicate)",
      "Deep niche expertise in a specific domain",
      "The ability to lead across cultures or contexts",
      "Creative problem-solving at the intersection of two fields",
      "High emotional intelligence in high-pressure environments",
    ],
  },
  {
    circle: "vocation",
    mode: "single",
    title: "How comfortable are you with financial risk in your career path?",
    options: [
      "I need stable income — security comes first for me right now",
      "I'm okay with some risk if the upside is meaningful",
      "I'm willing to earn less short-term for a mission I believe in",
      "I'm ready to take a big leap — all in on building something new",
      "I want to monetize what I already love doing — figuring out how",
    ],
  },
  {
    circle: "vocation",
    mode: "single",
    title: "What type of work arrangement feels most sustainable for you?",
    options: [
      "Full-time employment with benefits and structure",
      "Freelance or consulting — flexible and project-based",
      "Building my own startup or business",
      "Portfolio career — multiple income streams from different work",
      "Mission-driven org (NGO, social enterprise, government)",
    ],
  },
];

const CIRCLE_LABELS = {
  passion:  "Passion circle",
  skills:   "Skills circle",
  mission:  "Mission circle",
  vocation: "Vocation circle",
};

/* ------------------------------------------------------------
   Archetypes — derived from the dominant circle / overlap
   ------------------------------------------------------------ */
const ARCHETYPES = {
  passion: {
    name: "The Visionary",
    glyph: "V",
    blurb:
      "You're driven by what you love. Your energy comes from creative spark, curiosity, and being deeply absorbed in work that feels personal.",
    long:
      "Visionaries are great at seeing what could be. You're more likely to thrive when you have room to explore, create, and follow ideas wherever they lead.",
    long2:
      "Your sweet spot lives at the intersection of passion and meaning — careers where self-expression and purpose are non-negotiable.",
    overlaps: ["Passion + Mission", "Passion + Skills"],
  },
  skills: {
    name: "The Builder",
    glyph: "B",
    blurb:
      "You're driven by mastery. You shine when you can apply real skill to real problems — the kind of person every team needs when ideas have to become reality.",
    long:
      "Builders combine deep focus with hands-on execution. You learn fast, ship fast, and tend to be the person others trust to actually deliver.",
    long2:
      "Your sweet spot lives where skills meet vocation — careers where craft is rewarded and your expertise compounds over time.",
    overlaps: ["Skills + Vocation", "Skills + Passion"],
  },
  mission: {
    name: "The Changemaker",
    glyph: "M",
    blurb:
      "You're driven by impact. What the world needs isn't an abstract question for you — it's the lens you naturally use when choosing what to do.",
    long:
      "Changemakers care about systems, equity, and the people behind the numbers. You're often happiest when your work directly improves lives.",
    long2:
      "Your sweet spot lives at the intersection of mission and vocation — work that pays the bills and leaves the world better than you found it.",
    overlaps: ["Mission + Vocation", "Mission + Passion"],
  },
  vocation: {
    name: "The Strategist",
    glyph: "S",
    blurb:
      "You're driven by sustainable craft. You think clearly about how skill turns into value, and you're not afraid to design a career deliberately.",
    long:
      "Strategists are pragmatic. You're great at spotting where your skills meet a real market, and at building careers that compound — not just jobs.",
    long2:
      "Your sweet spot lives where vocation meets skills and passion — careers where you get paid well to do work you respect.",
    overlaps: ["Vocation + Skills", "Vocation + Passion"],
  },
};

/* ============================================================
   State
   ============================================================ */
const state = {
  current: 0,
  // answers[i] = array of selected letters, e.g. ["A", "C"]
  answers: QUESTIONS.map(() => []),
};

/* ============================================================
   DOM helpers
   ============================================================ */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const screens = {
  splash: $("#screen-splash"),
  welcome: $("#screen-welcome"),
  form: $("#screen-form"),
  result: $("#screen-result"),
};

function show(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
  if (name === "form") renderQuestion();
  if (name === "result") renderResult();
}

/* ============================================================
   Form rendering
   ============================================================ */
const LETTERS = ["A", "B", "C", "D", "E"];

function renderQuestion() {
  const i = state.current;
  const q = QUESTIONS[i];

  // progress
  const progress = ((i + 1) / QUESTIONS.length) * 100;
  $("#progressFill").style.width = progress + "%";
  $("#progressText").textContent = `${i + 1} / ${QUESTIONS.length}`;
  $("#progressCircle").textContent =
    q.circle.charAt(0).toUpperCase() + q.circle.slice(1);

  // circle pill
  const pill = $("#circlePill");
  pill.dataset.circle = q.circle;
  $("#circleName").textContent = CIRCLE_LABELS[q.circle];

  // question
  $("#questionTitle").textContent = q.title;
  $("#questionHint").textContent =
    q.mode === "multi" ? "Select all that apply" : "Choose your top one";

  // options
  const list = $("#optionsList");
  list.innerHTML = "";
  q.options.forEach((text, idx) => {
    const letter = LETTERS[idx];
    const selected = state.answers[i].includes(letter);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option" + (selected ? " selected" : "");
    btn.dataset.letter = letter;
    btn.innerHTML = `
      <span class="option-letter">${letter}</span>
      <span class="option-text">${text}</span>
      <span class="check">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M5 12l4 4 10-10" stroke="currentColor" stroke-width="3"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    `;
    btn.addEventListener("click", () => toggleOption(letter));
    list.appendChild(btn);
  });

  // selected chips
  renderChips();

  // prev / next state
  $("#prevBtn").disabled = i === 0;

  const nextBtn = $("#nextBtn");
  if (i === QUESTIONS.length - 1) {
    nextBtn.innerHTML = `See results
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.4"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  } else {
    nextBtn.innerHTML = `Next
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.4"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  }
}

function renderChips() {
  const i = state.current;
  const sel = state.answers[i];
  const wrap = $("#selectedChips");
  wrap.innerHTML = "";
  if (sel.length === 0) {
    const empty = document.createElement("span");
    empty.className = "chip-empty";
    empty.textContent = "—";
    wrap.appendChild(empty);
    return;
  }
  sel.forEach((letter) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.dataset.letter = letter;
    chip.textContent = letter;
    wrap.appendChild(chip);
  });
}

function toggleOption(letter) {
  const i = state.current;
  const q = QUESTIONS[i];
  const arr = state.answers[i];
  const idx = arr.indexOf(letter);

  if (q.mode === "single") {
    state.answers[i] = idx === -1 ? [letter] : [];
  } else {
    if (idx === -1) arr.push(letter);
    else arr.splice(idx, 1);
  }
  renderQuestion();
}

/* ============================================================
   Navigation
   ============================================================ */
function next() {
  if (state.current < QUESTIONS.length - 1) {
    state.current++;
    renderQuestion();
  } else {
    show("result");
  }
}
function prev() {
  if (state.current > 0) {
    state.current--;
    renderQuestion();
  }
}

/* ============================================================
   Scoring
   ============================================================ */
function computeResult() {
  const counts = { passion: 0, skills: 0, mission: 0, vocation: 0 };
  const maxes  = { passion: 0, skills: 0, mission: 0, vocation: 0 };

  QUESTIONS.forEach((q, i) => {
    const sel = state.answers[i];
    // each selected option = 1 engagement point; max possible per question:
    // - single: 1 (you can pick one)
    // - multi : number of options (5)
    maxes[q.circle] += q.mode === "single" ? 1 : q.options.length;
    counts[q.circle] += sel.length;
  });

  // Convert to percent of "engagement" within each circle
  const pct = {};
  Object.keys(counts).forEach((k) => {
    pct[k] = maxes[k] === 0 ? 0 : Math.round((counts[k] / maxes[k]) * 100);
  });

  // Determine dominant circle (highest %)
  let dominant = "skills";
  let best = -1;
  Object.entries(pct).forEach(([k, v]) => {
    if (v > best) { best = v; dominant = k; }
  });

  return { pct, dominant };
}

/* ============================================================
   Result rendering
   ============================================================ */
function renderResult() {
  const { pct, dominant } = computeResult();

  $("#scorePassion").textContent  = pct.passion  + "%";
  $("#scoreSkills").textContent   = pct.skills   + "%";
  $("#scoreMission").textContent  = pct.mission  + "%";
  $("#scoreVocation").textContent = pct.vocation + "%";

  // animate bars
  requestAnimationFrame(() => {
    $("#barPassion").style.width  = pct.passion  + "%";
    $("#barSkills").style.width   = pct.skills   + "%";
    $("#barMission").style.width  = pct.mission  + "%";
    $("#barVocation").style.width = pct.vocation + "%";
  });

  const a = ARCHETYPES[dominant];
  $("#resultName").textContent     = a.name;
  $("#resultBlurb").textContent    = a.blurb;
  $("#archetypeTitle").textContent = a.name;
  $("#archetypeText").textContent  = a.long;
  $("#archetypeText2").textContent = a.long2;
  $("#avatarGlyph").textContent    = a.glyph;
  $("#resultAvatar").dataset.tone  = dominant;

  $("#overlap1").textContent = a.overlaps[0];
  $("#overlap2").textContent = a.overlaps[1];

  // Trigger AI analysis (async, non-blocking)
  analyzeWithAI();
}

/* ============================================================
   AI Analysis — calls /api/analyze backend
   ============================================================ */
let analysisCache = null; // cache so re-renders don't refetch

async function analyzeWithAI() {
  const loadingEl = $("#aiLoading");
  const contentEl = $("#aiContent");
  const errorEl   = $("#aiError");
  const textEl    = $("#aiText");

  // Reset UI states
  loadingEl.classList.remove("hidden");
  contentEl.classList.add("hidden");
  errorEl.classList.add("hidden");

  // If we already have a cached analysis for this exact answer set, use it
  const fingerprint = JSON.stringify(state.answers);
  if (analysisCache && analysisCache.fingerprint === fingerprint) {
    textEl.textContent = analysisCache.analysis;
    loadingEl.classList.add("hidden");
    contentEl.classList.remove("hidden");
    return;
  }

  // Build payload
  const { pct, dominant } = computeResult();
  const payload = {
    answers: state.answers.map((sel, i) => {
      const q = QUESTIONS[i];
      return {
        circle: q.circle,
        mode: q.mode,
        title: q.title,
        selected: sel.map((letter) => ({
          letter,
          text: q.options[LETTERS.indexOf(letter)],
        })),
      };
    }),
    scores: pct,
    dominant,
    archetype: ARCHETYPES[dominant].name,
  };

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Server returned ${res.status}`);
    }

    const data = await res.json();
    if (!data.analysis) throw new Error("Empty analysis from server.");

    analysisCache = { fingerprint, analysis: data.analysis };
    textEl.textContent = data.analysis;
    loadingEl.classList.add("hidden");
    contentEl.classList.remove("hidden");
  } catch (err) {
    console.error("[analyze]", err);
    $("#aiErrorMsg").textContent = err.message || "Something went wrong.";
    loadingEl.classList.add("hidden");
    errorEl.classList.remove("hidden");
  }
}

/* ============================================================
   Wire up
   ============================================================ */
document.addEventListener("click", (e) => {
  const action = e.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  switch (action) {
    case "start":            show("welcome"); show("form"); break;
    case "back-to-welcome":  show("welcome"); break;
    case "next":             next(); break;
    case "prev":             prev(); break;
    case "restart":
      state.current = 0;
      state.answers = QUESTIONS.map(() => []);
      analysisCache = null;
      show("welcome");
      break;
    case "retry-analysis":
      analyzeWithAI();
      break;
    case "share":
      const a = ARCHETYPES[computeResult().dominant];
      const text = `My Ikigai archetype: ${a.name}. ${a.blurb}`;
      if (navigator.share) {
        navigator.share({ title: "My Ikigai result", text }).catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        const btn = e.target.closest("button");
        const orig = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = orig), 1400);
      }
      break;
  }
});

/* keyboard shortcuts on form */
document.addEventListener("keydown", (e) => {
  if (!screens.form.classList.contains("active")) return;
  const keyToLetter = { 1: "A", 2: "B", 3: "C", 4: "D", 5: "E",
                         a: "A", b: "B", c: "C", d: "D", e: "E" };
  const letter = keyToLetter[e.key.toLowerCase()];
  if (letter) {
    const q = QUESTIONS[state.current];
    if (LETTERS.indexOf(letter) < q.options.length) toggleOption(letter);
  }
  if (e.key === "ArrowRight" || e.key === "Enter") next();
  if (e.key === "ArrowLeft") prev();
});

/* ============================================================
   Boot — show splash, then auto-advance to welcome
   ============================================================ */
window.addEventListener("load", () => {
  setTimeout(() => show("welcome"), 1800);
});
