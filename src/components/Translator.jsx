import languages from "../utils/languaje.js";
import { useTranslator } from "../hooks/useTranslator.js";
import { LanguageSelector } from "./LanguageSelector.jsx";
import { useCallback } from "react";
import { DisplayTextInput } from "./DisplayTextInput.jsx";

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
    handleExchange,
    rotateAnimation,
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
    [fromText, toText, fromLanguage, toLanguage],
  );

  return (
    <div className='w-full sm:max-w-4xl mx-auto px-4'>
      {/* Display error ❌ */}
      <div className='relative bg-blue-200'>
        <strong className='absolute left-[2%] top-[30%] text-2xl sm:text-4xl bg-white rounded-xl px-3 py-1 select-none'>
          T
        </strong>

        <div className='min-h-[6rem] w-full bg-gradient-to-l  from-[#62cff4] to-[#2c67f2] rounded-br-[60px] p-4 sm:p-6 flex justify-end items-center'>
          <p className='text-3xl sm:text-5xl font-bold text-end text-white select-none'>
            Lingo Traductor
          </p>
        </div>
      </div>

      <DisplayTextInput
        loading={loading}
        toText={toText}
        fromText={fromText}
        error={error}
        setFromText={setFromText}
        onIconClick={handleIconClick}
      />

      <ul className='flex flex-col  sm:flex-row sm:justify-evenly relative bg-white sm:p-4'>
        {/* Display language selectors 🌐 */}
        <li className='w-fit mx-auto sm:w-auto bg-gradient-to-t from-white to-gray-100 hover:to-gray-300 text-gray-700  rounded-4xl font-semibold text-sm shadow-xl '>
          <LanguageSelector
            id='from'
            value={fromLanguage}
            onChange={(e) => setFromLanguage(e.target.value)}
            languages={languages}
            onIconClick={handleIconClick}
          />
        </li>

        {/* Display exchange button 🔄*/}
        <li
          className='exchange px-1 py-1 sm:px-2 sm:py-2 bg-gradient-to-t from-gray-100 to-gray-200 hover:to-gray-300 rounded-full shadow-xl cursor-pointer self-center sm:self-auto'
          onClick={handleExchange}
          role='button'
          aria-label='Exchange languages'
        >
          {/* Display exchange icon 🔄 hacer animación */}
          <i
            style={{ transform: `${rotateAnimation}` }}
            className='fa-solid fa-arrow-right-arrow-left transition-all duration-300 ease-in-out '
          />
        </li>

        {/* Display language selector for target language 🌐 */}
        <li className='w-fit mx-auto sm:w-auto rounded-4xl bg-gradient-to-t from-blue-600 to-blue-500 hover:to-blue-700 text-white font-semibold shadow-xl text-sm'>
          <LanguageSelector
            id='to'
            value={toLanguage}
            onChange={(e) => setToLanguage(e.target.value)}
            languages={languages}
            onIconClick={handleIconClick}
          />
        </li>
      </ul>
    </div>
  );
};
