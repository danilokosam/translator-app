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
			{/* Display error ❌ */}
			{error && (
				<p className="error" role="alert">
					{error}
				</p>
			)}

			{/* Display loading spinner ⏳ */}
			{loading && (
				<p className="loading" role="status">
					Translating...
				</p>
			)}

			<DisplayTextInput
				toText={toText}
				fromText={fromText}
				setFromText={setFromText}
				onIconClick={handleIconClick}
			/>
			<ul className="controls flex justify-around ">
				{/* Display language selectors 🌐 */}
        <div className="bg-white px-6 py-3 rounded-4xl">

				<LanguageSelector
					id="from"
					value={fromLanguage}
					onChange={(e) => setFromLanguage(e.target.value)}
					languages={languages}
					onIconClick={handleIconClick}
          />
          </div>

				{/* Display exchange button 🔄*/}
				<li
					className="exchange px-6 py-3"
					onClick={handleExchange}
					role="button"
					aria-label="Exchange languages"
				>
					{/* Display exchange icon 🔄 hacer animación */}
					<i className="fa-solid fa-arrow-right-arrow-left rotate-180 transition-all" />
				</li>

				{/* Display language selector for target language 🌐 */}
        <div className="px-6 py-3 rounded-4xl">

				<LanguageSelector
					id="to"
					value={toLanguage}
					onChange={(e) => setToLanguage(e.target.value)}
					languages={languages}
					onIconClick={handleIconClick}
          />
          </div>
			</ul>
		</div>
	);
};
