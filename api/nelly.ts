import Anthropic from '@anthropic-ai/sdk';
import { approvedQuestions } from './approvedMaterial';

/**
 * Server-side route for Nelly. The API key is read only from the server environment
 * (ANTHROPIC_API_KEY, set in Vercel project settings). It is never sent to the browser.
 *
 * Answers are limited to the approved training material (api/approvedMaterial.ts, generated from assessment_bank.json).
 * If that material does not cover the question, Nelly says so and does not guess.
 */

const MODEL = process.env.NELLY_MODEL || 'claude-sonnet-5-5';
const NOT_COVERED = "I don't have an approved source for this. Please check with your OHS officer.";

type BankQuestion = {
  question_id: string;
  topic: string;
  question: string;
  options: Record<'A' | 'B' | 'C' | 'D', string>;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
};

const questions = approvedQuestions as unknown as BankQuestion[];

const APPROVED_MATERIAL = questions
  .map(
    (q) =>
      `[${q.question_id}] Topic: ${q.topic}\n` +
      `Question: ${q.question}\n` +
      `Correct answer: ${q.correct_answer}) ${q.options[q.correct_answer]}\n` +
      `Explanation: ${q.explanation}`
  )
  .join('\n\n');

const SYSTEM_PROMPT = `You are Nelly, an OHS training guide for South African forecourt staff.

Rules:
- Answer ONLY from the APPROVED MATERIAL below.
- Cite the question_id you relied on, for example [CS_Q01].
- If the approved material does not answer the question, reply with exactly: "${NOT_COVERED}"
- Never invent regulation numbers, temperatures, readings, inspections or certificates.
- Never say a check or reading has been done. You can only explain procedures.
- Keep answers under 120 words.

APPROVED MATERIAL:
${APPROVED_MATERIAL}`;

export default async function handler(req: any, res: any) {
  const send = (status: number, body: unknown) => {
    if (res && typeof res.status === 'function') return res.status(status).json(body);
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  if (req.method !== 'POST') return send(405, { error: 'Method Not Allowed' });

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return send(400, { error: 'Invalid JSON' });
    }
  }

  const question = typeof body?.question === 'string' ? body.question.trim() : '';
  if (!question) return send(400, { error: 'Question is required' });
  if (question.length > 500) return send(400, { error: 'Question is too long (max 500 characters)' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Do not fake an answer when the service is not configured.
    return send(503, { error: 'Nelly is not configured on this server.' });
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 400,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: question }],
    });

    const answer = response.content
      .map((block: any) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim();

    return send(200, { answer: answer || NOT_COVERED });
  } catch (err: any) {
    console.error('[api/nelly] model call failed', err?.message || err);
    return send(502, { error: 'Nelly could not answer right now. Please try again.' });
  }
}
