import { AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const VerificationFailed = () => {

  const navigate = useNavigate();

  return (
    <div className="w-full overflow-auto scrollbar-hidden flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 mx-auto border-2 rounded-lg">
        <div className="flex flex-col items-center text-center">
          <AlertCircle
            className="w-16 h-16 text-red-500 mb-6"
            strokeWidth={2}
          />

          <h1 className="text-2xl font-bold mb-3">
            Payment Failed
          </h1>

          <p className="mb-4">
            We were unable to process your payment. Please check your payment details and try again.
          </p>

          <div className="flex gap-4">
            <button
              className="px-6 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors duration-200"
              onClick={() => navigate(-1)}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerificationFailed
