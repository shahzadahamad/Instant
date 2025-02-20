import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { SubscriptionData } from '@/types/admin/subscription';
import { getSubsriptionPlans } from '@/apis/api/userApi';
import { Check } from 'lucide-react';

const VerificationContent = () => {

  const [plans, setPlans] = useState<SubscriptionData[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionData | null>(null);

  useEffect(() => {
    const fetchSubcriptionData = async () => {
      try {
        const data = await getSubsriptionPlans();
        setPlans(data)
        setSelectedPlan(data[0]);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          console.error(error.response.data?.error || "An error occurred");
          toast.error(error.response.data?.error || "An error occurred");
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred");
        }
      }
    }
    fetchSubcriptionData()
    return () => { }
  }, [])

  const handlePlanChange = (planId: string) => {
    const chosenPlan = plans.find((plan) => plan._id === planId);
    if (chosenPlan) {
      setSelectedPlan(chosenPlan);
    }
  };

  return (
    <>
      {/* Scrollable plans section */}
      <div className="flex-grow w-full flex-1 h-[68%] max-w-4xl mx-auto p-6 overflow-y-auto scrollbar-hidden">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Choose Your Plan</h1>
          <p>Select the perfect plan for your needs</p>
        </div>
        <RadioGroup
          value={selectedPlan?._id}
          onValueChange={handlePlanChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {plans.map((plan) => (
            <div key={plan._id} className={`relative ${selectedPlan?._id === plan._id ? 'scale-105' : ''} transition-all`}>
              <RadioGroupItem value={plan._id} id={plan._id} className="absolute hidden" />
              <label htmlFor={plan._id} className="cursor-pointer block h-full">
                <Card className={`h-full transition-all border-2 ${selectedPlan?._id === plan._id
                  ? 'border-[#2e9bf0] shadow-lg'
                  : 'border-gray-200'
                  }`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan?._id === plan._id
                          ? 'border-[#2e9bf0]'
                          : 'border-gray-300'
                          }`}>
                          {selectedPlan?._id === plan._id && (
                            <div className="w-3 h-3 rounded-full bg-[#2e9bf0]" />
                          )}
                        </div>
                        <span className="capitalize">{plan.period}</span>
                      </div>
                      {plan.offer > 0 && (
                        <span className="text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md border border-blue-600 transform transition-all hover:scale-105">
                          Save {plan.offer}%
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">₹{plan.price}</span>
                      <span className="opacity-90">/{plan.period}</span>
                    </div>
                    <ul className="space-y-3">
                      {['Access to all features', 'Priority support', 'Regular updates', 'Cancel anytime'].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Footer with confirm button */}
      <div className="w-full h-[20%] border-t flex gap-10 items-center justify-center">
        <div className="">
          <h1 className="text-xl">Premium</h1>
          <span className="text-6xl font-bold">₹{selectedPlan?.price}</span>
          <span className="opacity-90">/{selectedPlan?.period}</span>
        </div>
        <button className="w-1/3 rounded-full p-3 text-white bg-[#2e9bf0]">
          Confirm & Pay
        </button>
      </div>
    </>
  );
};

export default VerificationContent;
