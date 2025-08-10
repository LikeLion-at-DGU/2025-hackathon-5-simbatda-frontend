import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/auth/LoginPage";
import LoginPage_m from "./pages/auth/LoginPage_m";
import SignupPage from "./pages/auth/SignupPage";
import TestPage from "./pages/common/TestPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <div>홈페이지</div> },
      { path: "test", element: <TestPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "login-m", element: <LoginPage_m /> },
      { path: "signup", element: <SignupPage /> },
      { path: "dashboard", element: <div>대시보드</div> },
      { path: "inventory", element: <div>재고관리</div> },
    ],
  },
]);

export default router;
