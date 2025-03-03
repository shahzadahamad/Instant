import { faCircleXmark, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import FriendSuggetion from "../common/FriendSuggetion";
import { GetUserDataForPost } from "@/types/profile/profile";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { addNewSearch, removeFromSearchHistory, searchHistory, searchUser } from "@/apis/api/userApi";
import VerificationIcon from "../common/svg/VerificationIcon";
import { useNavigate } from "react-router-dom";

const SearchDetials = () => {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchData, setSeachData] = useState<GetUserDataForPost[]>([])
  const [cacheSearchData, setCacheSearchData] = useState<Record<string, GetUserDataForPost[]>>({});
  const [cacheHistory, setCacheHistory] = useState<GetUserDataForPost[]>([]);

  const fetchSearchData = async (search: string) => {
    try {
      const res = await searchUser(search);
      setSeachData(res);
      setCacheSearchData((prev) => ({ ...prev, [search]: res }));
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response.data?.error || "An error occurred");
        toast.error(error.response.data?.error || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  }

  const fetchSearchHistory = async () => {
    try {
      const res = await searchHistory();
      if (res) {
        setSeachData(res.history);
        setCacheHistory(res.history);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response.data?.error || "An error occurred");
        toast.error(error.response.data?.error || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  }

  useEffect(() => {

    if (!search) {
      setSeachData([]);
      return;
    }

    if (cacheSearchData[search]) {
      setSeachData(cacheSearchData[search]);
      return;
    }

    const timer = setTimeout(() => {
      fetchSearchData(search);
    }, 300);

    return () => {
      clearTimeout(timer);
    }
  }, [search]);

  useEffect(() => {

    if (!search) {
      if (cacheHistory && cacheHistory.length > 1) {
        setSeachData(cacheHistory);
        return;
      }

      fetchSearchHistory();
    }

  }, [!search])

  const handleClickSeach = async (id: string, username: string) => {
    try {
      await addNewSearch(id);
      navigate(`/user/${username}`)
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response.data?.error || "An error occurred");
        toast.error(error.response.data?.error || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  }

  const handleRemove = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    try {
      e.stopPropagation();
      const removeId = await removeFromSearchHistory(id);
      setSeachData((prevItems) => prevItems.filter((item) => item._id !== removeId));
      setCacheHistory((prevItems) => prevItems.filter((item) => item._id !== removeId));
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response.data?.error || "An error occurred");
        toast.error(error.response.data?.error || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  }


  return (
    <div className="w-full h-screen flex items-start justify-between">

      <div className='w-1/2 h-screen flex flex-col items-center'>
        <div className="w-full flex h-[13%] items-center justify-center p-3 border-b">
          <div className="w-3/4 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent p-3 pl-10 pr-10 border rounded-md shadow-sm focus:outline-none"
              name="search"
              placeholder="Search"
            />
            <button className="absolute left-2 top-1 p-2 transition-colors hover:text-blue-500 focus:outline-none">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>

            <button onClick={() => setSearch("")} className="absolute right-2 top-1 p-2 transition-colors hover:text-gray-500 focus:outline-none">
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          </div>
        </div>
        <div className="w-3/4 h-[90%] flex flex-col items-center transition-all overflow-auto scrollbar-hidden">
          {
            !search.trim() && (
              <div className="w-full px-4 py-3 flex justify-between transition-all">
                <h1 className="font-bold">Recent</h1>
                <button className="font-base text-blue-500">Clear All</button>
              </div>
            )
          }
          {searchData.map((user) => (
            <div
              key={user._id}
              onClick={() => handleClickSeach(user._id, user.username)}
              className="w-full rounded-lg flex items-center justify-between p-4 dark:hover:bg-[#191919] hover:bg-[#f0f0f0] transition-colors cursor-pointer"
            >
              <div className="flex gap-3">
                <img
                  src={user.profilePicture as string}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-[15px] font-semibold">{user.username}</span>
                    {
                      user.isVerified.status && (
                        <VerificationIcon size={'16'} />
                      )
                    }
                  </div>
                  <span className="text-[14px] text-[#a9a6a4]">
                    {user.fullname} {user.isFollowed && <>&bull; Following</>}
                  </span>
                </div>
              </div>
              {
                !search.trim() && (
                  <button onClick={(e) => handleRemove(e, user._id)} className="text-[#7e7e7e] text-lg hover:text-opacity-70 transition-colors">
                    <FontAwesomeIcon
                      icon={faXmark}
                    />
                  </button>
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

export default SearchDetials
