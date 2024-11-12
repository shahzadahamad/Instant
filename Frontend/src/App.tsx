import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store/store";
import createRoutes from "./routes/createRoutes";
import { SocketProvider } from "./context/SocketProvider";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { currentAdmin } = useSelector((state: RootState) => state.admin);

  const routes = createRoutes(!!currentUser, !!currentAdmin);

  return (
    <SocketProvider>
      <Router>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
