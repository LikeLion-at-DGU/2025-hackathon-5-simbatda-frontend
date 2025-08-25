import { Outlet } from "react-router-dom";
import "./styles/global.css";
import { OrderAcceptanceProvider } from "./contexts/OrderAcceptanceContext";
import OrderAcceptanceModal from "./components/common/modal/OrderAcceptanceModal";

function App() {
  return (
    <OrderAcceptanceProvider>
      <div className="app">
        <Outlet />
        <OrderAcceptanceModal />
      </div>
    </OrderAcceptanceProvider>
  );
}

export default App;
