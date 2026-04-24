import './App.css';
import NewReservations from './components/new-reservations/new-reservations';
import Sidebar from './components/sidebar/sidebar';
import { BrowserRouter, RouterProvider } from "react-router-dom";
import router from "./components/router/router";
import Router from './components/router/router';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar />
        {/* <RouterProvider router={router} /> */}
        {/* <NewReservations /> */}
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
