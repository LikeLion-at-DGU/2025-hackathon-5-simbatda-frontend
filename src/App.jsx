import { Outlet } from "react-router-dom";
import "./styles/global.css";

function App() {
  return (
    <div className="app">
      <Outlet />
    </div>
  );
}

export default App;
