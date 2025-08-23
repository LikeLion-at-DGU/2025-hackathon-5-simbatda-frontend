import { useState, useEffect } from "react";
import { toggleStoreStatus } from "../api/seller";

const STORE_STATUS_KEY = "store_open_status";

export const useStoreStatus = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem(STORE_STATUS_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem(STORE_STATUS_KEY, JSON.stringify(isOpen));
  }, [isOpen]);

  const handleToggleOpenStatus = async () => {
    try {
      console.log("현재 영업 상태:", isOpen);
      console.log("영업 상태 변경 요청 중...");

      const result = await toggleStoreStatus();
      console.log("API 응답:", result);

      if (result && typeof result.is_open === "boolean") {
        setIsOpen(result.is_open);
        alert(
          `영업 상태가 ${
            result.is_open ? "영업중" : "마감"
          }으로 변경되었습니다.`
        );
        console.log("영업 상태 업데이트 완료:", result.is_open);
        return { success: true };
      } else {
        const fallbackMsg =
          "상점 정보가 없습니다. 상점 등록을 먼저 완료하세요.";
        alert(fallbackMsg);
        return { success: false, message: fallbackMsg };
      }
    } catch (err) {
      console.error("Failed to toggle store status:", err);
      const msg = err?.message || "영업 상태 변경에 실패했습니다.";
      alert(msg);
      return { success: false, message: msg };
    }
  };

  return {
    isOpen,
    setIsOpen,
    handleToggleOpenStatus,
  };
};
