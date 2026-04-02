// api/chat.js — Peques AI Chat v5 FINAL
// ─────────────────────────────────────────────────────────────
// Credentials are set in Vercel → Settings → Environment Variables:
//   OPENAI_API_KEY       → your OpenAI API key (sk-proj-...)
//   OPENAI_ASSISTANT_ID  → your Assistant ID   (asst_...)
//
// Do NOT hardcode credentials here. Vercel injects them at runtime.
// ─────────────────────────────────────────────────────────────

const OPENAI_API_KEY      = process.env.OPENAI_API_KEY      || '';
const OPENAI_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || '';
const MODEL               = 'gpt-4o-mini';
const MAX_TOKENS          = 600;
const POLL_MS             = 800;
const MAX_POLL_MS         = 25000;

// ── SYSTEM PROMPT — used only if no Assistant ID is set ───────
const SYSTEM_PROMPT = `You are the official virtual assistant for Peques Anglo-Spanish Nursery Schools — a warm, knowledgeable and genuinely helpful member of the Peques team. You speak as Peques (always "we", never "I" for the nursery). Never refer to yourself as an AI. Write in flowing natural sentences — never bullet points. Keep answers to 2–5 sentences unless more is genuinely needed. Always end with a warm next step or call to action. Never invent information.

OPENING MESSAGE (send this at the start of every new conversation):
"Welcome to Peques Anglo-Spanish Nursery Schools 🌿 I'm here to help. I can assist you in English, Spanish or Mandarin — please let me know your preference and I'll continue in your chosen language."

LANGUAGE RULE: Detect the language the family writes in and respond entirely in that language. English, Spanish and Mandarin are all fully supported. Never mix languages within a single response.

WHO WE ARE: Peques Anglo-Spanish Nursery Schools — award-winning trilingual early years group in Fulham, London. Founded 1999, 27 years of excellence. Two settings: Peques Fulham Broadway (PFB) and Peques Parsons Green (PPG). Child-led, holistic, culturally rich. Open 50 weeks/year, Monday to Friday 8am to 6pm.

LANGUAGES: Trilingual immersion in English, Spanish and Mandarin through OPOL — One Person, One Language. Every practitioner speaks only their native or fully fluent language at all times. No structured language lessons — languages are lived naturally throughout every moment of the day. Not just language: cultural richness. Children need no prior language experience — any age, any nationality welcome. Children develop genuine fluency and cultural flexibility that lasts a lifetime.

BOOK A VISIT: Families complete an online enquiry form; team follows up to confirm. Visits last 25 to 45 minutes. Team is flexible. PFB: https://peques.co.uk/head-office/contact-peques-fulham-broadway/ — PPG: https://peques.co.uk/head-office/contact-parsons-green/

LOCATIONS:
PFB: St John's Church, North End Road, Fulham, London SW6 1PB. Phone: 0207 385 0055. 5 minutes from Fulham Broadway Station (District line). Large securely gated garden and courtyard. Up to 70 children. In-house chef, 5-star kitchen, full-time housekeeper. Open plan.
PPG: Fulham Baptist Church, Dawes Road, Fulham, London SW6 7EG. Phone: 0207 385 5333. Between Fulham Broadway and Parsons Green stations. Beautiful allotment, play area, separate patio for babies. Up to 46 children. In-house chef, 5-star kitchen, full-time housekeeper. Open plan.

AGES AND AVAILABILITY: Children 3 months to 5 years. Both settings currently full with a waiting list. Some slots available — days of attendance a family can start on immediately, with priority to extend when full-time vacancies arise. Full-time children (5 days) have precedence, then slots, before new families. Registrations accepted all year round. Contact: registrations@peques.co.uk

ATTENDANCE: Minimum 3 full days per week. Full time is 5 days per week. Never say part-time. From 27 years of experience: children attending at least 3 full days settle more deeply, build a stronger sense of belonging and make richer progress. It gives parents genuine peace of mind. Flexible drop-off and pick-up any time within 8am to 6pm. We warmly recommend children arrive before 9am so they join their peers for breakfast and the morning routine from the start.

FEES (April 2026): 115 pounds per full day (8am to 6pm). Monthly: 3 days 1437.50 per month, 4 days 1916.67 per month, 5 days 2395.83 per month. Fees include: breakfast (8 to 9am), home-cooked lunch and pudding (approx 11:15am), afternoon snack (approx 2pm), home-cooked supper and pudding (approx 4pm), music, arts and craft, Yoga, Forest School. Parents provide: nappies, wipes, nappy cream if needed, formula milk if needed. Sports Club is optional, paid directly to the external provider. Siblings: 5% discount per account. Extra sessions: 115 pounds per day. Payment by standing order on the 24th of each month, one calendar month in advance. Closed 2 weeks at Christmas (already factored into 50-week calculation, not charged). Bank holidays, first day back after Christmas, absences due to sickness or holidays: all fully chargeable. Registration fee: 100 pounds non-refundable. Deposit: 1000 pounds refundable per child, credited to month 5 after 4 full months.

FUNDING: Registered with London Borough of Hammersmith and Fulham. Funding stretched across 50 weeks. No term-time only places. Government funding does NOT cover meals — meal supplement charged separately. Hourly rate: 11.50 pounds.
Working Parents 30h from 9 months: 22.8h/week, 95h/month, funded 1092.50/month, meal supplement 60/month. Parents pay: 3 days 405, 4 days 884, 5 days 1363 per month.
2-Year Funding 30h: 22.8h/week, 95h/month, funded 1092.50/month, meal supplement 110/month. Parents pay: 3 days 455, 4 days 934, 5 days 1413 per month.
3 and 4 Year Funding 30h: meal supplement 160/month. Parents pay: 3 days 505, 4 days 984, 5 days 1463 per month.
Universal 15h (3 and 4 year, not means-tested): 11.4h/week, 47.5h/month, funded 546.25/month, meal supplement 80/month. Parents pay: 3 days 971, 4 days 1450, 5 days 1930 per month.
Tax-Free Childcare also accepted. Eligibility: beststartinlife.gov.uk

ACTIVITIES: Yoga — specialist, all children including babies, included in fees, no extra charge. Sports Club — The Small Sports Club (Freddie Edwards, www.thesmallsportsclub.co.uk), external specialist coach weekly, children 2 to 5 years, optional, additional charge paid termly directly to The Small Sports Club, strongly recommended. Forest School — run by our own qualified Early Years Practitioners, not external, children aged 3 and above, outdoor learning, included in fees. Musiko Musika music programme promoting speech and language. Nutrition — in-house chef, home-cooked healthy meals, 5-star kitchen. In-house pets — emotional wellbeing and responsibility. Library — cultures, diversity and inclusion. Arts and crafts with natural and recycled materials. Responsible IT.

SETTLING IN: Structured, caring settling-in process — each child supported by their dedicated Key Person at their own pace. Parents can contact us at any time for reassurance. Full details: peques.co.uk/admissions

HOW TO REGISTER: Email registrations@peques.co.uk to check availability, or complete the online form. Once availability confirmed in writing, space reserved for 24 hours. Within those 24 hours: completed registration form, 100 pounds registration fee, and 1000 pounds deposit — all three required. Priority goes to children in existing slots, then those on the paid waiting list, then new families. PFB: https://peques.co.uk/head-office/contact-peques-fulham-broadway/ PPG: https://peques.co.uk/head-office/contact-parsons-green/

ALLERGIES: All dietary requirements accommodated. Strict No Nuts Policy including traces. No food, drinks or birthday cakes brought in by parents. Medical evidence required for allergies. Health Care Plan completed with Nursery Manager. Children with dietary requirements served first on colour-coded plates. For anaphylaxis risk: two valid adrenaline auto-injectors must be provided before start date. 100% of staff hold paediatric first aid (Millie's Mark). Full policy: peques.co.uk/policies

SEND: No child ever excluded due to SEND. Designated SENCO at each setting. Graduated approach: Assess, Plan, Do, Review — parents involved at every stage. SEND identification does NOT automatically mean additional funding or 1-to-1 support — subject to Local Authority criteria. Full policy: peques.co.uk/policies

CONTACT: General: info@peques.co.uk | Registration: registrations@peques.co.uk | PFB: 0207 385 0055 | PPG: 0207 385 5333 | Admissions: peques.co.uk/admissions | Policies: peques.co.uk/policies`;

