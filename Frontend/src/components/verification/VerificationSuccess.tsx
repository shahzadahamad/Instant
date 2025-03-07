import { CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerificationSuccess = () => {

  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/profile");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="w-full overflow-auto scrollbar-hidden flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 mx-auto border-2 rounded-lg">
        <div className="flex flex-col items-center text-center">
          <CheckCircle
            className="w-16 h-16 text-green-500 mb-6"
            strokeWidth={2}
          />

          <h1 className="text-2xl font-bold mb-3">
            Payment Successful!
          </h1>

          <p className="mb-4">
            Your payment has been processed successfully.
          </p>

          <p className="text-sm text-gray-500 mb-4">
            Redirecting to your profile in <span className="font-semibold">{countdown}</span> seconds...
          </p>

          <div className="flex gap-4">
            <button
              className="px-6 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors duration-200"
              onClick={() => navigate('/profile')}
            >
              Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerificationSuccess
