export const ActionsButtons = ({ id, onIconClick, error, resetForm }) => {
  return (
    <>
      <div className='icons flex justify-between items-center px-4'>
        {/* Speak icon */}
        <i
          className='fa-solid fa-volume-high cursor-pointer'
          onClick={() => onIconClick("speak", id)}
          role='button'
          aria-label={`Speak ${id === "from" ? "source" : "translated"} text`}
        />
        {/* Speak icon */}

        {/* Error message */}
        <span
          className={`error text-xs sm:text-sm font-bold text-red-600 text-center ${
            error ? "visible" : "invisible"
          }`}
          role={error ? "alert" : undefined}
        >
          {error || "placeholder"}
        </span>
        {/* Error message */}

        {/* Icons for copy and resetForm */}
        <div className='flex items-center gap-3'>
          <i
            className='fa-solid fa-copy cursor-pointer'
            onClick={() => onIconClick("copy", id)}
            role='button'
            aria-label={`Copy ${id === "from" ? "source" : "translated"} text`}
          />

          {id === "from" ? (
            <i
              onClick={() => resetForm("")}
              className='fa-solid fa-xmark cursor-pointer'
            ></i>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
