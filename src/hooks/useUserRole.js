import { useState, useEffect, useMemo, useRef } from "react";
import { getStoredTokens } from "../api/client";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  // 초기 사용자 역할 확인 (한 번만 실행)
  useEffect(() => {
    if (initialized.current) return;

    const checkUserRole = () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
          const parsedUser = JSON.parse(userInfo);
          setUserRole(parsedUser.role || "consumer");
        } else {
          const { accessToken } = getStoredTokens();
          setUserRole(accessToken ? "consumer" : null);
        }
        setIsLoading(false);
        initialized.current = true;
      } catch (error) {
        console.error("Error checking user role:", error);
        setUserRole(null);
        setIsLoading(false);
        initialized.current = true;
      }
    };

    checkUserRole();
  }, []);

  // 계산된 값들을 useMemo로 메모이제이션
  const isConsumer = useMemo(() => userRole === "consumer", [userRole]);
  const isSeller = useMemo(() => userRole === "seller", [userRole]);

  // 직접 객체 반환
  return {
    userRole,
    isConsumer,
    isSeller,
    isLoading,
  };
};
