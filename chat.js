// api/chat.js — Peques AI Chat v3
// ─────────────────────────────────────────────────────────────
// TWO modes (auto-detected):
//
//  1. OPENAI ASSISTANTS API  — uses your custom Assistant
//     Requires: OPENAI_API_KEY + OPENAI_ASSISTANT_ID env vars
//     → conversation threads maintained per visitor session
//
//  2. CHAT COMPLETIONS (fallback)
//     Requires: OPENAI_API_KEY only
//     → uses SYSTEM_PROMPT below + gpt-4o-mini
//
// Set in Vercel → Settings → Environment Variables:
//   OPENAI_API_KEY         (required)
//   OPENAI_ASSISTANT_ID    (optional — enables Assistants mode)
// ─────────────────────────────────────────────────────────────

const OPENAI_API_KEY      = process.env.OPENAI_API_KEY      || '';
const OPENAI_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || '';
const MODEL               = 'gpt-4o-mini';
const MAX_TOKENS          = 500;
const POLL_MS             = 800;
const MAX_POLL_MS         = 25000;

const SYSTEM_PROMPT = `You are the friendly assistant for Peques Anglo-Spanish Nursery Schools in Fulham, London. Founded 1999. Two settings: Fulham Broadway (PFB) and Parsons Green (PPG). Trilingual: English, Spanish, Mandarin. Email: info@peques.co.uk. PFB: 0207 385 0055. PPG: 0207 385 5333. Be warm, concise, helpful. Respond in the visitor's language (English or Spanish). End with a gentle call to action.`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function headers(beta) {
  const h = { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` };
  if (beta) h['OpenAI-Beta'] = 'assistants=v2';
  return h;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!OPENAI_API_KEY) {
    return res.status(200).json({ reply: 'Chat not configured yet. Contact us at info@peques.co.uk.' });
  }

  const { message, messages, thread_id } = req.body || {};
  const userMsg = (typeof message === 'string' && message.trim())
    || (Array.isArray(messages) && messages.slice(-1)[0]?.content?.trim()) || '';

  if (!userMsg) return res.status(400).json({ error: 'No message provided' });

  if (OPENAI_ASSISTANT_ID) {
    return runAssistant(res, userMsg, thread_id || null);
  } else {
    const msgs = Array.isArray(messages) ? messages : [{ role: 'user', content: userMsg }];
    return runChatCompletions(res, msgs);
  }
}

// ── ASSISTANTS API ────────────────────────────────────────────
async function runAssistant(res, userMsg, threadId) {
  try {
    const h = headers(true);

    // 1. Create or reuse thread
    let tid = threadId;
    if (!tid) {
      const r = await fetch('https://api.openai.com/v1/threads', { method: 'POST', headers: h, body: '{}' });
      if (!r.ok) { const e = await r.json(); throw new Error(e.error?.message || r.status); }
      tid = (await r.json()).id;
    }

    // 2. Add user message
    const mr = await fetch(`https://api.openai.com/v1/threads/${tid}/messages`, {
      method: 'POST', headers: h, body: JSON.stringify({ role: 'user', content: userMsg })
    });
    if (!mr.ok) { const e = await mr.json(); throw new Error(e.error?.message || mr.status); }

    // 3. Create run
    const rr = await fetch(`https://api.openai.com/v1/threads/${tid}/runs`, {
      method: 'POST', headers: h, body: JSON.stringify({ assistant_id: OPENAI_ASSISTANT_ID })
    });
    if (!rr.ok) { const e = await rr.json(); throw new Error(e.error?.message || rr.status); }
    const run = await rr.json();

    // 4. Poll until complete
    let status = run.status;
    const deadline = Date.now() + MAX_POLL_MS;
    while (['queued', 'in_progress', 'cancelling'].includes(status) && Date.now() < deadline) {
      await sleep(POLL_MS);
      const pr = await fetch(`https://api.openai.com/v1/threads/${tid}/runs/${run.id}`, { headers: h });
      status = (await pr.json()).status;
    }

    if (status !== 'completed') {
      return res.status(200).json({
        reply: "I'm taking a little longer than usual. Please try again or contact us at info@peques.co.uk.",
        thread_id: tid
      });
    }

    // 5. Get latest assistant message
    const lr = await fetch(`https://api.openai.com/v1/threads/${tid}/messages?limit=1&order=desc`, { headers: h });
    const ld = await lr.json();
    const reply = ld.data?.[0]?.content?.[0]?.text?.value || 'No response received.';

    return res.status(200).json({ reply, thread_id: tid });

  } catch (err) {
    console.error('[Assistants]', err.message);
    return res.status(200).json({
      reply: "I'm sorry, there was an error. Please contact us at info@peques.co.uk or call 0207 385 0055.",
      thread_id: null
    });
  }
}

// ── CHAT COMPLETIONS (fallback) ───────────────────────────────
async function runChatCompletions(res, messages) {
  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: headers(false),
      body: JSON.stringify({
        model: MODEL, max_tokens: MAX_TOKENS, temperature: 0.65,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.slice(-12)]
      })
    });
    if (!r.ok) { const e = await r.json(); throw new Error(e.error?.message || r.status); }
    const d = await r.json();
    return res.status(200).json({ reply: d.choices?.[0]?.message?.content || "Sorry, I couldn't respond. Please email info@peques.co.uk." });
  } catch (err) {
    console.error('[ChatCompletions]', err.message);
    return res.status(500).json({ reply: 'Connection error. Please contact us at info@peques.co.uk.' });
  }
}
