import languages from "../utils/languaje.js";
import { useTranslator } from "../hooks/useTranslator.js";
import { LanguageSelector } from "./LanguageSelector.jsx";
import { useCallback } from "react";

export const Translator = () => {
  const {
    fromText,
    setFromText,
    toText,
    fromLanguage,
    setFromLanguage,
    toLanguage,
    setToLanguage,
    loading,
    error,
    handleTranslate,
    handleExchange,
  } = useTranslator();

  const handleIconClick = useCallback(
    (action, id) => {
      if (!fromText && id === "from") return;
      if (!toText && id === "to") return;

      const text = id === "from" ? fromText : toText;
      const language = id === "from" ? fromLanguage : toLanguage;

      if (action === "copy") {
        navigator.clipboard.writeText(text);
      } else if (action === "speak") {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        window.speechSynthesis.speak(utterance);
      }
    },
    [fromText, toText, fromLanguage, toLanguage]
  );

  return (
    <div className="wrapper">
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="text-input">
        <textarea
          className="from-text"
          placeholder="Enter Text"
          value={fromText}
          onChange={(e) => setFromText(e.target.value)}
          aria-label="Source text for translation"
        />
        <textarea
          className="to-text"
          value={toText}
          readOnly
          aria-label="Translated text"
        />
      </div>
      <ul className="controls">
        <LanguageSelector
          id="from"
          value={fromLanguage}
          onChange={(e) => setFromLanguage(e.target.value)}
          languages={languages}
          onIconClick={handleIconClick}
        />
        <li
          className="exchange"
          onClick={handleExchange}
          role="button"
          aria-label="Exchange languages"
        >
          <i className="fa-solid fa-arrow-right-arrow-left" />
        </li>
        <LanguageSelector
          id="to"
          value={toLanguage}
          onChange={(e) => setToLanguage(e.target.value)}
          languages={languages}
          onIconClick={handleIconClick}
        />
      </ul>
      <button
        onClick={handleTranslate}
        disabled={loading}
        aria-busy={loading}
        aria-label={loading ? "Translating in progress" : "Translate text"}
      >
        {loading ? "Translating..." : "Translate Text"}
      </button>
    </div>
  );
};
