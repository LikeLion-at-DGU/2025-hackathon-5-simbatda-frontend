import React, { createContext, useContext, useState, useEffect } from "react";
import { getNotifications, markNotificationAsRead } from "../api/reservations";

// 현재 사용자의 역할을 확인하는 함수
const getUserRole = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      return parsed.role || "consumer"; // 기본값은 consumer
    }
    return "consumer";
  } catch (error) {
    return "consumer";
  }
};

const OrderAcceptanceContext = createContext();

export const useOrderAcceptance = () => {
  const context = useContext(OrderAcceptanceContext);
  if (!context) {
    throw new Error(
      "useOrderAcceptance must be used within an OrderAcceptanceProvider"
    );
  }
  return context;
};

export const OrderAcceptanceProvider = ({ children }) => {
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);
  const [acceptedOrder, setAcceptedOrder] = useState(null);
  const [modalType, setModalType] = useState("accepted");

  // 위치 권한 확인 및 요청 함수
  const checkAndRequestLocationPermission = () => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "denied") {
          // 위치 권한이 거부된 경우 자동으로 권한 요청
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                // 권한이 허용되면 성공
                console.log("위치 권한이 허용되었습니다.");
              },
              (error) => {
                // 권한이 여전히 거부된 경우
                console.log("위치 권한이 거부되었습니다:", error.message);
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
              }
            );
          }
        }
      });
    }
  };

  // 주문 알림 체크 함수 (수락/거절 모두 처리)
  const checkOrderAcceptance = async () => {
    // 판매자인 경우 알림 조회하지 않음
    const userRole = getUserRole();
    if (userRole === "seller") {
      return;
    }

    try {
      const notifications = await getNotifications();

      // 읽지 않은 confirm 상태 알림 찾기 (주문 수락)
      const unreadConfirmNotification = notifications.find(
        (notification) =>
          notification.status === "confirm" && !notification.is_read
      );

      // 읽지 않은 cancel 상태 알림 찾기 (주문 거절)
      const unreadCancelNotification = notifications.find(
        (notification) =>
          notification.status === "cancel" && !notification.is_read
      );

      // 읽지 않은 completed 또는 pickup 상태 알림 찾기 (픽업완료)
      const unreadCompletedNotification = notifications.find(
        (notification) =>
          (notification.status === "completed" ||
            notification.status === "pickup") &&
          !notification.is_read
      );

      // 주문 수락 알림이 있으면 우선 표시
      if (unreadConfirmNotification) {
        const orderInfo = {
          id: unreadConfirmNotification.id,
          reservationId: unreadConfirmNotification.reservation_id,
          status: unreadConfirmNotification.status,
          createdAt: unreadConfirmNotification.created_at,
          storeName: "상점",
        };

        setAcceptedOrder(orderInfo);
        setModalType("accepted");
        setShowAcceptanceModal(true);
      }
      // 주문 거절 알림이 있으면 표시
      else if (unreadCancelNotification) {
        const orderInfo = {
          id: unreadCancelNotification.id,
          reservationId: unreadCancelNotification.reservation_id,
          status: unreadCancelNotification.status,
          createdAt: unreadCancelNotification.created_at,
          storeName: "상점",
        };

        setAcceptedOrder(orderInfo);
        setModalType("rejected");
        setShowAcceptanceModal(true);
      }
      // 픽업완료 알림이 있으면 표시
      else if (unreadCompletedNotification) {
        const orderInfo = {
          id: unreadCompletedNotification.id,
          reservationId: unreadCompletedNotification.reservation_id,
          status: unreadCompletedNotification.status,
          createdAt: unreadCompletedNotification.created_at,
          storeName: "상점",
        };

        setAcceptedOrder(orderInfo);
        // pickup 상태도 completed 모달로 표시
        setModalType("completed");
        setShowAcceptanceModal(true);
      }
    } catch (error) {
      console.error("주문 알림 확인 오류:", error);
    }
  };

  useEffect(() => {
    // 로그인 상태 확인
    const checkLoginAndLocation = () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        // 로그인된 상태에서 위치 권한 확인 및 요청
        checkAndRequestLocationPermission();
      }
    };

    // 초기 체크
    checkLoginAndLocation();
    checkOrderAcceptance();

    // 페이지가 활성화되거나 포커스될 때만 체크
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkLoginAndLocation();
        checkOrderAcceptance();
      }
    };

    const handleFocus = () => {
      checkLoginAndLocation();
      checkOrderAcceptance();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // 모달 닫기 (알림 읽음 처리)
  const closeModal = async () => {
    if (acceptedOrder) {
      try {
        // 알림 읽음 처리 API 호출
        await markNotificationAsRead(acceptedOrder.id);
      } catch (error) {
        console.error("알림 읽음 처리 실패:", error);
      }
    }

    setShowAcceptanceModal(false);
    setAcceptedOrder(null);
  };

  const value = {
    showAcceptanceModal,
    acceptedOrder,
    closeModal,
    checkOrderAcceptance,
    modalType,
  };

  return (
    <OrderAcceptanceContext.Provider value={value}>
      {children}
    </OrderAcceptanceContext.Provider>
  );
};
