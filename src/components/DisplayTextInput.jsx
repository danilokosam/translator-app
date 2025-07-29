import { ActionsButtons } from "./ActionsButtons";

export const DisplayTextInput = ({ fromText, setFromText, toText, id, onIconClick}) => {
	
	
	return (
		<>
			{/* Display text input ✍️*/}
			<div className="text-input flex flex-col gap-2  ">
				<ActionsButtons id="from" onIconClick={onIconClick}/>
				<div className="w-full">
					<textarea
						className="from-text w-full bg-white p-2 rounded-md "
						placeholder="Enter Text"
						value={fromText}
						onChange={(e) => setFromText(e.target.value)}
						aria-label="Source text for translation"
					/>
				</div>
				<ActionsButtons id="to" onIconClick={onIconClick}/>
				<div>
					<textarea
						className="to-text from-text w-full bg-white p-2 rounded-md"
						value={toText}
						readOnly
						aria-label="Translated text"
					/>
				</div>
			</div>
		</>
	);
};
