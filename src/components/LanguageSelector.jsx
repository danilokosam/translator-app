export const LanguageSelector = ({ value, onChange, languages, id }) => (
  <div className={` row ${id} `}>
    <select
      className='outline-0 px-12  py-3 transition duration-300 ease cursor-pointer'
      value={value}
      onChange={onChange}
      aria-label={`Select ${id} language`}
    >
      {Object.entries(languages).map(([code, name]) => (
        <option className='bg-blue-900 text-white' key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
    {/* Dropdown for language selection */}
  </div>
);
