import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase/farebase";
import apiClient from "../../apis/apiClient";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const data = {
        fullname: result.user.displayName,
        email: result.user.email,
      };
      setLoading(true);
      const response = await apiClient.post(
        "/auth/login/google-authentication",
        data
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
      setTimeout(() => {
        navigate("/");
        toast.success("Login successful!");
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
    }
  };

  return (
    <div>
      <button
        onClick={handleGoogleClick}
        className={`w-full h-[2.583rem] outline-none rounded font-bold bg-[#DD4B39] flex items-center justify-center text-white border-[#737373]
        ${
          loading
            ? "opacity-60 cursor-not-allowed"
            : "opacity-100 cursor-pointer"
        }`}
      >
        {loading ? (
          <div className="flex items-center">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <img
              src="./google.png"
              className="w-[25px] h-auto"
              alt="Google logo"
            />
            <span className="ml-2">Continue with Google</span>
          </>
        )}
      </button>
    </div>
  );
};

export default GoogleAuth;