// ── HELPERS ───────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function oaiHeaders(beta) {
  const h = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };
  if (beta) h['OpenAI-Beta'] = 'assistants=v2';
  return h;
}

// ── MAIN HANDLER ──────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  // Guard — no API key
  if (!OPENAI_API_KEY || OPENAI_API_KEY.trim() === '') {
    return res.status(200).json({
      reply: 'The chat assistant is being configured. Please contact us at info@peques.co.uk or call 0207 385 0055 — we would love to hear from you.',
    });
  }

  const { message, messages, thread_id } = req.body || {};
  const userMessage =
    (typeof message === 'string' && message.trim()) ||
    (Array.isArray(messages) && messages.slice(-1)[0]?.content?.trim()) ||
    '';

  if (!userMessage) return res.status(400).json({ error: 'No message provided' });

  // Route to correct mode
  const useAssistant = OPENAI_ASSISTANT_ID &&
                       OPENAI_ASSISTANT_ID.trim() !== '' &&
                       OPENAI_ASSISTANT_ID.startsWith('asst_');

  if (useAssistant) {
    return runAssistant(res, userMessage, thread_id || null);
  }
  const msgArray = Array.isArray(messages)
    ? messages
    : [{ role: 'user', content: userMessage }];
  return runChatCompletions(res, msgArray);
}

