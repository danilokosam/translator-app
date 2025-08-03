import { useState, useCallback } from "react";
import { useDebounce } from "./useDebounce.js";
import { useTranslationQuery } from "./useTranslationQuery.js";
import { useTranslationState } from "./useTranslationState.js";

export const useTranslator = (initialFromLanguage = "en-GB", initialToLanguage = "es-ES") => {
	// Language and text state
	const [fromText, setFromText] = useState("");
	const [fromLanguage, setFromLanguage] = useState(initialFromLanguage);
	const [toLanguage, setToLanguage] = useState(initialToLanguage);
	// Toggle to rotate animation arrow
	const [toggle, setToggle] = useState(false);
	const rotateAnimation = toggle === true ? "rotate(180deg)" : "rotate(0deg) ";
	// Debounced values
	const debouncedFromText = useDebounce(fromText, 500);
	const debouncedFromLanguage = useDebounce(fromLanguage, 500);
	const debouncedToLanguage = useDebounce(toLanguage, 500);

	// Translation query
	const queryResult = useTranslationQuery(
		debouncedFromText,
		debouncedFromLanguage,
		debouncedToLanguage
	);

	// Translation state management
	const { toText, setToText, error } = useTranslationState(debouncedFromText, queryResult);

	// Exchange function
	const handleExchange = useCallback(() => {
		setFromText(toText);
		setToText(fromText);
		setFromLanguage(toLanguage);
		setToLanguage(fromLanguage);
		setToggle(!toggle);
	}, [fromText, toText, fromLanguage, toLanguage, setToText]);

	return {
		fromText,
		setFromText,
		toText,
		setToText,
		fromLanguage,
		setFromLanguage,
		toLanguage,
		setToLanguage,
		loading: queryResult.isFetching,
		error,
		handleExchange,
    rotateAnimation
	};
};
