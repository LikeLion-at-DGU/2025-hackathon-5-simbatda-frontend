import { useState, useEffect } from "react";
import { toggleStoreStatus, getSellerStore } from "../api/seller";

let globalIsOpen = null;
let isInitialized = false;

const getCurrentUserId = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return userInfo.id;
  } catch (error) {
    console.error("사용자 ID 파싱 실패:", error);
    return null;
  }
};

export const useStoreStatus = () => {
  const [isOpen, setIsOpen] = useState(globalIsOpen);

  useEffect(() => {
    const fetchStoreStatus = async () => {
      console.log("useStoreStatus - fetchStoreStatus 시작");
      console.log("현재 전역 상태:", { globalIsOpen, isInitialized });

      const savedStatus = localStorage.getItem("storeStatus");
      if (savedStatus) {
        try {
          const { isOpen, timestamp } = JSON.parse(savedStatus);
          const isRecent = Date.now() - timestamp < 5 * 60 * 1000;

          if (isRecent && typeof isOpen === "boolean") {
            console.log("localStorage에서 최신 상태 사용:", isOpen);
            globalIsOpen = isOpen;
            isInitialized = true;
            setIsOpen(isOpen);
            return;
          }
        } catch (error) {
          console.error("localStorage 상태 파싱 실패:", error);
        }
      }

      if (isInitialized && globalIsOpen !== null) {
        console.log("전역 상태 사용:", globalIsOpen);
        setIsOpen(globalIsOpen);
        return;
      }

      try {
        console.log("백엔드에서 상점 상태 가져오는 중...");
        const storeData = await getSellerStore();
        console.log("받은 상점 데이터:", storeData);

        if (storeData && storeData.length > 0) {
          const currentUserStore = storeData.find(
            (store) => store.seller && store.seller.id === getCurrentUserId()
          );

          if (currentUserStore) {
            console.log("현재 사용자 상점 정보:", currentUserStore);
            console.log(
              "is_open 타입:",
              typeof currentUserStore.is_open,
              "값:",
              currentUserStore.is_open
            );

            if (typeof currentUserStore.is_open === "boolean") {
              console.log("상점 상태 업데이트:", currentUserStore.is_open);
              globalIsOpen = currentUserStore.is_open;
              isInitialized = true;
              setIsOpen(currentUserStore.is_open);

              localStorage.setItem(
                "storeStatus",
                JSON.stringify({
                  isOpen: currentUserStore.is_open,
                  timestamp: Date.now(),
                })
              );

              console.log("업데이트 후 전역 상태:", {
                globalIsOpen,
                isInitialized,
              });
            } else {
              console.log(
                "is_open이 boolean이 아님:",
                currentUserStore.is_open
              );
            }
          } else {
            console.log("현재 사용자의 상점을 찾을 수 없음");
          }
        } else {
          console.log("상점 데이터가 없음");
        }
      } catch (error) {
        console.error("상점 상태 가져오기 실패:", error);
      }
    };

    fetchStoreStatus();
  }, []);

  const handleToggleOpenStatus = async () => {
    try {
      const result = await toggleStoreStatus();

      if (result && typeof result.is_open === "boolean") {
        globalIsOpen = result.is_open;
        isInitialized = true;
        setIsOpen(result.is_open);

        localStorage.setItem(
          "storeStatus",
          JSON.stringify({
            isOpen: result.is_open,
            timestamp: Date.now(),
          })
        );

        alert(
          `영업 상태가 ${result.is_open ? "open" : "close"}으로 변경되었습니다.`
        );
        return { success: true };
      } else {
        alert("상점 정보가 없습니다. 상점 등록을 먼저 완료하세요.");
        return { success: false };
      }
    } catch (err) {
      console.error("Failed to toggle store status:", err);
      alert(err?.message || "영업 상태 변경에 실패했습니다.");
      return { success: false };
    }
  };

  return {
    isOpen,
    handleToggleOpenStatus,
  };
};
