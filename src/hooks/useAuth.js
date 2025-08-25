import { useState, useEffect, useCallback, useRef } from "react";
import { getStoredTokens } from "../api/client";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

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

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    logout,
  };
};
