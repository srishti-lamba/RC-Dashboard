import './App.css';
import Sidebar from './components/sidebar/sidebar';
import { BrowserRouter } from "react-router-dom";
import Router from './components/router/router';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar />
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
