export const ActionsButtons = ({ id, onIconClick, error, resetForm }) => {
	return (
		<>
			<div className="icons flex justify-between px-4">
				{/* Icons for speak and copy actions */}
				<i
					className="fa-solid fa-volume-high cursor-pointer"
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
				<div className="flex ">
					<i
						className="fa-solid fa-copy mr-6 cursor-pointer"
						onClick={() => onIconClick("copy", id)}
						role="button"
						aria-label={`Copy ${id === "from" ? "source" : "translated"} text`}
					/>

					{id === "from" ? (
						<i onClick={() => resetForm("")} class="fa-solid fa-xmark cursor-pointer"></i>
					) : (
						""
					)}
				</div>

				{/* Icons for speak and copy actions */}
			</div>
		</>
	);
};
