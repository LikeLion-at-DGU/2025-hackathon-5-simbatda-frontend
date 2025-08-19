import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Signin from "./pages/auth/Signin.jsx";
import SigninSeller from "./pages/auth/SigninSeller.jsx";
import Signup from "./pages/auth/Signup.jsx";
import SignupSeller from "./pages/auth/SignupSeller.jsx";
import TestPage from "./pages/common/TestPage.jsx";
import MainPage from "./pages/main/MainPage.jsx";
import MainPageSeller from "./pages/main/MainPageSeller.jsx";
import OrderInProgress from "./pages/main/OrderInProgress.jsx";
import OrderDetail from "./pages/main/OrderDetail.jsx";
import OrderCompleted from "./pages/main/OrderCompleted.jsx";
import StoreRegistration from "./pages/auth/StoreRegistration.jsx";
import StoreDocumentUpload from "./pages/auth/StoreDocumentUpload.jsx";
import ProductRegister from "./pages/main/ProductRegister.jsx";
import Registeration from "./pages/main/Registeration.jsx";
import OrderHistory from "./pages/main/OrderHistory.jsx";

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
      { path: "order-in-progress", element: <OrderInProgress /> },
      { path: "order-detail", element: <OrderDetail /> },
      { path: "order-completed", element: <OrderCompleted /> },
      { path: "dashboard", element: <div>대시보드</div> },
      { path: "inventory", element: <div>재고관리</div> },
      { path: "product-register", element: <ProductRegister /> },
      { path: "registeration/:productId", element: <Registeration /> },
      { path: "order-history", element: <OrderHistory /> },
    ],
  },
]);

export default router;