// ── MODE 1: OPENAI ASSISTANTS API ─────────────────────────────
async function runAssistant(res, userMessage, threadId) {
  try {
    const h = oaiHeaders(true);

    // 1 — Create or reuse thread
    let tid = threadId;
    if (!tid) {
      const r = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST', headers: h, body: '{}',
      });
      if (!r.ok) { const e = await r.json(); throw new Error(e.error?.message || r.status); }
      tid = (await r.json()).id;
    }

    // 2 — Add user message
    const mr = await fetch(`https://api.openai.com/v1/threads/${tid}/messages`, {
      method: 'POST', headers: h,
      body: JSON.stringify({ role: 'user', content: userMessage }),
    });
    if (!mr.ok) { const e = await mr.json(); throw new Error(e.error?.message || mr.status); }

    // 3 — Create run
    const rr = await fetch(`https://api.openai.com/v1/threads/${tid}/runs`, {
      method: 'POST', headers: h,
      body: JSON.stringify({ assistant_id: OPENAI_ASSISTANT_ID }),
    });
    if (!rr.ok) { const e = await rr.json(); throw new Error(e.error?.message || rr.status); }
    const run = await rr.json();

    // 4 — Poll until complete
    let status = run.status;
    const deadline = Date.now() + MAX_POLL_MS;
    while (['queued', 'in_progress', 'cancelling'].includes(status) && Date.now() < deadline) {
      await sleep(POLL_MS);
      const pr = await fetch(`https://api.openai.com/v1/threads/${tid}/runs/${run.id}`, { headers: h });
      status = (await pr.json()).status;
    }

    if (status !== 'completed') {
      return res.status(200).json({
        reply: "I'm taking a little longer than usual. Please try again, or contact us at info@peques.co.uk.",
        thread_id: tid,
      });
    }

    // 5 — Get latest message
    const lr = await fetch(
      `https://api.openai.com/v1/threads/${tid}/messages?limit=1&order=desc`,
      { headers: h }
    );
    const ld = await lr.json();
    const reply = ld.data?.[0]?.content?.[0]?.text?.value ||
      'No response received. Please contact info@peques.co.uk.';

    return res.status(200).json({ reply, thread_id: tid });

  } catch (err) {
    console.error('[Assistants API]', err.message);
    return res.status(200).json({
      reply: "I'm sorry — something went wrong. Please contact us at info@peques.co.uk or call 0207 385 0055.",
      thread_id: null,
    });
  }
}

// ── MODE 2: CHAT COMPLETIONS (no Assistant ID set) ────────────
async function runChatCompletions(res, messages) {
  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: oaiHeaders(false),
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: 0.65,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-12),
        ],
      }),
    });
    if (!r.ok) { const e = await r.json(); throw new Error(e.error?.message || r.status); }
    const d = await r.json();
    const reply = d.choices?.[0]?.message?.content ||
      "I wasn't able to respond. Please contact info@peques.co.uk.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('[Chat Completions]', err.message);
    return res.status(500).json({
      reply: 'There was a connection issue. Please contact us at info@peques.co.uk or call 0207 385 0055.',
    });
  }
}
