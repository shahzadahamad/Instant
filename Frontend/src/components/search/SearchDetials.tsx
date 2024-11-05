import { faCircleXmark, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const SearchDetials = () => {

  const [search, setSearch] = useState("");

  return (
    <div className="w-full flex flex-col overflow-auto scrollbar-hidden">
      <div className="w-full flex flex-col gap-2 justify-center items-center h-[18%] border-b px-3">
        <h1 className="font-bold ml-2 text-xl">Search</h1>
        <div className="w-1/2 relative">
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

          <button className="absolute right-2 top-1 p-2 transition-colors hover:text-gray-500 focus:outline-none">
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col items-center border rounded-sm scrollbar-style overflow-y-auto scrollbar-hidden">
        <div className="w-2/3 px-4 py-3 flex justify-between">
          <h1 className="font-bold">Recent</h1>
          <button className="font-base text-blue-500">Clear All</button>
        </div>
        {[1, 2, 3, 4, 5, 7, 9, 0, 9, 1, 7].map((user, index) => (
          <div
            key={index + user}
            className="w-2/3 rounded-lg flex items-center justify-between p-4 dark:hover:bg-[#191919] hover:bg-[#f0f0f0] transition-colors cursor-pointer"
          >
            <div className="flex gap-3">
              <img
                src={'./avatar.png'}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold">shahzad</span>
                <span className="text-[14px] text-[#a9a6a4]">
                  Shahzad Ahamad P &bull; Following
                </span>
              </div>
            </div>
            <button className="text-red-500 hover:text-red-700 transition-colors">
              <FontAwesomeIcon
                icon={faXmark}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchDetials
