import { useState, useEffect, useCallback, useRef } from "react";
import { getStoredTokens } from "../api/client";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  // 초기 인증 상태 확인 (한 번만 실행)
  useEffect(() => {
    if (initialized.current) return;

    const checkAuth = () => {
      const { accessToken } = getStoredTokens();
      setIsAuthenticated(!!accessToken);
      setIsLoading(false);
      initialized.current = true;
    };

    checkAuth();
  }, []);

  // logout 함수를 useCallback으로 메모이제이션
  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    setIsAuthenticated(false);
  }, []);

  // 직접 객체 반환
  return {
    isAuthenticated,
    isLoading,
    logout,
  };
};
