const INCEPTION_URL = "https://api.inceptionlabs.ai/v1/chat/completions";
const MODEL = "mercury-2";

const SYSTEM_PROMPT = `You are a thoughtful career coach analyzing someone's Ikigai questionnaire results. They answered 20 questions across four circles (Passion, Skills, Mission, Vocation), with five questions per circle.

Your task: produce a personalized career analysis that reflects THEIR specific answer pattern, not a generic archetype description.

Output:
- Plain prose, 4-5 paragraphs, around 280-380 words total
- No headers, no bullet points, no markdown
- Match the user's apparent language: default to English; if their answers contain Indonesian context or phrasing, respond in Indonesian
- End with 2-3 specific, named career path suggestions tailored to their answers (real role/path names, not abstractions)

Structure each response loosely as:
1. One paragraph naming the strongest pattern across all four circles — what stands out
2. One paragraph on tensions or trade-offs you notice (e.g. high passion but low vocation; mission and skills pulling in different directions)
3. One paragraph synthesizing the sweet spot — where their four circles realistically overlap based on their actual selections
4. A closing paragraph with 2-3 specific career suggestions, briefly justified

Style:
- Warm but honest. Never sycophantic ("amazing answers!", "you got this!")
- Specific over abstract. Reference their actual selections, not generic categories
- Don't repeat the percentile scores back to them — they already see those
- Don't moralize or recommend therapy
- No closing motivational line`;

function buildUserMessage(payload) {
  const { answers, scores, dominant, archetype } = payload;
  const sections = { passion: [], skills: [], mission: [], vocation: [] };

  answers.forEach((q, i) => {
    const lines = [];
    lines.push(`Q${i + 1}: ${q.title}`);
    if (q.selected.length === 0) {
      lines.push("  → (no answer selected)");
    } else {
      q.selected.forEach((s) => {
        lines.push(`  → ${s.letter}. ${s.text}`);
      });
    }
    sections[q.circle].push(lines.join("\n"));
  });

  const blocks = [
    `## CIRCLE: PASSION (${scores.passion}%)\n${sections.passion.join("\n\n")}`,
    `## CIRCLE: SKILLS (${scores.skills}%)\n${sections.skills.join("\n\n")}`,
    `## CIRCLE: MISSION (${scores.mission}%)\n${sections.mission.join("\n\n")}`,
    `## CIRCLE: VOCATION (${scores.vocation}%)\n${sections.vocation.join("\n\n")}`,
  ].join("\n\n");

  return `Here are the user's answers from the Ikigai career questionnaire.

Dominant circle: ${dominant} (preliminary archetype: ${archetype})

${blocks}

Now produce the personalized career analysis as instructed in the system prompt. Reference their actual selections, not just the archetype label.`;
}

function validatePayload(p) {
  if (!p || typeof p !== "object") return "Payload must be an object";
  if (!Array.isArray(p.answers)) return "answers must be an array";
  if (p.answers.length !== 20)
    return `Expected 20 answers, got ${p.answers.length}`;
  if (!p.scores || typeof p.scores !== "object") return "scores object required";
  for (const k of ["passion", "skills", "mission", "vocation"]) {
    if (typeof p.scores[k] !== "number") return `scores.${k} must be a number`;
  }
  if (typeof p.dominant !== "string") return "dominant must be a string";
  return null;
}

function jsonError(status, type, message) {
  return new Response(JSON.stringify({ error: { type, message } }), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export async function handleAnalyzePost(request, env) {
  if (!env.INCEPTION_API_KEY) {
    return jsonError(
      500,
      "configuration_error",
      "INCEPTION_API_KEY is not set. Add it as a Secret: wrangler secret put INCEPTION_API_KEY"
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonError(400, "invalid_json", "Request body is not valid JSON.");
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return jsonError(400, "invalid_payload", validationError);
  }

  const userMessage = buildUserMessage(payload);

  let upstream;
  try {
    upstream = await fetch(INCEPTION_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.INCEPTION_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });
  } catch (err) {
    return jsonError(
      502,
      "upstream_unreachable",
      `Could not reach Inception API: ${err.message}`
    );
  }

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => "");
    return jsonError(
      upstream.status,
      "upstream_error",
      `Inception API returned ${upstream.status}: ${errText.slice(0, 300)}`
    );
  }

  let data;
  try {
    data = await upstream.json();
  } catch {
    return jsonError(
      502,
      "upstream_invalid_response",
      "Inception API returned non-JSON."
    );
  }

  const analysis = data?.choices?.[0]?.message?.content?.trim() || "";
  if (!analysis) {
    return jsonError(
      502,
      "empty_response",
      "Inception API returned an empty analysis."
    );
  }

  return new Response(
    JSON.stringify({
      analysis,
      model: MODEL,
      generatedAt: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    }
  );
}
