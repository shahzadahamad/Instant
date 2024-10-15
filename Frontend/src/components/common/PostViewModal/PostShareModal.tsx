import { PostShareModalProps } from "@/types/profile/profile";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@nextui-org/modal";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const PostShareModal: React.FC<PostShareModalProps> = ({
  openShareModal,
  handleShareModalOpenAndClose,
}) => {
  const pageUrl = window.location.href;
  return (
    <>
      <Modal
        isOpen={openShareModal}
        size="lg"
        className="relative flex items-center preventbutton justify-center"
        onOpenChange={() => handleShareModalOpenAndClose(!openShareModal)}
        hideCloseButton={true}
      >
        <ModalContent>
          <ModalHeader>
            <div className="w-full flex justify-between items-center">
              <h1 className="text-lg font-semibold">Share to...</h1>
            </div>
          </ModalHeader>
          <ModalBody className="w-full p-0 flex flex-col border-t gap-0">
            <div className="w-full h-[22.5rem] overflow-scroll scrollbar-hidden">
              <div className="w-full text-start p-3 border-b cursor-pointer">
                <WhatsappShareButton url={pageUrl}>
                  <div className="flex items-center gap-3">
                    <WhatsappIcon round={true} size={35} />
                    <h1 className="text-center">Share to Whatsapp</h1>
                  </div>
                </WhatsappShareButton>
              </div>
              <div className="w-full text-start p-3 border-b cursor-pointer">
                <FacebookShareButton url={pageUrl}>
                  <div className="flex items-center gap-3">
                    <FacebookIcon round={true} size={35} />
                    <h1 className="text-center">Share to Facebook</h1>
                  </div>
                </FacebookShareButton>
              </div>
              <div className="w-full text-start p-3 border-b cursor-pointer">
                <LinkedinShareButton url={pageUrl}>
                  <div className="flex items-center gap-3">
                    <LinkedinIcon round={true} size={35} />
                    <h1 className="text-center">Share to Linkedin</h1>
                  </div>
                </LinkedinShareButton>
              </div>
              <div className="w-full text-start p-3 border-b cursor-pointer">
                <TwitterShareButton url={pageUrl}>
                  <div className="flex items-center gap-3">
                    <TwitterIcon round={true} size={35} />
                    <h1 className="text-center">Share to Twitter</h1>
                  </div>
                </TwitterShareButton>
              </div>
              <div className="w-full text-start p-3 border-b cursor-pointer">
                <EmailShareButton url={pageUrl}>
                  <div className="flex items-center gap-3">
                    <EmailIcon round={true} size={35} />
                    <h1 className="text-center">Share to Mail</h1>
                  </div>
                </EmailShareButton>
              </div>
              <div className="w-full text-start p-3 border-b cursor-pointer">
                <TelegramShareButton url={pageUrl}>
                  <div className="flex items-center gap-3">
                    <TelegramIcon round={true} size={35} />
                    <h1 className="text-center">Share to Telegram</h1>
                  </div>
                </TelegramShareButton>
              </div>
            </div>
            <div
              onClick={() => handleShareModalOpenAndClose(!openShareModal)}
              className="w-full text-start p-3 border-t border-b cursor-pointer"
            >
              <h1 className="text-center">Cancel</h1>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PostShareModal;
