const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const pdfParse = require('pdf-parse');

// ── Initialise Gemini client ───────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL = 'gemini-1.5-flash'; // Free-tier model

// ── Extract plain text from a PDF file ────────────────────────
async function extractTextFromPDF(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (err) {
    console.warn('⚠️  PDF parse failed, using empty string:', err.message);
    return '';
  }
}

// ── Build the prompt ──────────────────────────────────────────
function buildPrompt(resumeText, jobDescription) {
  const jdSection = jobDescription?.trim()
    ? `JOB DESCRIPTION:\n${jobDescription.trim()}`
    : 'JOB DESCRIPTION: Not provided — extract skills only and set matchScore to null.';

  return `You are an expert technical recruiter AI assistant.

Analyze the resume text below and ${jobDescription?.trim() ? 'compare it against the job description to produce a match score' : 'extract key skills'}.

RESUME TEXT:
${resumeText.slice(0, 8000)}

${jdSection}

Instructions:
- Extract the top 6–12 technical and professional skills mentioned in the resume.
- ${jobDescription?.trim()
    ? 'Give a matchScore (0–100) representing how well the candidate fits the job description. Be realistic: 85+ = excellent fit, 60–84 = good, 40–59 = partial, below 40 = poor.'
    : 'Set matchScore to null since no job description was provided.'}
- Return ONLY a valid JSON object, with no markdown, no explanation, no code fences.

Required format:
{"skills":["skill1","skill2"],"matchScore":75}`;
}

// ── Main screener function ─────────────────────────────────────
/**
 * Screen a candidate's resume against an optional job description.
 * @param {string} resumeFilePath - Absolute path to the uploaded PDF
 * @param {string} jobDescription - The JD text (can be empty)
 * @returns {{ skills: string[], matchScore: number|null }}
 */
async function screenResume(resumeFilePath, jobDescription = '') {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'PASTE_YOUR_KEY_HERE') {
    console.warn('⚠️  GEMINI_API_KEY not set — skipping screening.');
    return { skills: [], matchScore: null };
  }

  try {
    // 1. Extract text from PDF
    const resumeText = await extractTextFromPDF(resumeFilePath);

    if (!resumeText.trim()) {
      console.warn('⚠️  No text extracted from PDF.');
      return { skills: [], matchScore: null };
    }

    // 2. Call Gemini
    const model = genAI.getGenerativeModel({ model: MODEL });
    const prompt = buildPrompt(resumeText, jobDescription);

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // 3. Parse JSON — strip any accidental markdown fences
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const skills = Array.isArray(parsed.skills)
      ? parsed.skills.map((s) => String(s).trim()).filter(Boolean)
      : [];

    const matchScore =
      parsed.matchScore !== null && parsed.matchScore !== undefined
        ? Math.min(100, Math.max(0, Number(parsed.matchScore)))
        : null;

    console.log(`✅ Screener: score=${matchScore}, skills=[${skills.join(', ')}]`);
    return { skills, matchScore };

  } catch (err) {
    console.error('❌ Gemini screener error:', err.message);
    return { skills: [], matchScore: null };
  }
}

module.exports = { screenResume };
