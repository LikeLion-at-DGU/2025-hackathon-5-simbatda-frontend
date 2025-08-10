import { Outlet } from "react-router-dom";
import "./styles/global.css";

function App() {
  return (
    <div className="app">
      <header>
        <nav>
          <h1>재고 관리 시스템</h1>
          {/* 네비게이션 메뉴가 들어갈 자리 */}
        </nav>
      </header>

      <main>
        <Outlet /> {/* 여기에 각 페이지가 들어감 */}
      </main>
    </div>
  );
}

export default App;
