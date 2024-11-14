import FriendSuggetion from "../common/FriendSuggetion"


const NotificationDetials = () => {
  return (
    <div className="w-full h-screen flex items-start justify-between">

      <div className='w-1/2 h-screen flex flex-col items-center'>
        <div className="w-full flex h-[13%] items-center justify-center p-3 border-b">
          <h1 className="font-semibold text-xl">Notifications</h1>
        </div>

        <div className="w-3/4 h-[90%] flex flex-col items-center overflow-auto scrollbar-hidden">
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
                  <h1 className="text-[15px] font-semibold max-w-[15rem] break-words">shahzad <span className='font-normal'>started following you.&nbsp;</span><span className='font-thin'>1d</span></h1>
                </div>
              </div>
              {
                [1, 1].length ? (
                  <button className="cursor-pointer w-20 font-bold bg-[#0095f6] hover:bg-opacity-70 text-white border text-sm px-1 py-1.5 rounded-lg transition-colors text-center">
                    Follow
                  </button>

                ) : [1, 1].length ? (
                  <div className="flex flex-col gap-2">
                    <button className="cursor-pointer w-20 font-bold bg-[#0095f6] hover:bg-opacity-70 text-white border text-sm px-1 py-1.5 rounded-lg transition-colors text-center">
                      Confirm
                    </button>
                    <button className="cursor-pointer w-20 font-bold dark:bg-[#363636] bg-[#efefef] dark:hover:bg-opacity-70 hover:bg-opacity-70 border text-sm px-3 py-1.5 rounded-lg transition-colors text-center">
                      Delete
                    </button>
                  </div>
                ) : [1, 1].length ? (
                  <button className="cursor-pointer w-20 font-bold dark:bg-[#363636] bg-[#efefef] dark:hover:bg-opacity-70 hover:bg-opacity-70 border text-sm px-3 py-1.5 rounded-lg transition-colors text-center">
                    Following
                  </button>
                ) : (
                  <div className="w-12 h-12 rounded-md border overflow-hidden cursor-pointer mr-4">
                    <img
                      src={'./car.jpg'}
                      alt="Upload"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              }
            </div>
          ))}
        </div>
      </div>
      <FriendSuggetion />
    </div>
  )
}

export default NotificationDetials
