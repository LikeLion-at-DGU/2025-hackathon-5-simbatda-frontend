import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import TestPage from "./pages/common/TestPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <div>홈페이지</div> },
      { path: "test", element: <TestPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "dashboard", element: <div>대시보드</div> },
      { path: "inventory", element: <div>재고관리</div> },
    ],
  },
]);

export default router;
