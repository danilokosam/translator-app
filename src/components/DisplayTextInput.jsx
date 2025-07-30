import { ActionsButtons } from "./ActionsButtons";

export const DisplayTextInput = ({ fromText, setFromText, toText, onIconClick, loading }) => {
	return (
		<>
			{/* Display text input ✍️*/}
			<div className="text-input flex flex-col justify-between ">
				<div className="w-full bg-white/80 p-6 rounded-md ">
					<ActionsButtons id="from" onIconClick={onIconClick} />
					<textarea
						className="from-text w-full min-h-[200px] py-2 outline-0  "
						placeholder="Enter Text"
						value={fromText}
						onChange={(e) => setFromText(e.target.value)}
						aria-label="Source text for translation"
					/>
				</div>
				<div className="w-full bg-white p-6 rounded-md -mt-2">
					<ActionsButtons id="to" onIconClick={onIconClick} />
					{/* Display loading spinner ⏳ */}
					{loading && (
						<p className="loading transition-all" role="status">
							Translating...
						</p>
					)}

					<textarea
						className="to-text from-text  w-full min-h-[200px] py-2 outline-0"
						value={toText}
						readOnly
						aria-label="Translated text"
					/>
				</div>
			</div>
		</>
	);
};
