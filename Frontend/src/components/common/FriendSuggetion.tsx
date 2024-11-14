
const FriendSuggetion = () => {
  return (
    <div className='w-1/2 h-screen flex flex-col items-center'>
      <div className="w-full flex h-[13%] items-center justify-center p-3 border-b">
        <h1 className="font-semibold text-xl">Suggested for you</h1>
      </div>

      <div className="w-3/4 h-[90%] flex py-4 flex-col items-center overflow-auto scrollbar-hidden">
        {[1, 2, 3, 4, 5, 7, 1, 2, 3, 4, 5, 7].map((user, index) => (
          <div
            key={index + user}
            className="w-full rounded-lg flex items-center justify-between p-4 dark:hover:bg-[#191919] hover:bg-[#f0f0f0] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <img
                src={'./avatar.png'}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex justify-center flex-col">
                <span className="text-[14px] font-semibold">shahzad</span>
                <span className="text-[12px] text-[#a9a6a4]">
                  Shahzad Ahamad P
                </span>
                <span className="text-[12px] text-[#a9a6a4] break-words">
                  Followed by mushrif, bahir and 23 more
                </span>
              </div>
            </div>
            {
              [1, 1].length ? (
                <button className="cursor-pointer w-20 font-bold bg-[#0095f6] hover:bg-opacity-70 text-white border text-sm px-1 py-1.5 rounded-lg transition-colors text-center">
                  Follow
                </button>
              ) : (
                <button className="cursor-pointer w-20 font-bold bg-[#0095f6] hover:bg-opacity-70 text-white border text-sm px-1 py-1.5 rounded-lg transition-colors text-center">
                  Request
                </button>
              )
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default FriendSuggetion
