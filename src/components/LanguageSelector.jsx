export const LanguageSelector = ({ value, onChange, languages, id }) => (
	<div className={` row ${id} `}>
		<select
			className="outline-0"
			value={value}
			onChange={onChange}
			aria-label={`Select ${id} language`}
		>
			{Object.entries(languages).map(([code, name]) => (
				<option key={code} value={code}>
					{name}
				</option>
			))}
		</select>
		{/* Dropdown for language selection */}
	</div>
);
