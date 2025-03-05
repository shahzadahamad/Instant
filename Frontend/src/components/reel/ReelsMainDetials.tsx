import { getReels } from "@/apis/api/userApi";
import { setReels } from "@/redux/slice/postSlice";
import { AxiosError } from "axios";
import { useEffect } from "react"
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ReelsMainDetials = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {

    const fetchReels = async () => {

      try {
        const reelData = await getReels(import.meta.env.VITE_REEL_ID, 0);
        dispatch(setReels(reelData));
        navigate(`/reels/${reelData[0]._id}`)
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          console.error(error.response.data?.error || "An error occurred");
          toast.error(error.response.data?.error || "An error occurred");
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred");
        }
      }
    };

    fetchReels();

    return () => { }
  }, [dispatch, navigate])


  return <></>
}

export default ReelsMainDetials
