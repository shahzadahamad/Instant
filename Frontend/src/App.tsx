import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/authentication/Signin";
import SignUp from "./components/authentication/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
