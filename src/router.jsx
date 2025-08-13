import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signin from "./pages/auth/Signin";
import SigninSeller from "./pages/auth/SigninSeller";
import Signup from "./pages/auth/Signup";
import SignupSeller from "./pages/auth/SignupSeller";
import TestPage from "./pages/common/TestPage";
import Mainpage from "./pages/main/Mainpage";
import MainpageSeller from "./pages/main/MainpageSeller";

import StoreRegistration from "./pages/auth/StoreRegistration";
import StoreDocumentUpload from "./pages/auth/StoreDocumentUpload";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Mainpage /> },
      { path: "mainpage", element: <Mainpage /> },
      { path: "test", element: <TestPage /> },
      { path: "signin", element: <Signin /> },
      { path: "signin-seller", element: <SigninSeller /> },
      { path: "signup", element: <Signup /> },
      { path: "signup-seller", element: <SignupSeller /> },
      { path: "store-registration", element: <StoreRegistration /> },
      { path: "store-document-upload", element: <StoreDocumentUpload /> },
      { path: "mainpage-seller", element: <MainpageSeller /> },
      { path: "dashboard", element: <div>대시보드</div> },
      { path: "inventory", element: <div>재고관리</div> },
    ],
  },
]);

export default router;
