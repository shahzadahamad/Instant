import { Button } from "@/components/ui/button";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { Slider } from "@mui/material";
import MessageProfile from "../MessageProfile";
import MessageMenu from "./MessageMenu";
import EmojiReaction from "./EmojiReaction";

const AudioMessage = () => {
  return (
    <>
      <div className="relative flex items-center group gap-2 px-3 pb-7">
        <MessageProfile />
        <div className="w-48 flex items-center justify-start gap-5 border rounded-2xl p-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="w-8 h-8 p-0 flex items-center justify-center rounded-full border"
            >
              <PlayIcon />
            </Button>
            <div>
              <span className="text-sm w-full">0:09</span>
            </div>
          </div>
          <div className="flex flex-col w-20">
            <Slider size="small" value={0} valueLabelDisplay="off" />
          </div>
        </div>
        <EmojiReaction value={true} />
        <MessageMenu />
      </div>

      <div className="relative flex group items-center justify-end gap-3 px-3 pb-7">
        <MessageMenu />
        <div className="w-48 bg-[#0084ff] text-white flex items-center justify-start gap-5 border rounded-2xl p-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="w-8 h-8 p-0 hover:bg-[#3ea2ff] flex items-center justify-center rounded-full border border-white"
            >
              <PlayIcon />
            </Button>
            <div>
              <span className="text-sm w-full">0:09</span>
            </div>
          </div>
          <div className="flex flex-col w-20">
            <Slider
              size="small"
              sx={{
                color: "white",
              }}
              value={0}
              valueLabelDisplay="off"
            />
          </div>
        </div>
        <EmojiReaction value={false} />
      </div>
    </>
  );
};

export default AudioMessage;
