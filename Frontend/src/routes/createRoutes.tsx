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
    path: "/create-post",
    element: currentUser ? <CreatePost /> : <Navigate to="/sign-in" replace />,
  },
  {
    path: "/admin/sign-in",
    element: currentAdmin ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <AdminSignIn />
    ),
  },
];

export default createRoutes;
