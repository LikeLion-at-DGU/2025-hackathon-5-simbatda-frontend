import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signin from "./pages/auth/Signin";
import SigninSeller from "./pages/auth/SigninSeller";
import Signup from "./pages/auth/Signup";
import SignupSeller from "./pages/auth/SignupSeller";
import TestPage from "./pages/common/TestPage";
import MainPage from "./pages/main/MainPage";
import MainPageSeller from "./pages/main/MainPageSeller";

import StoreRegistration from "./pages/auth/StoreRegistration";
import StoreDocumentUpload from "./pages/auth/StoreDocumentUpload";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <MainPage /> },
      { path: "mainpage", element: <MainPage /> },
      { path: "test", element: <TestPage /> },
      { path: "signin", element: <Signin /> },
      { path: "signin-seller", element: <SigninSeller /> },
      { path: "signup", element: <Signup /> },
      { path: "signup-seller", element: <SignupSeller /> },
      { path: "store-registration", element: <StoreRegistration /> },
      { path: "store-document-upload", element: <StoreDocumentUpload /> },
      { path: "mainpage-seller", element: <MainPageSeller /> },
      { path: "dashboard", element: <div>대시보드</div> },
      { path: "inventory", element: <div>재고관리</div> },
    ],
  },
]);

export default router;
