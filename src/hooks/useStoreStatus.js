import { useState, useEffect } from "react";
import { toggleStoreStatus, getSellerStore } from "../api/seller";

let globalIsOpen = false;
let globalListeners = new Set();

const updateGlobalState = (newState) => {
  globalIsOpen = newState;
  globalListeners.forEach((listener) => listener(newState));
};

export const useStoreStatus = () => {
  const [isOpen, setIsOpen] = useState(globalIsOpen);

  useEffect(() => {
    const listener = (newState) => {
      setIsOpen(newState);
    };

    globalListeners.add(listener);

    return () => {
      globalListeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    const fetchStoreStatus = async () => {
      try {
        const storeData = await getSellerStore();
        if (storeData && storeData.length > 0) {
          const store = storeData[0];
          if (typeof store.is_open === "boolean") {
            updateGlobalState(store.is_open);
          }
        }
      } catch (error) {
        console.error("상점 상태 가져오기 실패:", error);
      }
    };

    if (globalIsOpen === false && globalListeners.size === 1) {
      fetchStoreStatus();
    }
  }, []);

  const handleToggleOpenStatus = async () => {
    try {
      console.log("현재 영업 상태:", isOpen);
      console.log("영업 상태 변경 요청 중...");

      const result = await toggleStoreStatus();
      console.log("API 응답:", result);

      if (result && typeof result.is_open === "boolean") {
        updateGlobalState(result.is_open);
        alert(
          `영업 상태가 ${result.is_open ? "open" : "close"}으로 변경되었습니다.`
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
