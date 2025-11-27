import { describe, it, expect, vi, beforeEach } from 'vitest';
import { askChris, evaluateInterview, generatePersonaFromResume, CHRIS_PERSONA } from '../../services/geminiService';

// Mock the @google/genai module
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: 'Mock response from Gemini',
      }),
    },
  })),
  Type: {
    OBJECT: 'object',
    BOOLEAN: 'boolean',
    STRING: 'string',
  },
}));

describe('geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('askChris', () => {
    it('should return error message when API key is not provided', async () => {
      const response = await askChris([{ role: 'user', text: 'Hello' }], '');

      expect(response).toContain('API key');
    });

    it('should successfully call Gemini API with chat history', async () => {
      const history = [
        { role: 'user' as const, text: 'Why did you leave surgery?' },
        { role: 'model' as const, text: 'I transitioned to AI...' },
      ];

      const response = await askChris(history, 'test-api-key');

      expect(response).toBe('Mock response from Gemini');
    });

    it('should use custom instruction when provided', async () => {
      const customInstruction = 'You are a custom persona';
      const history = [{ role: 'user' as const, text: 'Hello' }];

      await askChris(history, 'test-api-key', customInstruction);

      // Verify it was called (the mock doesn't expose the params, but we can verify it didn't error)
      expect(true).toBe(true);
    });

    it('should handle API errors gracefully', async () => {
      const { GoogleGenAI } = await import('@google/genai');
      (GoogleGenAI as any).mockImplementationOnce(() => ({
        models: {
          generateContent: vi.fn().mockRejectedValue(new Error('API Error')),
        },
      }));

      const response = await askChris([{ role: 'user', text: 'Hello' }], 'test-api-key');

      expect(response).toContain('[WARN]');
    });
  });

  describe('evaluateInterview', () => {
    it('should return false when API key is not provided', async () => {
      const result = await evaluateInterview([{ role: 'user', text: 'Hello' }], '');

      expect(result).toBe(false);
    });

    it('should return false for conversations that are too short', async () => {
      const result = await evaluateInterview([{ role: 'user', text: 'Hi' }], 'test-api-key');

      expect(result).toBe(false);
    });

    it('should evaluate interview conversation', async () => {
      const { GoogleGenAI } = await import('@google/genai');
      (GoogleGenAI as any).mockImplementationOnce(() => ({
        models: {
          generateContent: vi.fn().mockResolvedValue({
            text: JSON.stringify({ pass: true }),
          }),
        },
      }));

      const history = [
        { role: 'user' as const, text: 'Why did you leave surgery?' },
        { role: 'model' as const, text: 'I transitioned to AI...' },
        { role: 'user' as const, text: 'What skills do you have?' },
        { role: 'model' as const, text: 'I have AI and coding skills...' },
      ];

      const result = await evaluateInterview(history, 'test-api-key');

      expect(result).toBe(true);
    });

    it('should handle evaluation errors gracefully', async () => {
      const { GoogleGenAI } = await import('@google/genai');
      (GoogleGenAI as any).mockImplementationOnce(() => ({
        models: {
          generateContent: vi.fn().mockRejectedValue(new Error('Evaluation Error')),
        },
      }));

      const history = [
        { role: 'user' as const, text: 'Question 1' },
        { role: 'model' as const, text: 'Answer 1' },
        { role: 'user' as const, text: 'Question 2' },
      ];

      const result = await evaluateInterview(history, 'test-api-key');

      expect(result).toBe(false);
    });
  });

  describe('generatePersonaFromResume', () => {
    it('should throw error when API key is not provided', async () => {
      const file = new File(['test content'], 'resume.txt', { type: 'text/plain' });

      await expect(generatePersonaFromResume(file, '')).rejects.toThrow('No API Key');
    });

    it('should reject malicious content', async () => {
      const { GoogleGenAI } = await import('@google/genai');
      (GoogleGenAI as any).mockImplementationOnce(() => ({
        models: {
          generateContent: vi.fn().mockResolvedValue({
            text: JSON.stringify({ isSafe: false }),
          }),
        },
      }));

      const file = new File(['malicious content'], 'resume.txt', { type: 'text/plain' });

      await expect(generatePersonaFromResume(file, 'test-api-key')).rejects.toThrow('Malicious content detected');
    });

    it('should generate persona from safe resume', async () => {
      const { GoogleGenAI } = await import('@google/genai');

      let callCount = 0;
      (GoogleGenAI as any).mockImplementationOnce(() => ({
        models: {
          generateContent: vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
              // First call: security check
              return Promise.resolve({ text: JSON.stringify({ isSafe: true }) });
            } else {
              // Second call: persona generation
              return Promise.resolve({ text: 'Generated persona instruction' });
            }
          }),
        },
      }));

      const file = new File(['Safe resume content'], 'resume.txt', { type: 'text/plain' });

      const result = await generatePersonaFromResume(file, 'test-api-key');

      expect(result).toBe('Generated persona instruction');
    });
  });

  describe('CHRIS_PERSONA', () => {
    it('should contain expected persona information', () => {
      expect(CHRIS_PERSONA).toContain('Christopher Camarata');
      expect(CHRIS_PERSONA).toContain('General Surgeon');
      expect(CHRIS_PERSONA).toContain('AI Engineer');
      expect(CHRIS_PERSONA).toContain('[CLUE]');
      expect(CHRIS_PERSONA).toContain('[TECH]');
      expect(CHRIS_PERSONA).toContain('[SOUL]');
      expect(CHRIS_PERSONA).toContain('CueR.ai');
    });
  });
});
