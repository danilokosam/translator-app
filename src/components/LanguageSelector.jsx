export const LanguageSelector = ({
  value,
  onChange,
  languages,
  id,
  onIconClick,
}) => (
  <li className={`row ${id}`}>
    <div className="icons">
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

    {/* Dropdown for language selection */}
    <select
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
  </li>
);
