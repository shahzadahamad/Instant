import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import { useState } from "react";
import { createSubcriptionSchema } from "@/validations/authValidations";
import { AxiosError } from "axios";
import { createSubcription } from "@/apis/api/adminApi";

const AddSubscriptionForm: React.FC<{ fetchSubscriptionPlans: (page: number, limit: number) => void }> = ({
  fetchSubscriptionPlans,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [period, setPeriod] = useState<string>("Monthly");
  const [price, setPrice] = useState<string>("");
  const [offer, setOffer] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleModalChange = () => {
    setPeriod("");
    setPrice("");
    setOffer("");
    onOpenChange();
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const parsed = createSubcriptionSchema.safeParse({
      period,
      price,
      offer,
    });
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((err) => err.message);
      toast.error(errorMessages[0]);
      setLoading(false);
      return;
    }
    toast.dismiss();

    try {
      const formData = {
        period,
        price: Number(price),
        offer: Number(offer),
      }
      console.log(formData)
      const response = await createSubcription(formData);
      fetchSubscriptionPlans(1, 10);
      handleModalChange();
      toast.success(response.data.message);
      setLoading(false);
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

  return (
    <>
      <Button variant="outline" className="mb-5" onClick={onOpen}>
        Add Subscription
      </Button>
      <Modal isOpen={isOpen} size="lg" onOpenChange={handleModalChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center border-1">
                Add Subscription
              </ModalHeader>
              <ModalBody className="p-8 border-1 w-full h-full flex flex-col gap-6">
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex flex-col">
                    <label htmlFor="title" className="mb-2 text-sm font-medium">
                      Period
                    </label>
                    <select id="period" name="period" onChange={(e) => {
                      setPeriod(e.target.value)
                    }}
                      value={period} className="p-3 border outline-none bg-transparent shadow text-sm rounded-md">
                      <option value="Monthly" className="bg-gray-200 text-black">Monthly</option>
                      <option value="Yearly" className="bg-gray-200 text-black">Yearly</option>
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
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
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
                      value={offer}
                      onChange={(e) => setOffer(e.target.value)}
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
    </>
  );
};

export default AddSubscriptionForm;
