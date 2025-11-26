# Google Gemini AI Integration Guide

> **Note:** This document provides detailed information about the Google Gemini AI integration used in the CueR.ai interactive resume application.

---

## Overview

This application uses **Google Gemini 2.5 Flash** for:
- Real-time conversational AI (chat interface)
- Interview evaluation (determining if user has passed the "interview")
- Resume analysis and persona generation (from uploaded files)

---

## Why Gemini?

Gemini offers several advantages for this use case:
- **Cost-effective:** $0.10 per 1M input tokens (cheapest tier)
- **Fast responses:** Optimized for speed
- **Multimodal support:** Handles text, images, PDFs natively
- **JSON mode:** Structured output for evaluation tasks
- **Generous free tier:** Great for portfolio projects

---

## Getting Started

### 1. Obtain an API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key or use an existing one
5. **Important:** Set usage limits to prevent unexpected charges

### 2. Configure Environment Variables

Create a `.env.local` file:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Never commit this file to Git!** It's already in `.gitignore`.

### 3. Install Dependencies

The project uses the official Gemini SDK:
```bash
npm install @google/genai
```

---

## Architecture

### Service Layer: `services/geminiService.ts`

The Gemini integration is abstracted into three main functions:

#### 1. `askChris()` - Chat Completion

```typescript
export const askChris = async (
  history: { role: 'user' | 'model'; text: string }[],
  customInstruction?: string
): Promise<string>
```

**Purpose:** Handles conversational interactions with the AI persona.

**Parameters:**
- `history`: Array of previous chat messages
- `customInstruction`: Optional system instruction (replaces default persona)

**Returns:** AI-generated response as a string

**Example Usage:**
```typescript
const history = [
  { role: 'user', text: 'Why did you leave surgery?' }
];

const response = await askChris(history);
// Response: "I transitioned to AI because..."
```

**Configuration:**
```typescript
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',  // Model selection
  contents: contents,          // Chat history
  config: {
    systemInstruction: CHRIS_PERSONA,  // Persona definition
  }
});
```

---

#### 2. `evaluateInterview()` - Structured JSON Output

```typescript
export const evaluateInterview = async (
  history: { role: 'user' | 'model'; text: string }[]
): Promise<boolean>
```

**Purpose:** Analyzes conversation to determine if user has "passed" the interview.

**How it works:**
1. Takes full conversation history
2. Uses Gemini's JSON mode for structured output
3. Evaluates against predefined criteria
4. Returns `true` if user passed, `false` otherwise

**Evaluation Criteria:**
- User asked 3+ thoughtful questions
- User expressed hiring/collaboration interest
- User complimented the application creativity

**Example JSON Response:**
```json
{
  "pass": true
}
```

**Configuration:**
```typescript
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: [{ role: 'user', parts: [{ text: analysisPrompt }] }],
  config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        pass: { type: Type.BOOLEAN }
      }
    }
  }
});
```

---

#### 3. `generatePersonaFromResume()` - Multimodal Input

```typescript
export const generatePersonaFromResume = async (
  file: File
): Promise<string>
```

**Purpose:** Analyzes uploaded resume (PDF, image, text) and generates AI persona instructions.

**Workflow:**
1. **Security Check** (Phase 1)
   - Analyzes file for malicious content
   - Checks for prompt injection attacks
   - Returns JSON: `{ "isSafe": boolean }`

2. **Persona Generation** (Phase 2)
   - Extracts candidate information
   - Creates system instruction for AI role-play
   - Adapts tone to profession
   - Includes semantic formatting tags

**Supported File Types:**
- `image/png`
- `image/jpeg`
- `application/pdf`
- `text/markdown`
- `text/plain`

**Example Generated Persona:**
```
You are Jane Smith. You are a Software Engineer with expertise in Python, React, and Machine Learning.
Your background includes 5 years at Tech Corp building scalable web applications.
You are currently answering questions from a recruiter.

Use [TECH]Python[/TECH] when mentioning technical skills.
Use [SOUL]passionate about clean code[/SOUL] for mission statements.
```

---

## API Quota Management

### Free Tier Limits

