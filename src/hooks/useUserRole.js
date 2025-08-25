import { useState, useEffect, useMemo, useRef } from "react";
import { getStoredTokens } from "../api/client";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

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

  const isConsumer = useMemo(() => userRole === "consumer", [userRole]);
  const isSeller = useMemo(() => userRole === "seller", [userRole]);

  return {
    userRole,
    isConsumer,
    isSeller,
    isLoading,
  };
};
