import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/authentication/Signin";
import SignUp from "./components/authentication/Signup";
import Otp from "./components/authentication/Otp";
import ForgotPassword from "./components/authentication/ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
