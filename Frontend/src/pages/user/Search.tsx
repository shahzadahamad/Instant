import Sidebar from "@/components/common/Sidebar"
import SearchDetials from "@/components/searh/SearchDetials"

const Search = () => {
  return (

    <div className="flex h-screen">
      <Sidebar page={"search"} />
      <SearchDetials />
    </div>

  )
}

export default Search
