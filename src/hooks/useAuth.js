import { useState, useEffect } from "react";
import { getStoredTokens } from "../api/client";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const { accessToken } = getStoredTokens();
      setIsAuthenticated(!!accessToken);
      setIsLoading(false);
    };

    checkAuth();

    // localStorage 변경 감지
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, logout };
};
