import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import createRoutes from "./createRoutes";

const MainRoutes = () => {

  const { currentUser } = useSelector((state: RootState) => state.user);
  const { currentAdmin } = useSelector((state: RootState) => state.admin);

  const routes = createRoutes(!!currentUser, !!currentAdmin);

  return (

    <Routes>
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>

  )
}

export default MainRoutes
