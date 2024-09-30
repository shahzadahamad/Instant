import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import AddMusicForm from "./AddMusicForm";
import { GetMusicData } from "@/types/admin/music";
import { adminApiClient } from "@/apis/apiClient";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";

const MusicDetialsTable = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [openModal, setOpenModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalMusic, setTotalMusic] = useState(0);
  const [page, setPage] = useState(1);
  const [music, setMusic] = useState<GetMusicData[]>([]);
  const [viewMusicImage, setViewMusicImage] = useState<string | File>("");
  const isDisabled = page === totalPages;

  const fetchMusic = async (page: number) => {
    try {
      const response = await adminApiClient.get(`/music/get-data`, {
        params: {
          page,
          search: searchVal,
        },
      });
      setMusic(response.data.music);
      setTotalPages(response.data.totalPages);
      setTotalMusic(response.data.totalMusic);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchMusic(page);
    return () => {};
  }, [page, searchVal]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleModal = (musicImageUrl: string | File) => {
    setViewMusicImage(musicImageUrl);
    setOpenModal(true);
    onOpen();
  };

  return (
    <>
      {openModal && (
        <Modal isOpen={isOpen} size="md" onOpenChange={onOpenChange}>
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-center border-1">
                  View Profile
                </ModalHeader>
                <ModalBody className="p-10 border-1 w-full h-full flex justify-center items-center">
                  <div className="w-[200px] h-[200px] rounded-md border overflow-hidden">
                    <img
                      src={
                        typeof viewMusicImage === "string" ? viewMusicImage : ""
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      <div className="p-10 pb-1 flex justify-between items-center">
        <div className="w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-transparent p-3 border rounded-md shadow-sm focus:outline-none"
              name="search"
              placeholder="Search"
            />
            <button className="absolute right-2 top-1 p-2 transition-colors hover:text-blue-500 focus:outline-none">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </div>
        <h1 className="text-lg font-semibold">Total Music : {totalMusic}</h1>
      </div>
      <div className="overflow-x-auto p-10">
        <AddMusicForm fetchMusic={fetchMusic} />
        {music.length > 0 ? (
          <table className="min-w-full">
            <thead className="border rounded-md">
              <tr>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Music</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            {music.map((music) => (
              <tbody key={music._id} className="border">
                <tr className="">
                  <td className="py-2 px-4">
                    <div className="w-10 h-10 rounded-md border overflow-hidden cursor-pointer mr-4">
                      <img
                        onClick={() => handleModal(music.image)}
                        src={music.image}
                        alt="Upload"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-4">{music.title}</td>
                  <td className="py-2 px-4">
                    <div className="">
                      <audio
                        id="audio"
                        controls
                        src={music.music}
                        preload="metadata"
                      ></audio>
                      {/* <div className="flex items-center justify-between border rounded-md p-5">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              className="w-12 h-12 flex items-center justify-center rounded-full border"
                              onClick={handlePlayPause}
                            >
                              {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-12 h-12 flex items-center justify-center rounded-full border"
                              onClick={handleRestart}
                            >
                              <RotateCwIcon size={13} />
                            </Button>
                          </div>
                          <canvas
                            ref={canvasRef}
                            width={300}
                            height={50}
                            className="rounded-sm"
                          />
                          <div className="">
                            <span>
                              {formatTime(currentTime)} /{formatTime(duration)}
                            </span>
                          </div>
                        </div> */}
                    </div>
                  </td>
                  <td className="py-2 px-4">Listed</td>
                  <td className="py-2 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">Action</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Edit Music</DropdownMenuItem>
                        <DropdownMenuItem>List</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              </tbody>
            ))}
            {!(totalMusic !== 0 && page === 1 && isDisabled) && (
              <tfoot className="border">
                <tr>
                  <td className="py-2 px-4 font-bold" colSpan={2}>
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
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        ) : totalMusic === 0 ? (
          <h1>User Not found in Database</h1>
        ) : (
          <h1>No search result</h1>
        )}
      </div>
    </>
  );
};

export default MusicDetialsTable;
