export const ActionsButtons = ({ id, onIconClick, error }) => {
	return (
		<>
			<div className="icons flex justify-between px-4">
				{/* Icons for speak and copy actions */}
				<i
					className="fa-solid fa-volume-high"
					onClick={() => onIconClick("speak", id)}
					role="button"
					aria-label={`Speak ${id === "from" ? "source" : "translated"} text`}
				/>
				{error && (
					<span
						className="error text-xs items-center align-middle font-semibold text-red-600"
						role="alert"
					>
						{error}
					</span>
				)}
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
