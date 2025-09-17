import { ActionsButtons } from "./ActionsButtons";

export const DisplayTextInput = ({
  fromText,
  setFromText,
  toText,
  onIconClick,
  loading,
  error,
}) => {
  return (
    <>
      {/* Display text input ✍️*/}
      <div className='text-input   flex flex-col justify-between '>
        <div className='bg-gradient-to-b from-blue-600 to-white'>
          <div className='relative w-full bg-blue-200 p-6 rounded-tl-[50px] rounded-br-[50px]  '>
            <ActionsButtons
              error={error}
              id='from'
              onIconClick={onIconClick}
              resetForm={setFromText}
            />

            <textarea
              className='from-text text-2xl  w-full min-h-[300px] p-4 outline-0  '
              placeholder='Enter your text'
              value={fromText}
              onChange={(e) => setFromText(e.target.value)}
              aria-label='Source text for translation'
            />
          </div>
        </div>
        <div className='bg-blue-200'>
          <div className='w-full bg-white p-6 rounded-tl-[50px]  '>
            <ActionsButtons id='to' onIconClick={onIconClick} />
            {/* Display loading spinner ⏳ */}
            {/* {loading && (
							<p className="loading transition-all" role="status">
								Translating...
							</p>
						)} */}

            <textarea
              className='to-text from-text text-2xl w-full min-h-[340px] p-4 outline-0'
              placeholder='Translation'
              value={loading ? "Translating..." : toText}
              readOnly
              aria-label='Translated text'
            />
          </div>
        </div>
      </div>
    </>
  );
};
