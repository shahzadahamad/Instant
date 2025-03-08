import { useEffect, useState } from 'react';
import PostModal from '../common/PostViewModal/PostModal'
import { useNavigate, useParams } from 'react-router-dom';
import { GetUserPostData } from '@/types/profile/profile';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { getSinglePost } from '@/apis/api/userApi';

const PostSingle = () => {

  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState<GetUserPostData | null>(null);

  useEffect(() => {

    const fetchPostData = async () => {
      try {
        const postData = await getSinglePost(postId!);
        if (!postData.status) {
          navigate(`/error?message=This account is private. Follow the user to view their posts.&statusCode=403&data=${postData.data}`);
          setPost(null);
        } else {
          setPost(postData.data)
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          console.error(error.response.data?.error || "An error occurred");
          toast.error(error.response.data?.error || "An error occurred");
          navigate('/error/Post not found.');
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred");
        }
      }
    }
    fetchPostData()

  }, [postId, navigate])

  const closeModal = (status: boolean = false) => {
    if (status) {
      navigate(-1);
    } else {
      navigate(-1);
    }
  };

  const closeWhileTouchOutsideModal = () => {
    navigate(-1);
  }

  return (
    post && (
      <PostModal
        post={[post]}
        imageIndex={0}
        close={closeModal}
        closeWhileTouchOutsideModal={closeWhileTouchOutsideModal}
      />
    )
  )
}

export default PostSingle
