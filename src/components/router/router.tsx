import { Route, Routes } from "react-router-dom";
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

export default Router;