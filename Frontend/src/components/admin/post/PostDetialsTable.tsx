import * as React from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState, useMemo } from "react";
import { adminApiClient } from "@/apis/apiClient";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import { debounce } from 'lodash';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IPostWithUserData } from "@/types/create-post/create-post";

const PostDetialsTable = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [posts, setPosts] = useState<IPostWithUserData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const [totalPost, setTotalPost] = useState(0);
  const [viewPost, setViewPost] = useState<{ url: string | File, type: string }>({ url: "", type: "" });
  const isDisabled = page === totalPages;
  const [dataLimit, setDataLimit] = useState<number>(10);
  const limit = [5, 10, 25, 50, 100];
  const [sort, setSort] = useState('');

  const sortedPosts = useMemo(() => {
    if (!sort) return posts;

    return [...posts].sort((a, b) => {
      const field = sort.replace("-", "");
      const order = sort.startsWith("-") ? -1 : 1;

      let aValue: number | string = "";
      let bValue: number | string = "";

      // Special cases for computed properties
      if (field === "postCount") {
        aValue = a.post?.length ?? 0;
        bValue = b.post?.length ?? 0;
      } else if (field === "reportCount") {
        aValue = a.reportDetials?.length ?? 0;
        bValue = b.reportDetials?.length ?? 0;
      } else if (field === "type") {
        aValue = a.post?.[0]?.type ?? "";
        bValue = b.post?.[0]?.type ?? "";
      } else if (field === "username") {
        aValue = a.userId.username ?? "";
        bValue = b.userId.username ?? "";
      } else if (field in a && field in b) {
        // Handle actual fields in IPostWithUserData
        const key = field as keyof IPostWithUserData;
        const rawA = a[key];
        const rawB = b[key];

        if (typeof rawA === "number" || typeof rawA === "string") {
          aValue = rawA;
        } else if (typeof rawA === "boolean") {
          aValue = rawA ? 1 : 0;
        } else if (rawA instanceof Date) {
          aValue = rawA.getTime();
        }

        if (typeof rawB === "number" || typeof rawB === "string") {
          bValue = rawB;
        } else if (typeof rawB === "boolean") {
          bValue = rawB ? 1 : 0;
        } else if (rawB instanceof Date) {
          bValue = rawB.getTime();
        }
      }

      return aValue > bValue ? order : aValue < bValue ? -order : 0;
    });
  }, [sort, posts]);


  const debouncedFetchUsers = useMemo(
    () =>
      debounce(async (page, search, dataLimit) => {
        try {
          const response = await adminApiClient.get(`/post`, {
            params: { page, search, limit: dataLimit },
          });
          setPosts(response.data.posts);
          setTotalPages(response.data.totalPages);
          setTotalPost(response.data.totalPost);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }, 500),
    []
  );

  useEffect(() => {
    debouncedFetchUsers(page, searchVal, dataLimit);
    return () => debouncedFetchUsers.cancel();
  }, [page, searchVal, debouncedFetchUsers, dataLimit]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleModal = (postUrl: string | File, type: string) => {
    setViewPost({ url: postUrl, type });
    onOpen();
  };

  const handleSort = (field: string) => {
    setSort((prevSort) => (prevSort === field ? `-${field}` : field));
  };

  return (
    <>
      <Modal isOpen={isOpen} size="2xl" onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center border-1">
                View Post
              </ModalHeader>
              <ModalBody className="p-10 border-1 w-full h-full flex justify-center items-center">
                <div className="w-[350px] h-[350px] rounded-md border overflow-hidden">
                  {
                    viewPost.type === 'image' ?
                      <img
                        src={typeof viewPost.url === "string" ? viewPost.url : ""}
                        alt="Avatar"
                        className="w-full h-full object-contain"
                      /> : <video
                        src={typeof viewPost.url === "string" ? viewPost.url : ""}
                        className="w-full h-full object-contain"
                        autoPlay
                      />
                  }

                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="h-[88vh] overflow-y-auto scrollbar-hidden">
        <div className="flex flex-col gap-4">
          <div className="p-10 pb-1 flex justify-between items-center">
            <div className="w-full max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchVal}
                  onChange={handleSearchChange}
                  className="w-full bg-transparent p-3 pr-10 border rounded-md shadow-sm focus:outline-none"
                  name="search"
                  placeholder="Search"
                />
                <button className="absolute right-2 top-1 p-2 transition-colors hover:text-blue-500 focus:outline-none">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
              </div>
            </div>
            <h1 className="text-lg font-semibold">Total Posts: {totalPost}</h1>
          </div>
          <div className="px-10">
            <Select
              value={dataLimit.toString()}
              onValueChange={(value) => {
                setDataLimit(parseInt(value))
                setPage(1);
              }}
            >
              <SelectTrigger
                value={'username'}
                className="w-full max-w-[100px] no-outline py-6 shadow text-sm rounded-md"
              >
                <SelectValue placeholder="Select a gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    limit.map((limit) => (
                      <SelectItem value={limit.toString()}>{limit}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto p-10 py-5">
          {sortedPosts.length > 0 ? (
            <table className="min-w-full">
              <thead className="border rounded-md">
                <tr>
                  <th className="py-3 px-4 text-left">Post</th>
                  <th onClick={() => handleSort('type')} className="py-3 px-4 text-left cursor-pointer">Type</th>
                  <th onClick={() => handleSort('username')} className="py-3 px-4 text-left cursor-pointer">Username</th>
                  <th onClick={() => handleSort('caption')} className="py-3 px-4 text-left cursor-pointer">Caption</th>
                  <th onClick={() => handleSort("postCount")} className="py-3 px-4 text-left cursor-pointer">Post count</th>
                  <th onClick={() => handleSort('likeCount')} className="py-3 px-4 text-left cursor-pointer">Likes</th>
                  <th onClick={() => handleSort('commentCount')} className="py-3 px-4 text-left cursor-pointer">Comments</th>
                  <th onClick={() => handleSort("reportCount")} className="py-3 px-4 text-left cursor-pointer">Report count</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              {sortedPosts.map((post) => (
                <tbody key={post._id} className="border">
                  <tr className="">
                    <td className="py-2 px-4">
                      {
                        post.post[0].type === 'image' ?
                          <img
                            onClick={() => handleModal(post.post[0].url, post.post[0].type)}
                            src={post.post[0].url.toString()}
                            alt="upload"
                            className="w-[35px] h-[35px] rounded-md object-cover cursor-pointer"
                          /> : <video
                            onClick={() => handleModal(post.post[0].url, post.post[0].type)}
                            src={post.post[0].url.toString()}
                            className="w-[35px] h-[35px] rounded-md object-cover cursor-pointer"
                          />
                      }

                    </td>
                    <td className="py-2 px-4">{post.post[0].type}</td>
                    <td className="py-2 px-4">{post.userId.username}</td>
                    <td className="py-2 px-4">{post.caption || "-------------"}</td>
                    <td className="py-2 px-4">{post.post.length}</td>
                    <td className="py-2 px-4">{post.likeCount} </td>
                    <td className="py-2 px-4">{post.commentCount} </td>
                    <td className="py-2 px-4">{post.reportDetials.length} </td>
                    <td className="py-2 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">Action</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Reports</DropdownMenuItem>
                          <DropdownMenuItem>View Comments</DropdownMenuItem>
                          <DropdownMenuItem>Block</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                </tbody>
              ))}
              <tfoot className="border">
                <tr>
                  <td className="py-2 px-4 font-bold" colSpan={7}>
                    <div className={`flex items-center ${!(totalPost !== 0 && page === 1 && isDisabled) ? "justify-between" : "justify-end"}`}>
                      {!(totalPost !== 0 && page === 1 && isDisabled) && (
                        <div className="flex gap-4">
                          <Button
                            disabled={page === 1}
                            onClick={handlePrevPage}
                            variant="outline"
                          >
                            &lt;&lt;
                          </Button>
                          <Button
                            disabled={isDisabled}
                            onClick={handleNextPage}
                            variant="outline"
                          >
                            &gt;&gt;
                          </Button>
                        </div>
                      )}
                      <h1 className="p-2">Total Posts: {posts.length}</h1>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : totalPost === 0 ? (
            <h1>Post Not found in Database</h1>
          ) : (
            <h1>No search result</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default PostDetialsTable
