import React, { createContext, useContext, useState, useEffect } from "react";
import { mockUtils } from "../mocks/UnifiedMockData";

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

  // 주문 수락 알림 체크 함수
  const checkOrderAcceptance = () => {
    const userOrders = mockUtils.getOrdersByUser(1);
    const acceptedOrder = userOrders.find(
      (order) =>
        order.status === "processing" &&
        order.orderAccepted &&
        order.showAcceptanceModal
    );

    if (acceptedOrder) {
      setAcceptedOrder(acceptedOrder);
      setShowAcceptanceModal(true);

      // 모달을 한 번만 보여주기 위해 플래그 업데이트
      // 실제로는 API 호출로 이 플래그를 false로 변경해야 함
      acceptedOrder.showAcceptanceModal = false;
    }
  };

  useEffect(() => {
    checkOrderAcceptance();

    const interval = setInterval(checkOrderAcceptance, 30000);

    return () => clearInterval(interval);
  }, []);

  // 모달 닫기
  const closeModal = () => {
    setShowAcceptanceModal(false);
    setAcceptedOrder(null);
  };

  const value = {
    showAcceptanceModal,
    acceptedOrder,
    closeModal,
    checkOrderAcceptance,
  };

  return (
    <OrderAcceptanceContext.Provider value={value}>
      {children}
    </OrderAcceptanceContext.Provider>
  );
};
