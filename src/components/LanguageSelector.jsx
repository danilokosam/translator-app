export const LanguageSelector = ({ value, onChange, languages, id }) => (
  <div className={` row ${id} `}>
    <select
      className='outline-0 px-10  py-2 transition duration-300 ease cursor-pointer text-center'
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
