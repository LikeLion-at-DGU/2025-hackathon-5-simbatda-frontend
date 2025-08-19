import { useState, useEffect } from "react";
import { getStoredTokens } from "../api/client";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = () => {
      try {
        // localStorage에서 사용자 정보 확인
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
          const parsedUser = JSON.parse(userInfo);
          setUserRole(parsedUser.role || "consumer");
        } else {
          // 토큰이 있지만 사용자 정보가 없는 경우 기본값
          const { accessToken } = getStoredTokens();
          setUserRole(accessToken ? "consumer" : null);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking user role:", error);
        setUserRole(null);
        setIsLoading(false);
      }
    };

    checkUserRole();

    // localStorage 변경 감지
    const handleStorageChange = () => {
      checkUserRole();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const isConsumer = userRole === "consumer";
  const isSeller = userRole === "seller";

  return { userRole, isConsumer, isSeller, isLoading };
};
