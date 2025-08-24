import React, { createContext, useContext, useState, useEffect } from "react";
import { getNotifications, markNotificationAsRead } from "../api/reservations";

const getUserRole = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      return parsed.role || "consumer"; 
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

  const checkAndRequestLocationPermission = () => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "denied") {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                console.log("위치 권한이 허용되었습니다.");
              },
              (error) => {
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
    // 로그인하지 않은 경우 알림 조회하지 않음
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return;
    }

    const userRole = getUserRole();
    if (userRole === "seller") {
      return;
    }

    try {
      const notifications = await getNotifications();

      const unreadConfirmNotification = notifications.find(
        (notification) =>
          notification.status === "confirm" && !notification.is_read
      );

      const unreadCancelNotification = notifications.find(
        (notification) =>
          notification.status === "cancel" && !notification.is_read
      );

      const unreadCompletedNotification = notifications.find(
        (notification) =>
          (notification.status === "completed" ||
            notification.status === "pickup") &&
          !notification.is_read
      );

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
      else if (unreadCompletedNotification) {
        const orderInfo = {
          id: unreadCompletedNotification.id,
          reservationId: unreadCompletedNotification.reservation_id,
          status: unreadCompletedNotification.status,
          createdAt: unreadCompletedNotification.created_at,
          storeName: "상점",
        };

        setAcceptedOrder(orderInfo);
        setModalType("completed");
        setShowAcceptanceModal(true);
      }
    } catch (error) {
      console.error("주문 알림 확인 오류:", error);
    }
  };

  useEffect(() => {
    const checkLoginAndLocation = () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        checkAndRequestLocationPermission();
      }
    };

    checkLoginAndLocation();

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      checkOrderAcceptance();
    }

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

  const closeModal = async () => {
    if (acceptedOrder) {
      try {
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
