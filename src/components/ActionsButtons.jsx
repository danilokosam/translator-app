export const ActionsButtons = ({id, onIconClick}) => {
	return (
		<>
			<div className="icons flex justify-between">
				{/* Icons for speak and copy actions */}
				<i
					className="fa-solid fa-volume-high"
					onClick={() => onIconClick("speak", id)}
					role="button"
					aria-label={`Speak ${id === "from" ? "source" : "translated"} text`}
				/>
				<i
					className="fa-solid fa-copy"
					onClick={() => onIconClick("copy", id)}
					role="button"
					aria-label={`Copy ${id === "from" ? "source" : "translated"} text`}
				/>
				{/* Icons for speak and copy actions */}
			</div>
		</>
	);
};
