import { getUserSeggestions } from "@/apis/api/userApi";
import { UserSuggestionData } from "@/types/profile/profile";
import { AxiosError } from "axios";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const FriendSuggetion = () => {

  const [suggestions, setSuggestions] = useState<UserSuggestionData[] | []>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserSuggestions = async () => {
      try {
        const suggestions = await getUserSeggestions("", false);
        console.log(suggestions)
        setSuggestions(suggestions);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          console.log(error);
          const errorMsg = error.response.data?.error || "An error occurred";
          toast.error(errorMsg);
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred");
        }
      }
    }
    fetchUserSuggestions();
  }, [])


  return (
    <div className='w-1/2 h-screen flex flex-col items-center'>
      <div className="w-full flex h-[13%] items-center justify-center p-3 border-b">
        <h1 className="font-semibold text-xl">Suggested for you</h1>
      </div>

      <div className="w-3/4 h-[90%] flex py-4 flex-col items-center overflow-auto scrollbar-hidden">
        {suggestions.map((user) => {
          console.log(user.mutualFriends)
          const displayedFriends = user.mutualFriends.slice(0, 2);
          const remainingCount = user.mutualFriends.length - displayedFriends.length;
          return (
            <div
              onClick={() => navigate(`/user/${user.user.username}`)}
              key={user.user._id}
              className="w-full rounded-lg flex items-center justify-between p-4 dark:hover:bg-[#191919] hover:bg-[#f0f0f0] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.user.profilePicture.toString()}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex justify-center flex-col">
                  <span className="text-[14px] font-semibold">{user.user.username}</span>
                  <span className="text-[12px] text-[#a9a6a4]">
                    {user.user.fullname}
                  </span>
                  {user.mutualFriends.length > 0 && (
                    <span className="text-[12px] text-[#a9a6a4] break-words">
                      Followed by {displayedFriends.join(", ")}
                      {remainingCount > 0 && ` and ${remainingCount} more`}
                    </span>
                  )}
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
          )

        })}
      </div>
    </div>
  )
}

export default FriendSuggetion
