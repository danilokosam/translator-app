import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTranslationQuery } from "../hooks/useTranslationQuery.js";
import { translationApi } from "../services/translationApi.js";

// Mock the translation API
vi.mock("../services/translationApi.js", () => ({
  translationApi: {
    translate: vi.fn(),
  },
}));

// Helper to create wrapper with QueryClient
const createWrapper = (queryClient) => {
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useTranslationQuery", () => {
  let queryClient;
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });
    wrapper = createWrapper(queryClient);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    queryClient.clear();
  });

  describe("Query enabling/disabling", () => {
    it("should not execute query when text is empty", () => {
      const { result } = renderHook(
        () => useTranslationQuery("", "en-GB", "es-ES"),
        { wrapper }
      );

      expect(translationApi.translate).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
      expect(result.current.isFetching).toBe(false);
    });

    it("should not execute query when text is only whitespace", () => {
      const { result } = renderHook(
        () => useTranslationQuery("   ", "en-GB", "es-ES"),
        { wrapper }
      );

      expect(translationApi.translate).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
      expect(result.current.isFetching).toBe(false);
    });

    it("should not execute query when text is null", () => {
      const { result } = renderHook(
        () => useTranslationQuery(null, "en-GB", "es-ES"),
        { wrapper }
      );

      expect(translationApi.translate).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
      expect(result.current.isFetching).toBe(false);
    });

    it("should not execute query when text is undefined", () => {
      const { result } = renderHook(
        () => useTranslationQuery(undefined, "en-GB", "es-ES"),
        { wrapper }
      );

      expect(translationApi.translate).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
      expect(result.current.isFetching).toBe(false);
    });

    it("should execute query when text has content", async () => {
      translationApi.translate.mockResolvedValue("Hola");

      const { result } = renderHook(
        () => useTranslationQuery("Hello", "en-GB", "es-ES"),
        { wrapper }
      );

      expect(result.current.isFetching).toBe(true);

      await waitFor(() => {
        expect(result.current.isFetching).toBe(false);
      });

      expect(translationApi.translate).toHaveBeenCalledWith(
        "Hello",
        "en-GB",
        "es-ES"
      );
      expect(result.current.data).toBe("Hola");
      expect(result.current.error).toBe(null);
    });
  });

  describe("Successful translations", () => {
    it("should return translated text on successful translation", async () => {
      translationApi.translate.mockResolvedValue("Hola mundo");

      const { result } = renderHook(
        () => useTranslationQuery("Hello world", "en-GB", "es-ES"),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isFetching).toBe(false);
      });

      expect(result.current.data).toBe("Hola mundo");
      expect(result.current.error).toBe(null);
      expect(result.current.isSuccess).toBe(true);
    });

    it("should handle empty translation response", async () => {
      translationApi.translate.mockResolvedValue("");

      const { result } = renderHook(
        () => useTranslationQuery("Hello", "en-GB", "es-ES"),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isFetching).toBe(false);
      });

      expect(result.current.data).toBe("");
      expect(result.current.error).toBe(null);
      expect(result.current.isSuccess).toBe(true);
    });

    it("should handle special characters in translation", async () => {
      translationApi.translate.mockResolvedValue("¡Hola, cómo estás!");

      const { result } = renderHook(
        () => useTranslationQuery("Hello, how are you!", "en-GB", "es-ES"),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isFetching).toBe(false);
      });

      expect(result.current.data).toBe("¡Hola, cómo estás!");
    });
  });

  describe("Error handling", () => {
    it("should handle API errors correctly", async () => {
      const apiError = new Error("API Error");
      translationApi.translate.mockRejectedValue(apiError);

      const { result } = renderHook(
        () => useTranslationQuery("Hello", "en-GB", "es-ES"),
        { wrapper }
      );

      await waitFor(() => {
        console.log("isError:", result.current.isError);
        console.log("isFetching:", result.current.isFetching);
        expect(result.current.isError).toBe(true);
        expect(result.current.isFetching).toBe(false);
      }, { timeout: 5000 });

      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBe(apiError);
      expect(result.current.isError).toBe(true);
    });

    it("should retry only once on failure", async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            gcTime: 0,
          },
        },
      });

      const wrapper = createWrapper(queryClient);

      translationApi.translate.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(
        () => useTranslationQuery("Hello", "en-GB", "es-ES"),
        { wrapper }
      );

      await waitFor(
        () => {
          expect(result.current.isFetching).toBe(false);
        },
        { timeout: 5000 }
      );

      // Should be called twice: initial + 1 retry
      expect(translationApi.translate).toHaveBeenCalledTimes(2);
      expect(result.current.isError).toBe(true);
      queryClient.clear();
    });
  });

  describe("Query key changes", () => {
    it("should refetch when text changes", async () => {
      translationApi.translate
        .mockResolvedValueOnce("Hola")
        .mockResolvedValueOnce("Mundo");

      const { result, rerender } = renderHook(
        ({ text }) => useTranslationQuery(text, "en-GB", "es-ES"),
        {
          wrapper,
          initialProps: { text: "Hello" },
        }
      );

      await waitFor(() => {
        expect(result.current.data).toBe("Hola");
      });

      rerender({ text: "World" });

      await waitFor(() => {
        expect(result.current.data).toBe("Mundo");
      });

      expect(translationApi.translate).toHaveBeenCalledTimes(2);
      expect(translationApi.translate).toHaveBeenNthCalledWith(
        1,
        "Hello",
        "en-GB",
        "es-ES"
      );
      expect(translationApi.translate).toHaveBeenNthCalledWith(
        2,
        "World",
        "en-GB",
        "es-ES"
      );
    });

    it("should refetch when fromLang changes", async () => {
      translationApi.translate
        .mockResolvedValueOnce("Hola")
        .mockResolvedValueOnce("Bonjour");

      const { result, rerender } = renderHook(
        ({ fromLang }) => useTranslationQuery("Hello", fromLang, "es-ES"),
        {
          wrapper,
          initialProps: { fromLang: "en-GB" },
        }
      );

      await waitFor(() => {
        expect(result.current.data).toBe("Hola");
      });

      rerender({ fromLang: "fr-FR" });

      await waitFor(() => {
        expect(result.current.data).toBe("Bonjour");
      });

      expect(translationApi.translate).toHaveBeenCalledTimes(2);
      expect(translationApi.translate).toHaveBeenNthCalledWith(
        1,
        "Hello",
        "en-GB",
        "es-ES"
      );
      expect(translationApi.translate).toHaveBeenNthCalledWith(
        2,
        "Hello",
        "fr-FR",
        "es-ES"
      );
    });

    it("should refetch when toLang changes", async () => {
      translationApi.translate
        .mockResolvedValueOnce("Hola")
        .mockResolvedValueOnce("Bonjour");

      const { result, rerender } = renderHook(
        ({ toLang }) => useTranslationQuery("Hello", "en-GB", toLang),
        {
          wrapper,
          initialProps: { toLang: "es-ES" },
        }
      );

      await waitFor(() => {
        expect(result.current.data).toBe("Hola");
      });

      rerender({ toLang: "fr-FR" });

      await waitFor(() => {
        expect(result.current.data).toBe("Bonjour");
      });

      expect(translationApi.translate).toHaveBeenCalledTimes(2);
      expect(translationApi.translate).toHaveBeenNthCalledWith(
        1,
        "Hello",
        "en-GB",
        "es-ES"
      );
      expect(translationApi.translate).toHaveBeenNthCalledWith(
        2,
        "Hello",
        "en-GB",
        "fr-FR"
      );
    });
  });

  describe("Loading states", () => {
    it("should show loading state while fetching", async () => {
      let resolveTranslation;
      const translationPromise = new Promise((resolve) => {
        resolveTranslation = resolve;
      });

      translationApi.translate.mockReturnValue(translationPromise);

      const { result } = renderHook(
        () => useTranslationQuery("Hello", "en-GB", "es-ES"),
        { wrapper }
      );

      expect(result.current.isFetching).toBe(true);
      expect(result.current.data).toBeUndefined();

      resolveTranslation("Hola");

      await waitFor(() => {
        expect(result.current.isFetching).toBe(false);
      });

      expect(result.current.data).toBe("Hola");
    });

    it("should handle transition from loading to success", async () => {
      translationApi.translate.mockResolvedValue("Hola");

      const { result } = renderHook(
        () => useTranslationQuery("Hello", "en-GB", "es-ES"),
        { wrapper }
      );

      // Initially loading
      expect(result.current.isFetching).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);

      await waitFor(() => {
        expect(result.current.isFetching).toBe(false);
      });

      // After success
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBe("Hola");
    });
  });

  describe("Caching behavior", () => {
    it("should use cached data for same query", async () => {
      translationApi.translate.mockResolvedValue("Hola");

      const { result: result1 } = renderHook(
        () => useTranslationQuery("Hello", "en-GB", "es-ES"),
        { wrapper }
      );

      await waitFor(() => {
        expect(result1.current.data).toBe("Hola");
      });

      // Second hook with same parameters should use cache
      const { result: result2 } = renderHook(
        () => useTranslationQuery("Hello", "en-GB", "es-ES"),
        { wrapper }
      );

      // Should immediately have data from cache
      expect(result2.current.data).toBe("Hola");

      // API should only be called once
      expect(translationApi.translate).toHaveBeenCalledTimes(1);
    });
  });

  describe("Query configuration", () => {
    it("should be enabled only when text has content", () => {
      const { result: emptyResult } = renderHook(
        () => useTranslationQuery("", "en-GB", "es-ES"),
        { wrapper }
      );

      const { result: contentResult } = renderHook(
        () => useTranslationQuery("Hello", "en-GB", "es-ES"),
        { wrapper }
      );

      expect(emptyResult.current.isFetching).toBe(false);
      expect(contentResult.current.isFetching).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle very long text", async () => {
      const longText = "Hello ".repeat(100);
      const longTranslation = "Hola ".repeat(100);

      translationApi.translate.mockResolvedValue(longTranslation);

      const { result } = renderHook(
        () => useTranslationQuery(longText, "en-GB", "es-ES"),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.data).toBe(longTranslation);
      });

      expect(translationApi.translate).toHaveBeenCalledWith(
        longText,
        "en-GB",
        "es-ES"
      );
    });

    it("should handle unicode and special characters", async () => {
      const unicodeText = "🚀 Hello World! 🌍";
      const unicodeTranslation = "🚀 ¡Hola Mundo! 🌍";

      translationApi.translate.mockResolvedValue(unicodeTranslation);

      const { result } = renderHook(
        () => useTranslationQuery(unicodeText, "en-GB", "es-ES"),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.data).toBe(unicodeTranslation);
      });
    });
  });
});