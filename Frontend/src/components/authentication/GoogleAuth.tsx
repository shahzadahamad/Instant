import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase/farebase";
import apiClient from "../../apis/apiClient";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/userSlice";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
      const currentUser = response.data.user;
      localStorage.setItem("token", token);
      dispatch(loginSuccess(currentUser));
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
        setLoading(false);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleGoogleClick}
        className={`h-[2.583rem] outline-none font-bold border rounded-md bg-transparent text-sm hover:bg-white hover:text-black transition-colors flex justify-center items-center w-full 
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
            <span className="ml-2">Google</span>
          </>
        )}
      </button>
    </div>
  );
};

export default GoogleAuth;
