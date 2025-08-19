import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUserRole } from "../../hooks/useUserRole";

const ConsumerProtectedRoute = ({ children, redirectTo = "/signup" }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isConsumer, isLoading: roleLoading } = useUserRole();

  // 로딩 중일 때는 로딩 표시
  if (authLoading || roleLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        로딩 중...
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // 판매자인 경우 소비자 회원가입 페이지로 리다이렉트
  if (!isConsumer) {
    return <Navigate to={redirectTo} replace />;
  }

  // 소비자인 경우 자식 컴포넌트 렌더링
  return children;
};

export default ConsumerProtectedRoute;
