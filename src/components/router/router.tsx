import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Routes,
} from "react-router-dom";
import { ROUTES } from "./route";

const Router = () => (
    <Routes>
        {
            ROUTES.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
            ))
        }
    </Routes>
)

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     ROUTES.map((route) => (
//       <Route key={route.path} path={route.path} element={route.element} />
//     ))
//   )
// );

export default Router;