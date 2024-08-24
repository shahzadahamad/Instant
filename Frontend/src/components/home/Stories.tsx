import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

const Stories = () => {
  const defaultArray: string[] = Array.from({ length: 15 }, (_, index) =>
    (index + 1).toString()
  );

  return (
    <div className="border-b-[1px] border-[#333232] h-[120px] p-3 flex justify-start items-center">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hidden">
        <div className="relative flex-shrink-0 w-[70px] h-[70px]">
          <div className="p-[2.5px] bg-gradient-to-r from-[#b5347c] via-[#eb1c25] to-[#fdcd23] rounded-full relative">
            <div className="w-full h-full rounded-full border-2 border-black overflow-hidden">
              <img
                src="./avatar1.jpg"
                alt="image"
                className="object-cover w-full h-full"
              />
            </div>
            <FontAwesomeIcon
              icon={faCirclePlus}
              className="text-[#0095F6] rounded-full bg-white absolute bottom-0 right-0 w-6 h-6"
            />
          </div>
        </div>
        {defaultArray.map((_, index) => (
          <div key={index} className="relative flex-shrink-0 w-[70px] h-[70px]">
            <div className="p-[2.5px] bg-gradient-to-r from-[#b5347c] via-[#eb1c25] to-[#fdcd23] rounded-full relative">
              <div className="w-full h-full rounded-full border-2 border-black overflow-hidden">
                <img
                  src="./avatar.png"
                  alt="image"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>  
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
