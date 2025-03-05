import { Navigate } from "react-router-dom";
import SignIn from "../pages/user/SignIn";
import SignUp from "../pages/user/SignUp";
import Otp from "../pages/user/Otp";
import ForgotPassword from "../pages/user/ForgetPassword";
import Home from "../pages/user/Home";
import Profile from "../pages/user/Profile";
import EditProfile from "../pages/user/EditProfile";
import ResetPassword from "../pages/user/ResetPassword";
import CreatePost from "../pages/user/CreatePost";
import AdminSignIn from "../pages/admin/AdminSignIn";
import Dashboard from "@/pages/admin/Dashboard";
import Users from "@/pages/admin/Users";
import Music from "@/pages/admin/Music";
import UserProfile from "@/pages/user/UserProfile";
import Chats from "@/pages/user/ChatsInbox";
import ChatInbox from "@/pages/user/ChatsInbox";
import Search from "@/pages/user/Search";
import AdminProfile from "@/pages/admin/AdminProfile";
import Notification from "@/pages/user/Notification";
import Calls from "@/pages/user/Calls";
import Verification from "@/pages/user/Verification";
import Subscription from "@/pages/admin/Subscription";
import Post from "@/pages/user/Post";
import Error from "@/pages/user/Error";
import Reels from "@/pages/user/Reels";
import ReelsMain from "@/pages/user/ReelsMain";

const createRoutes = (currentUser: boolean, currentAdmin: boolean) => [
  {
    path: "/",
    element: currentUser ? <Home /> : <Navigate to="/sign-in" replace />,
  },
  {
    path: "/profile",
    element: currentUser ? <Profile /> : <Navigate to="/sign-in" replace />,
  },
  {
    path: "/edit-profile",
    element: currentUser ? <EditProfile /> : <Navigate to="/sign-in" replace />,
  },
  {
    path: "/sign-in",
    element: currentUser ? <Navigate to="/" replace /> : <SignIn />,
  },
  {
    path: "/sign-up",
    element: currentUser ? <Navigate to="/" replace /> : <SignUp />,
  },
  {
    path: "/otp",
    element: currentUser ? <Navigate to="/" replace /> : <Otp />,
  },
  {
    path: "/forgot-password",
    element: currentUser ? <Navigate to="/" replace /> : <ForgotPassword />,
  },
  {
    path: "/reset-password/:_id/:token",
    element: currentUser ? <Navigate to="/" replace /> : <ResetPassword />,
  },
  {
    path: "/create-post/:type",
    element: currentUser ? <CreatePost /> : <Navigate to="/sign-in" replace />,
  },
  {
    path: "/chats",
    element: currentUser ? <ChatInbox /> : <Navigate to="/sign-in" replace />,
  },
  {
    path: "/chats/:chatId",
    element: currentUser ? <Chats /> : <Navigate to="/sign-in" replace />,
  },
  {
    path: "/search",
    element: currentUser ? <Search /> : <Navigate to="/sign-in" replace />,
  },
  {
    path: "/user/:username",
    element: currentUser ? <UserProfile /> : <Navigate to="/sign-in" replace />,
  },
  {
    path: "/notification",
    element: currentUser ? <Notification /> : <Navigate to="/sign-in" replace />,
  },
  {
    path: "/calls",
    element: currentUser ? <Calls /> : <Navigate to='/sign-in' replace />
  },
  {
    path: "/verification",
    element: currentUser ? <Verification /> : <Navigate to='/sign-in' replace />
  },
  {
    path: "/post/:postId",
    element: currentUser ? <Post /> : <Navigate to='/sign-in' replace />
  },
  {
    path: "/reels",
    element: currentUser ? <ReelsMain /> : <Navigate to='/sign-in' replace />
  },
  {
    path: "/reels/:reelId",
    element: currentUser ? <Reels /> : <Navigate to='/sign-in' replace />
  },
  {
    path: "/error",
    element: currentUser ? <Error /> : <Navigate to='/sign-in' replace />
  },
  {
    path: "/admin/sign-in",
    element: currentAdmin ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <AdminSignIn />
    ),
  },
  {
    path: "/admin/dashboard",
    element: currentAdmin ? (
      <Dashboard />
    ) : (
      <Navigate to="/admin/sign-in" replace />
    ),
  },
  {
    path: "/admin/users",
    element: currentAdmin ? (
      <Users />
    ) : (
      <Navigate to="/admin/sign-in" replace />
    ),
  },
  {
    path: "/admin/music",
    element: currentAdmin ? (
      <Music />
    ) : (
      <Navigate to="/admin/sign-in" replace />
    ),
  },
  {
    path: "/admin/profile",
    element: currentAdmin ? (
      <AdminProfile />
    ) : (
      <Navigate to="/admin/sign-in" replace />
    ),
  },
  {
    path: "/admin/subscription",
    element: currentAdmin ? (
      <Subscription />
    ) : (
      <Navigate to="/admin/sign-in" replace />
    ),
  },
];

export default createRoutes;
