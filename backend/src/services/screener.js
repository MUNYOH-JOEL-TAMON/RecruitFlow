const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// ── Initialise Gemini client ───────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL = 'gemini-1.5-flash';

// ── Resolve the absolute path to an uploaded file ─────────────
// candidate.resumeUrl is stored as '/uploads/filename.pdf'
// On Windows, path.join with a leading '/' treats it as drive-root — we strip it.
function resolveUploadPath(resumeUrl) {
  const relative = resumeUrl.replace(/^[\\/]+/, ''); // strip leading / or \
  return path.join(__dirname, '../../', relative);
}

// ── Extract plain text from a PDF file ────────────────────────
async function extractTextFromPDF(filePath) {
  const buffer = fs.readFileSync(filePath); // throws if file not found — surfaces real error
  const data = await pdfParse(buffer);
  return data.text || '';
}

// ── Build the prompt ──────────────────────────────────────────
function buildPrompt(resumeText, jobDescription) {
  const hasJD = jobDescription?.trim().length > 0;
  const jdSection = hasJD
    ? `JOB DESCRIPTION:\n${jobDescription.trim()}`
    : 'JOB DESCRIPTION: Not provided — extract skills only and set matchScore to null.';

  return `You are an expert technical recruiter AI assistant.

Analyze the resume text below and ${hasJD ? 'compare it against the job description to produce a match score' : 'extract key skills'}.

RESUME TEXT:
${resumeText.slice(0, 8000)}

${jdSection}

Instructions:
- Extract the top 6–12 technical and professional skills mentioned in the resume.
- ${hasJD
    ? 'Give a matchScore (0–100) representing how well the candidate fits the job description. 85+ = excellent fit, 60–84 = good, 40–59 = partial, below 40 = poor.'
    : 'Set matchScore to null since no job description was provided.'}
- Return ONLY a valid JSON object. No markdown, no explanation, no code fences.

Required format:
{"skills":["skill1","skill2"],"matchScore":75}`;
}

// ── Extract JSON from Gemini's response (handles stray text) ──
function extractJSON(raw) {
  // Try direct parse first
  try {
    return JSON.parse(raw);
  } catch (_) {}

  // Strip markdown fences and retry
  const stripped = raw.replace(/```json|```/gi, '').trim();
  try {
    return JSON.parse(stripped);
  } catch (_) {}

  // Regex: find first {...} block in the response
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) {
    return JSON.parse(match[0]);
  }

  throw new Error(`Could not extract JSON from Gemini response: ${raw.slice(0, 200)}`);
}

// ── Main screener function ─────────────────────────────────────
/**
 * Screen a candidate's resume against an optional job description.
 * @param {string} resumeUrl  - The stored URL e.g. '/uploads/filename.pdf'
 * @param {string} jobDescription - The JD text (can be empty)
 * @returns {{ skills: string[], matchScore: number|null }}
 */
async function screenResume(resumeUrl, jobDescription = '') {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'PASTE_YOUR_KEY_HERE') {
    throw new Error('GEMINI_API_KEY is not configured in .env');
  }

  // 1. Resolve absolute file path (fixes Windows path bug)
  const filePath = resolveUploadPath(resumeUrl);
  console.log(`📄 Reading resume from: ${filePath}`);

  // 2. Extract text from PDF (throws if file missing)
  const resumeText = await extractTextFromPDF(filePath);

  if (!resumeText.trim()) {
    throw new Error('No text could be extracted from the PDF. The file may be image-based or corrupted.');
  }

  console.log(`📝 Extracted ${resumeText.length} characters from PDF`);

  // 3. Call Gemini
  const model = genAI.getGenerativeModel({ model: MODEL });
  const prompt = buildPrompt(resumeText, jobDescription);
  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();

  console.log(`🤖 Gemini raw response: ${raw.slice(0, 300)}`);

  // 4. Parse JSON robustly
  const parsed = extractJSON(raw);

  const skills = Array.isArray(parsed.skills)
    ? parsed.skills.map((s) => String(s).trim()).filter(Boolean)
    : [];

  const matchScore =
    parsed.matchScore !== null && parsed.matchScore !== undefined && !isNaN(Number(parsed.matchScore))
      ? Math.min(100, Math.max(0, Number(parsed.matchScore)))
      : null;

  console.log(`✅ Screener done: score=${matchScore}, skills=[${skills.join(', ')}]`);
  return { skills, matchScore };
}

module.exports = { screenResume, resolveUploadPath };
