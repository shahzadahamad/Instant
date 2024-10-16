import { reportPost } from "@/apis/api/userApi";
import { PostReportModalProps } from "@/types/profile/profile";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@nextui-org/modal";
import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const PostReportModal: React.FC<PostReportModalProps> = ({
  openReportModal,
  handleReportModalOpenAndClose,
  postId,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const handleReasonSelect = async (reason: string) => {
    if (loading) {
      return;
    }
    setSelectedReason(reason);
    setLoading(true);
    try {
      const response = await reportPost(reason, postId);
      setTimeout(() => {
        handleReportModalOpenAndClose(!openReportModal);
        toast.success(response + `\n Thanks for your feedback`);
        setLoading(false);
      }, 1000);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.log(error);
        const errorMsg = error.response.data?.error || "An error occurred";
        toast.error(errorMsg);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={openReportModal}
        size="lg"
        className="relative flex items-center preventbutton justify-center"
        onOpenChange={() => handleReportModalOpenAndClose(!openReportModal)}
        hideCloseButton={true}
      >
        <ModalContent>
          <ModalHeader>
            <div className="w-full flex justify-between items-center">
              <h1 className="text-lg font-semibold">Report</h1>
            </div>
          </ModalHeader>
          <ModalBody className="w-full p-0 flex flex-col border-t gap-0">
            <div className="w-full h-[22.5rem] overflow-y-auto scrollbar-hidden rounded-lg">
              <div className="p-5 rounded-t-lg">
                <h1 className="font-semibold text-lg">
                  Why are you reporting this post?
                </h1>
                <p className="text-sm dark:text-[#c5cacc] text-[#6d777b]">
                  Please select a reason below
                </p>
              </div>
              <div className="p-4 space-y-2">
                {[
                  "Bullying or unwanted contact",
                  "Hate speech or symbols",
                  "False information",
                  "Spam or misleading",
                  "Violence or harmful behavior",
                  "Intellectual property violation",
                  "Sexual content or nudity",
                  "Terrorism or organized crime",
                  "Child exploitation",
                  "Promotion of drug use",
                  "Self-harm or suicide",
                  "Fraud or scam",
                  "Animal cruelty",
                  "Inappropriate language",
                  "Unauthorized commercial activity",
                  "Other",
                ].map((reason, index) => (
                  <div
                    key={index}
                    onClick={() => handleReasonSelect(reason)}
                    className="p-3 border flex items-center justify-between rounded-md dark:hover:bg-gray-800 hover:bg-gray-200 transition-all cursor-pointer"
                  >
                    <h2 className="text-sm">{reason}</h2>
                    {loading && selectedReason === reason && (
                      <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-blue-500 border-t-transparent"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div
              onClick={() => handleReportModalOpenAndClose(!openReportModal)}
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

export default PostReportModal;
