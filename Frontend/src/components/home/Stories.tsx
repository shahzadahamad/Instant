import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

const Stories = () => {

  const defaultArray: string[] = Array.from({ length: 15 }, (_, index) =>
    (index + 1).toString()
  );

  return (
    <div className="w-screen relative border-b-[1px] border-[#333232] overflow-x-auto h-[120px] text-nowrap scrollbar-hidden content-center p-3">
      <div className="inline-block mx-3 w-[70px]  p-[2.5px] bg-gradient-to-r  from-[#b5347c] via-[#eb1c25] to-[#fdcd23] rounded-full relative">
        <div className="rounded-full border-2 border-black">
          <img
            src="./avatar1.jpg"
            alt="image"
            className="w-[70px] h-auto rounded-full"
          />
          <FontAwesomeIcon
            icon={faCirclePlus}
            className="text-[#0095F6] rounded-full bg-white absolute bottom-0 right-0 w-6 h-6"
          />
        </div>
      </div>
      {defaultArray.map(() => (
        <div className="inline-block mx-2 w-[70px]  p-[2.5px] bg-gradient-to-r from-[#b5347c] via-[#eb1c25] to-[#fdcd23] rounded-full">
          <div className="rounded-full border-2 border-black">
            <img
              src="./avatar.png"
              alt="image"
              className="w-[70px] h-auto rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stories;
