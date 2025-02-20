import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import { useState } from "react";
import { AxiosError } from "axios";
import { createSubcriptionSchema } from "@/validations/authValidations";
import { editSubcription, toggleListing } from "@/apis/api/adminApi";

const SubscriptionActions: React.FC<{
  id: string;
  isListed: boolean;
  period: string;
  fetchSubscriptionPlans: (page: number) => void;
  page: number;
  price: number;
  offer: number
}> = ({ id, isListed, period, fetchSubscriptionPlans, page, price, offer }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [periodInput, setPeriodInput] = useState<string>(period);
  const [priceInput, setPriceInput] = useState<string | number>(price);
  const [offerInput, setOfferInput] = useState<string | number>(offer);

  const handleAction = async (
    e: React.MouseEvent<HTMLDivElement>,
    id: string,
    isListed: boolean,
  ) => {
    e.preventDefault();
    const status = isListed ? "unlist" : "list";
    try {
      await toggleListing(id, status)
      toast.success(`Subscription has been ${status === "unlist" ? "unlisted" : "listed"}`);
      fetchSubscriptionPlans(page);
      return;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.log(error);
        const errorMsg = error.response.data?.error || "An error occurred";
        toast.error(errorMsg);
        setLoading(false);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const parsed = createSubcriptionSchema.safeParse({
      period: periodInput,
      price: String(priceInput),
      offer: String(offerInput),
    });
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((err) => err.message);
      toast.error(errorMessages[0]);
      setLoading(false);
      return;
    }
    toast.dismiss();

    const formData = {
      period: periodInput,
      price: Number(priceInput),
      offer: Number(offerInput),
    }

    try {
      const response = await editSubcription(formData, id);
      fetchSubscriptionPlans(1);
      toast.success(response.data.message);
      setLoading(false);
      onOpenChange();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.log(error);
        const errorMsg = error.response.data?.error || "An error occurred";
        toast.error(errorMsg);
        setLoading(false);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
        setLoading(false);
      }
    }
  };

  const handleModalChange = (isOpen: boolean) => {
    if (!isOpen) {
      setPeriodInput(period);
    }
    onOpenChange();
  };

  return (
    <>
      <Modal isOpen={isOpen} size="lg" onOpenChange={handleModalChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center border-1">
                Edit Subscription
              </ModalHeader>
              <ModalBody className="p-8 border-1 w-full h-full flex flex-col gap-6">
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex flex-col">
                    <label htmlFor="title" className="mb-2 text-sm font-medium">
                      Period
                    </label>
                    <select id="period" name="period" onChange={(e) => {
                      setPeriodInput(e.target.value)
                    }}
                      value={periodInput} className="p-3 border outline-none bg-transparent shadow text-sm rounded-md">
                      <option value="monthly" className="bg-gray-200 text-black">Monthly</option>
                      <option value="yearly" className="bg-gray-200 text-black">Yearly</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex flex-col">
                    <label htmlFor="title" className="mb-2 text-sm font-medium">
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      placeholder="Enter Price"
                      className="p-3 border outline-none bg-transparent hide-arrows shadow text-sm rounded-md"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex flex-col">
                    <label htmlFor="title" className="mb-2 text-sm font-medium">
                      Offer
                    </label>
                    <input
                      type="number"
                      id="title"
                      value={offerInput}
                      onChange={(e) => setOfferInput(e.target.value)}
                      placeholder="Enter Offer"
                      className="p-3 border outline-none hide-arrows bg-transparent shadow text-sm rounded-md"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="ghost"
                    onClick={handleSubmit}
                    style={{ minWidth: "100px" }}
                    className={`border ${loading && "opacity-60 cursor-not-allowed"
                      }`}
                  >
                    {loading ? <div className="spinner"></div> : "Submit"}
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Action</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onOpen}>Edit Subscription</DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleAction(e, id, isListed)}
          >
            {isListed ? "Unlist" : "List"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default SubscriptionActions;
