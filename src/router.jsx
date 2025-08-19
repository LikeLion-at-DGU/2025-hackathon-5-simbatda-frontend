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
import Splash from "./pages/common/Splash.jsx";
import WishList from "./pages/main/WishList.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import SellerProtectedRoute from "./components/common/SellerProtectedRoute.jsx";
import ConsumerProtectedRoute from "./components/common/ConsumerProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: (
          <ConsumerProtectedRoute>
            <MainPage />
          </ConsumerProtectedRoute>
        ),
      },
      {
        path: "mainpage",
        element: (
          <ConsumerProtectedRoute>
            <MainPage />
          </ConsumerProtectedRoute>
        ),
      },
      { path: "test", element: <TestPage /> },
      { path: "signin", element: <Signin /> },
      { path: "signin-seller", element: <SigninSeller /> },
      { path: "signup", element: <Signup /> },
      { path: "signup-seller", element: <SignupSeller /> },
      {
        path: "store-registration",
        element: (
          <SellerProtectedRoute>
            <StoreRegistration />
          </SellerProtectedRoute>
        ),
      },
      {
        path: "store-document-upload",
        element: (
          <SellerProtectedRoute>
            <StoreDocumentUpload />
          </SellerProtectedRoute>
        ),
      },
      {
        path: "mainpage-seller",
        element: (
          <SellerProtectedRoute>
            <MainPageSeller />
          </SellerProtectedRoute>
        ),
      },
      {
        path: "order-in-progress",
        element: (
          <SellerProtectedRoute>
            <OrderInProgress />
          </SellerProtectedRoute>
        ),
      },
      {
        path: "order-detail",
        element: (
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "order-completed",
        element: (
          <SellerProtectedRoute>
            <OrderCompleted />
          </SellerProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <SellerProtectedRoute>
            <div>대시보드</div>
          </SellerProtectedRoute>
        ),
      },
      {
        path: "inventory",
        element: (
          <SellerProtectedRoute>
            <div>재고관리</div>
          </SellerProtectedRoute>
        ),
      },
      {
        path: "product-register",
        element: (
          <SellerProtectedRoute>
            <ProductRegister />
          </SellerProtectedRoute>
        ),
      },
      {
        path: "registeration/:productId",
        element: (
          <ConsumerProtectedRoute>
            <Registeration />
          </ConsumerProtectedRoute>
        ),
      },
      { path: "splash", element: <Splash /> },
      {
        path: "wishlist",
        element: (
          <ConsumerProtectedRoute>
            <WishList />
          </ConsumerProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
