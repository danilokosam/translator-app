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
		<div className="wrapper max-w-2xl h-[calc(100%-20px)] bg-blue-600 flex flex-col justify-between">
			{/* Display error ❌ */}
			<div className="relative bg-blue-200">
				<strong className="absolute right-[9%] top-[22%] text-2xl bg-white rounded-xl px-3 py-1">T</strong>

			<div className="h-24 w-7/8 bg-blue-600 rounded-br-[60px]  text-center p-6">
				<p className="text-2xl font-bold text-end ">🔥 Text to Translate</p>
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
			<ul className="controls flex justify-around relative bg-white ">
				{/* Display language selectors 🌐 */}
				<div className="bg-white text-gray-700 px-16 py-5 rounded-4xl font-semibold shadow-xl">
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
					className="exchange absolute px-7 py-5 bg-gray-100 rounded-full shadow-xl"
					onClick={handleExchange}
					role="button"
					aria-label="Exchange languages"
				>
					{/* Display exchange icon 🔄 hacer animación */}
					<i className="fa-solid fa-arrow-right-arrow-left rotate-180 transition-all" />
				</li>

				{/* Display language selector for target language 🌐 */}
				<div className="px-16 py-5 rounded-4xl bg-blue-600 text-white font-semibold shadow-xl">
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
