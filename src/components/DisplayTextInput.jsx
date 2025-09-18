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
      <div className='text-input   flex flex-col justify-between'>
        <div className='bg-gradient-to-b from-blue-600 to-white'>
          <div className='relative w-full bg-blue-200 p-3 sm:p-4 rounded-tl-[40px] rounded-br-[40px]'>
            <ActionsButtons
              error={error}
              id='from'
              onIconClick={onIconClick}
              resetForm={setFromText}
            />

            <textarea
              id='fromText'
              name='fromText'
              className='from-text w-full min-h-[100px] sm:min-h-[130px] text-sm sm:text-lg p-3 outline-0 rounded-md resize-none '
              placeholder='Enter your text'
              value={fromText}
              onChange={(e) => setFromText(e.target.value)}
              aria-label='Source text for translation'
            />
          </div>
        </div>
        <div className='bg-blue-200'>
          <div className='w-full bg-white p-3 sm:p-4 rounded-tl-[40px] '>
            <ActionsButtons id='to' onIconClick={onIconClick} />
            {/* Display loading spinner ⏳ */}
            {/* {loading && (
							<p className="loading transition-all" role="status">
								Translating...
							</p>
						)} */}

            <textarea
              id='toText'
              name='toText'
              className='to-text from-text w-full min-h-[100px] sm:min-h-[130px] text-sm sm:text-lg p-3 outline-0 rounded-md resize-none '
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
