import { BrowserRouter as Router } from "react-router-dom";

import { SocketProvider } from "./context/SocketProvider";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import MainRoutes from "./routes/MainRoutes";
import InactivityRefresh from "./InactivityRefresh";

function App() {
  return (
    <Router>
      <SocketProvider>
        <MainRoutes />
      </SocketProvider>
      <InactivityRefresh />
    </Router>
  );
}

export default App;