Google AI Studio provides a generous free tier:
- **15 requests per minute**
- **1,500 requests per day**
- **1 million requests per month**

**Monitor usage:** [Google AI Studio Console](https://aistudio.google.com/app/apikey)

### Rate Limiting

Currently, the application has **no client-side rate limiting**. This is a known limitation (see [SECURITY.md](SECURITY.md)).

**Recommended implementation:**
```typescript
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds
let lastRequestTime = 0;

const handleAsk = async () => {
  const now = Date.now();
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    alert('Please wait before sending another message.');
    return;
  }
  lastRequestTime = now;
  // ... proceed with request
};
```

---

## Model Selection

### Available Gemini Models

| Model | Use Case | Cost (Input) | Speed |
|-------|----------|--------------|-------|
| **gemini-2.5-flash** | General chat, fast responses | $0.10/1M tokens | ⚡⚡⚡ |
| **gemini-2.0-flash-exp** | Experimental features | Free (limited) | ⚡⚡⚡ |
| **gemini-1.5-pro** | Complex reasoning | $1.25/1M tokens | ⚡⚡ |
| **gemini-1.5-flash** | Previous generation | $0.075/1M tokens | ⚡⚡⚡ |

**Current Choice:** `gemini-2.5-flash`
- Best balance of speed, cost, and quality
- Supports all features needed (JSON mode, multimodal)

---

## Advanced Features

### 1. Multimodal Input (Images & PDFs)

Gemini natively supports vision capabilities:

```typescript
const filePart = await fileToPart(file);

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: [
    {
      role: 'user',
      parts: [
        filePart,  // Image or PDF
        { text: 'Analyze this resume' }
      ]
    }
  ]
});
```

**File Conversion:**
```typescript
const fileToPart = async (file: File) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    if (file.type === 'text/plain' || file.name.endsWith('.md')) {
      reader.onloadend = () => {
        resolve({ text: reader.result });
      };
      reader.readAsText(file);
    } else {
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve({
          inlineData: {
            data: base64,
            mimeType: file.type,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  });
};
```

---

### 2. JSON Mode (Structured Output)

Force Gemini to return valid JSON:

```typescript
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: [...],
  config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        skills: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        yearsExperience: { type: Type.NUMBER }
      },
      required: ["name", "skills"]
    }
  }
});

const data = JSON.parse(response.text);
console.log(data.name); // Guaranteed to exist
```

---

### 3. System Instructions (Persona)

The `CHRIS_PERSONA` constant defines the AI's behavior:

```typescript
export const CHRIS_PERSONA = `
ROLE:
You are Christopher Camarata, MD. You are a General Surgeon who pivoted to become an AI Engineer.

CONTEXT:
You are answering questions from a recruiter via a chat interface.

TONE & STYLE:
- Professional, visionary, yet accessible.
- Concise (under 3 sentences usually).

SEMANTIC FORMATTING:
- [CLUE]...[/CLUE] : Secret hints or Easter eggs
- [TECH]...[/TECH] : Technical tools (e.g., [TECH]React[/TECH])
- [SOUL]...[/SOUL] : Deep passion or mission
- [WARN]...[/WARN] : Security warnings
- [CUER]...[/CUER] : CueR.ai project details
- [HOBBY]...[/HOBBY] : 3D printing and maker interests
`;
```

**Why this works:**
- Clear role definition prevents AI confusion
- Formatting tags enable custom styling in UI
- Concise guidelines improve response quality

---

## Error Handling

### Current Implementation

```typescript
try {
  const response = await ai.models.generateContent({...});
  return response.text || "[WARN]No response generated[/WARN]";
} catch (error) {
  console.error("Gemini Error:", error);
  return "[WARN]My digital synapse misfired. Please try again.[/WARN]";
}
```

**User-facing errors:**
- Missing API key: `"[WARN]I'd love to answer, but my neural link (API Key) seems to be disconnected.[/WARN]"`
- API failure: `"[WARN]My digital synapse misfired. Please try again.[/WARN]"`
- No response: `"[WARN]I'm pondering that deeply... (No response generated)[/WARN]"`

---

## Performance Optimization

### 1. Response Streaming (Future Enhancement)

Currently not implemented, but Gemini supports streaming:

```typescript
const stream = await ai.models.generateContentStream({
  model: 'gemini-2.5-flash',
  contents: [...],
});

for await (const chunk of stream) {
  const chunkText = chunk.text;
  // Update UI incrementally
  setResponse(prev => prev + chunkText);
}
```

**Benefits:**
- Faster perceived response time
- Better UX for long responses
- Reduced waiting time

---

### 2. Caching System Instructions

For repeated calls with the same persona, Gemini offers caching:

```typescript
const cachedContent = await client.cacheContent({
  model: 'gemini-2.5-flash',
  systemInstruction: CHRIS_PERSONA,
  ttlSeconds: 3600, // Cache for 1 hour
});

// Use cached instruction
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: [...],
  cachedContent: cachedContent.name,
});
```

**Cost Savings:**
- Cached input tokens: $0.01/1M (90% discount)
- Reduces latency

---

## Security Best Practices

### ⚠️ Current Limitations

See [SECURITY.md](SECURITY.md) for full analysis.

**Key issues:**
1. API key exposed in client bundle
2. No backend API proxy
3. Client-side security checks (bypassable)

### 🔒 Production-Ready Solution

**Use Vercel Serverless Functions:**

Create `/api/gemini-chat.ts`:
```typescript
import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (await isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  // Server-side API key (never exposed)
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  const { messages } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: messages,
    });

    res.json({ response: response.text });
  } catch (error) {
    res.status(500).json({ error: 'AI request failed' });
  }
}
```

**Update client code:**
```typescript
const askChris = async (history) => {
  const response = await fetch('/api/gemini-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history }),
  });

  const data = await response.json();
  return data.response;
};
```

---

## Testing

### Mock Gemini Responses

See `tests/services/geminiService.test.ts`:

```typescript
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: 'Mock response from Gemini',
      }),
    },
  })),
}));
```

### Test Coverage

The test suite covers:
- ✅ API key validation
- ✅ Error handling
- ✅ Chat history management
- ✅ JSON mode parsing
- ✅ File upload processing
- ✅ Security validation

---

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| `API_KEY not found` | Ensure `.env.local` exists and is loaded |
| `403 Forbidden` | Check API key is valid in AI Studio |
| `429 Rate Limited` | Wait or increase quota in Google Cloud |
| `500 Server Error` | Check Gemini API status page |
| Empty response | Add fallback: `response.text \|\| 'No response'` |

### Debugging

Enable detailed logging:
```typescript
const response = await ai.models.generateContent({...});
console.log('Full response:', JSON.stringify(response, null, 2));
```

---

## Cost Estimation

### Example Usage

**Scenario:** 1000 users, 5 messages each

- Average message: 100 tokens
- Total input: 500,000 tokens
- Cost: $0.05 (input) + $0.20 (output) = **$0.25 total**

**Comparison:**
- Gemini Flash: $0.25
- Claude Haiku: $12.50
- GPT-4: $150.00

**Gemini is 50-600x cheaper than alternatives.**

---

## Additional Resources

- **Official Docs:** [ai.google.dev/docs](https://ai.google.dev/docs)
- **API Reference:** [ai.google.dev/api](https://ai.google.dev/api)
- **Pricing:** [ai.google.dev/pricing](https://ai.google.dev/pricing)
- **AI Studio:** [aistudio.google.com](https://aistudio.google.com)
- **Community:** [Google AI Discord](https://discord.gg/google-ai)

---

## Next Steps

1. **Optimize Prompts** - Refine `CHRIS_PERSONA` for better responses
2. **Add Streaming** - Implement real-time response streaming
3. **Backend API** - Move to serverless functions for production
4. **Caching** - Reduce costs with context caching
5. **Analytics** - Track token usage and costs

---

## Related Documentation

- **[claude.md](claude.md)** - Integrate Claude AI as an alternative
- **[SECURITY.md](SECURITY.md)** - Security analysis and best practices
- **[README.md](README.md)** - Full project documentation

---

**Questions?**
- Email: chris@cuer.ai
- GitHub Issues: [Create an issue](https://github.com/Camaraterie/CueR_Interview/issues)
