import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const VerificationContent = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const plans = {
    monthly: {
      price: 99,
      period: 'month',
      savings: '0%',
      features: [
        'Access to all features',
        'Priority support',
        'Regular updates',
        'Cancel anytime'
      ]
    },
    yearly: {
      price: 999,
      period: 'year',
      savings: '15%',
      features: [
        'All monthly features',
        'Save 15%',
        'Premium support',
        'Team collaboration'
      ]
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
          value={selectedPlan}
          onValueChange={setSelectedPlan}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {Object.entries(plans).map(([planType, plan]) => (
            <div key={planType} className={`relative ${selectedPlan === planType ? 'scale-105' : ''} transition-all`}>
              <RadioGroupItem value={planType} id={planType} className="absolute hidden" />
              <label htmlFor={planType} className="cursor-pointer block h-full">
                <Card className={`h-full transition-all border-2 ${selectedPlan === planType
                  ? 'border-[#2e9bf0] shadow-lg'
                  : 'border-gray-200'
                  }`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === planType
                          ? 'border-[#2e9bf0]'
                          : 'border-gray-300'
                          }`}>
                          {selectedPlan === planType && (
                            <div className="w-3 h-3 rounded-full bg-[#2e9bf0]" />
                          )}
                        </div>
                        <span className="capitalize">{planType}</span>
                      </div>
                      {planType === 'yearly' && (
                        <span className="text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md border border-blue-600 transform transition-all hover:scale-105">
                          Save {plan.savings}!
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
                      {plan.features.map((feature, index) => (
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
          <span className="text-6xl font-bold">₹{plans[selectedPlan].price}</span>
          <span className="opacity-90">/{plans[selectedPlan].period}</span>
        </div>
        <button className="w-1/3 rounded-full p-3 text-white bg-[#2e9bf0]">
          Confirm & Pay
        </button>
      </div>
    </>
  );
};

export default VerificationContent;
