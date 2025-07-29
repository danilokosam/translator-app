import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  translationApi,
  TranslationApiError,
} from "../services/translationApi.js";

// Mock the fetch function
window.fetch = vi.fn();

describe("translationApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('translate', () => {
    describe('Input validation', () => {
      it('should throw TranslationApiError for empty string', async () => {
        await expect(
          translationApi.translate('', 'en-GB', 'es-ES')
        ).rejects.toThrow(TranslationApiError);
        
        await expect(
          translationApi.translate('', 'en-GB', 'es-ES')
        ).rejects.toThrow('Text must be at least 1 character long');
      });

      it('should throw TranslationApiError for whitespace only', async () => {
        await expect(
          translationApi.translate('   ', 'en-GB', 'es-ES')
        ).rejects.toThrow(TranslationApiError);
      });

      it('should throw TranslationApiError for null text', async () => {
        await expect(
          translationApi.translate(null, 'en-GB', 'es-ES')
        ).rejects.toThrow(TranslationApiError);
      });

      it('should throw TranslationApiError for undefined text', async () => {
        await expect(
          translationApi.translate(undefined, 'en-GB', 'es-ES')
        ).rejects.toThrow(TranslationApiError);
      });
    });

    describe('API calls', () => {
      it('should make correct API call with proper URL encoding', async () => {
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue({
            responseData: {
              translatedText: 'Hola mundo'
            }
          })
        };
        
        window.fetch.mockResolvedValue(mockResponse);

        const result = await translationApi.translate('Hello world', 'en-GB', 'es-ES');

        expect(window.fetch).toHaveBeenCalledTimes(1);
        expect(window.fetch).toHaveBeenCalledWith(
          'https://api.mymemory.translated.net/get?q=Hello%20world&langpair=en-GB|es-ES'
        );
        expect(result).toBe('Hola mundo');
      });

      it('should handle special characters in text', async () => {
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue({
            responseData: {
              translatedText: 'Hola, ¿cómo estás?'
            }
          })
        };
        
        window.fetch.mockResolvedValue(mockResponse);

        await translationApi.translate('Hello, how are you?', 'en-GB', 'es-ES');

        expect(window.fetch).toHaveBeenCalledWith(
          'https://api.mymemory.translated.net/get?q=Hello%2C%20how%20are%20you%3F&langpair=en-GB|es-ES'
        );
      });

      it('should trim whitespace from input text', async () => {
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue({
            responseData: {
              translatedText: 'Hola'
            }
          })
        };
        
        window.fetch.mockResolvedValue(mockResponse);

        await translationApi.translate('  Hello  ', 'en-GB', 'es-ES');

        expect(window.fetch).toHaveBeenCalledWith(
          'https://api.mymemory.translated.net/get?q=Hello&langpair=en-GB|es-ES'
        );
      });
    });

    describe('Successful responses', () => {
      it('should return translated text on successful API call', async () => {
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue({
            responseData: {
              translatedText: 'Hola mundo'
            }
          })
        };
        
        window.fetch.mockResolvedValue(mockResponse);

        const result = await translationApi.translate('Hello world', 'en-GB', 'es-ES');

        expect(result).toBe('Hola mundo');
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
      });

      it('should handle empty translation response', async () => {
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue({
            responseData: {
              translatedText: ''
            }
          })
        };
        
        window.fetch.mockResolvedValue(mockResponse);

        const result = await translationApi.translate('Hello', 'en-GB', 'es-ES');

        expect(result).toBe('');
      });
    });

    describe('Error handling', () => {
      it('should throw TranslationApiError when fetch fails', async () => {
        const mockResponse = {
          ok: false,
          status: 500
        };
        
        window.fetch.mockResolvedValue(mockResponse);

        await expect(
          translationApi.translate('Hello', 'en-GB', 'es-ES')
        ).rejects.toThrow(TranslationApiError);

        await expect(
          translationApi.translate('Hello', 'en-GB', 'es-ES')
        ).rejects.toThrow('Translation API error');
      });

      it('should include status code in error when fetch fails', async () => {
        const mockResponse = {
          ok: false,
          status: 404
        };
        
        window.fetch.mockResolvedValue(mockResponse);

        try {
          await translationApi.translate('Hello', 'en-GB', 'es-ES');
        } catch (error) {
          expect(error).toBeInstanceOf(TranslationApiError);
          expect(error.status).toBe(404);
        }
      });

      it('should throw TranslationApiError when network fails', async () => {
        window.fetch.mockRejectedValue(new Error('Network error'));

        await expect(
          translationApi.translate('Hello', 'en-GB', 'es-ES')
        ).rejects.toThrow('Network error');
      });

      it('should throw TranslationApiError when JSON parsing fails', async () => {
        const mockResponse = {
          ok: true,
          json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
        };
        
        window.fetch.mockResolvedValue(mockResponse);

        await expect(
          translationApi.translate('Hello', 'en-GB', 'es-ES')
        ).rejects.toThrow('Invalid JSON');
      });
    });
  });
});

describe('TranslationApiError', () => {
  it('should create error with message and status', () => {
    const error = new TranslationApiError('Test error', 400);
    
    expect(error.message).toBe('Test error');
    expect(error.status).toBe(400);
    expect(error.name).toBe('TranslationApiError');
    expect(error).toBeInstanceOf(Error);
  });

  it('should create error without status', () => {
    const error = new TranslationApiError('Test error');
    
    expect(error.message).toBe('Test error');
    expect(error.status).toBeUndefined();
    expect(error.name).toBe('TranslationApiError');
  });
});