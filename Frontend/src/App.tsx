import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Otp from "./pages/Otp";
import ForgotPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ResetPassword from "./pages/ResetPassword";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store/store";

function App() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const routes = [
    { path: "/", element: currentUser ? <Home /> : <Navigate to="/sign-in" replace /> },
    { path: "/profile", element: currentUser ? <Profile /> : <Navigate to="/sign-in" replace /> },
    { path: "/edit-profile", element: currentUser ? <EditProfile /> : <Navigate to="/sign-in" replace /> },
    { path: "/sign-in", element: currentUser ?  <Navigate to="/" replace /> : <SignIn /> },
    { path: "/sign-up", element: currentUser ?  <Navigate to="/" replace /> : <SignUp /> },
    { path: "/otp", element: currentUser ?  <Navigate to="/" replace /> : <Otp/> },
    { path: "/forgot-password", element: currentUser ?  <Navigate to="/" replace /> : <ForgotPassword /> },
    { path: "/reset-password/:_id/:token", element: currentUser ?  <Navigate to="/" replace /> : <ResetPassword /> },
  ]

  return (
    <Router>
      <Routes>
      {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
      </Routes>
    </Router>
  );
}

export default App;
