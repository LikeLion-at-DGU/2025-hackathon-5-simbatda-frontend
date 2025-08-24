import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSellerMe,
  getSellerStore,
  getSellerOrders,
  acceptOrder,
  rejectOrder,
} from "../../api/seller";
import { logout } from "../../api/auth";
import Button from "../../components/common/button/Button";
import OrderCard from "../../components/order/OrderCard";
import {
  PageContainer,
  Content,
  OpenStatusSection,
  OpenStatusText,
  SectionTitle,
  SectionTitleWrapper,
  StatusButtons,
  EmptyMessage,
  OrdersContainer,
  RejectModal,
  RejectModalContent,
  RejectModalHeader,
  RejectModalTitle,
  RejectModalSection,
  RejectModalSubtitle,
  RejectOrderInfo,
  RejectReason,
  RejectSelect,
  RejectButtons,
  RejectInfo,
} from "./MainPageSeller.styles";

import { Backdrop } from "../../components/common/header/HeaderSeller.styles";
import { useStoreStatus } from "../../hooks/useStoreStatus";

import ImportantIcon from "../../assets/icons/Important.svg";
import HeaderSeller from "../../components/common/header/HeaderSeller";

function MainPageSeller() {
  const navigate = useNavigate();
  const { isOpen, handleToggleOpenStatus } = useStoreStatus();
  const [userInfo, setUserInfo] = useState(null);
  const [storeInfo, setStoreInfo] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [currentRejectOrder, setCurrentRejectOrder] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      localStorage.removeItem("sellerOrderHistory");
      return [];
    } catch (error) {
      console.error("Failed to clear orderHistory from localStorage:", error);
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const [previousOrderCount, setPreviousOrderCount] = useState(0);

  const orderHistoryRef = useRef(orderHistory);
  const previousOrderCountRef = useRef(previousOrderCount);

  useEffect(() => {
    orderHistoryRef.current = orderHistory;
  }, [orderHistory]);

  useEffect(() => {
    previousOrderCountRef.current = previousOrderCount;
  }, [previousOrderCount]);

  const rejectReasons = [
    "상품의 상태가 좋지 않아요...",
    "가게 내부 문제 발생",
    "기타 사유",
  ];

  useEffect(() => {
    const fetchUserAndStoreInfo = async () => {
      try {
        const [userData, storeData] = await Promise.all([
          getSellerMe(),
          getSellerStore(),
        ]);
        setUserInfo(userData);
        setStoreInfo(storeData);
      } catch (err) {
        console.error("Failed to fetch user/store info:", err);
        navigate("/signin-seller");
      }
    };
    fetchUserAndStoreInfo();
  }, [navigate]);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const orders = await getSellerOrders();

      const transformedOrders = orders.map((order) => ({
        id: order.id,
        reservationCode: `B${order.id.toString().padStart(5, "0")}`,
        productName: order.product?.name || "상품명 없음",
        quantity: order.quantity || 1,
        totalPrice: order.product?.total_price || order.total_price || 0,
        createdAt: order.created_at,
        pickupTime: order.pickup_time || order.reserved_at || order.created_at,
        expireDate: order.product?.expire_date,
        status: order.status,
        consumer: order.consumer,
        product: order.product,
        cancel_reason: order.cancel_reason,
        ...order,
      }));

      const pending = transformedOrders.filter(
        (order) => order.status === "pending"
      );
      const others = transformedOrders.filter(
        (order) => order.status !== "pending"
      );

      if (
        previousOrderCountRef.current > 0 &&
        pending.length > previousOrderCountRef.current
      ) {
        const newOrders = pending.slice(
          0,
          pending.length - previousOrderCountRef.current
        );
        if (newOrders.length > 0) {
          setNewOrderAlert({
            count: newOrders.length,
            orders: newOrders,
          });
        }
      }

      setPreviousOrderCount(pending.length);

      setPendingOrders(pending);
      const existingHistory = orderHistoryRef.current.filter(
        (hist) => !transformedOrders.some((order) => order.id === hist.id)
      );

      const newHistory = others.map((order) => {
        const existingOrder = orderHistoryRef.current.find(
          (h) => h.id === order.id
        );

        let actionType;
        if (existingOrder?.action_type === "accepted") {
          actionType = "accepted";
        } else if (existingOrder?.action_type === "rejected") {
          actionType = "rejected";
        } else {
          actionType =
            order.status === "confirm"
              ? "accepted"
              : order.status === "cancel"
              ? "rejected"
              : order.status;
        }

        return {
          ...order,
          action_time: order.reserved_at || order.created_at,
          action_type: actionType,
        };
      });

      const combinedHistory = [...newHistory, ...existingHistory];

      const uniqueHistory = combinedHistory.filter(
        (order, index, self) =>
          index === self.findIndex((o) => o.id === order.id)
      );

      setOrderHistory(uniqueHistory);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      alert("주문 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  useEffect(() => {
    localStorage.setItem("sellerOrderHistory", JSON.stringify(orderHistory));
  }, [orderHistory]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin-seller");
    } catch (err) {
      console.error("Failed to logout:", err);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const handleAddMenu = () => {
    navigate("/product-register");
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const order = pendingOrders.find((o) => o.id === orderId);
      if (!order) {
        console.error("주문을 찾을 수 없습니다:", orderId);
        return;
      }

      await acceptOrder(orderId);

      await fetchOrders();

      navigate("/order-in-progress");
    } catch (err) {
      console.error("Failed to accept order:", err);
      alert("주문 수락에 실패했습니다.");
    }
  };

  const handleRejectOrder = (orderId) => {
    const order = pendingOrders.find((o) => o.id === orderId);
    setCurrentRejectOrder(order);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (currentRejectOrder) {
      try {
        const rejectResult = await rejectOrder(
          currentRejectOrder.id,
          rejectReason || "상품이 방금 품절됐어요ㅠㅠ!"
        );

        alert("주문을 거절했습니다.");
        setRejectModalOpen(false);
        setCurrentRejectOrder(null);
        setRejectReason("");

        await fetchOrders();
      } catch (err) {
        console.error("Failed to reject order:", err);
        alert("주문 거절에 실패했습니다.");
      }
    }
  };

  const handleCancelReject = () => {
    setRejectModalOpen(false);
    setCurrentRejectOrder(null);
    setRejectReason("");
  };

  const handleCloseNewOrderAlert = () => {
    setNewOrderAlert(null);
  };

  const allOrders = [...pendingOrders, ...orderHistory]
    .filter(
      (order, index, self) => index === self.findIndex((o) => o.id === order.id)
    )
    .sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;

      const timeA = new Date(a.created_at);
      const timeB = new Date(b.created_at);
      return timeB - timeA;
    });

  return (
    <PageContainer>
      <HeaderSeller userInfo={userInfo} onLogout={handleLogout} />

      <Content>
        <OpenStatusSection>
          <Button
            variant={isOpen ? "open" : "close"}
            onClick={handleToggleOpenStatus}
          >
            {isOpen ? "open" : "close"}
          </Button>
          <OpenStatusText>영업상태 변경</OpenStatusText>
        </OpenStatusSection>

        <SectionTitleWrapper>
          <SectionTitle className="active">주문 현황</SectionTitle>
          <SectionTitle onClick={handleAddMenu}>상품 등록</SectionTitle>
        </SectionTitleWrapper>

        <StatusButtons>
          <Button variant="status" className="active">
            주문 접수
          </Button>
          <Button
            variant="status"
            onClick={() => navigate("/order-in-progress")}
          >
            진행 중
          </Button>
          <Button variant="status" onClick={() => navigate("/order-completed")}>
            진행 완료
          </Button>
        </StatusButtons>

        {isLoading ? (
          <EmptyMessage>주문 목록을 불러오는 중...</EmptyMessage>
        ) : allOrders.length === 0 ? (
          <EmptyMessage>아직 주문 접수된 건이 없어요</EmptyMessage>
        ) : (
          <OrdersContainer>
            {allOrders.map((order) => {
              let actionType;
              if (order.status === "pending") {
                actionType = undefined;
              } else if (order.status === "confirm") {
                actionType = "accepted";
              } else if (order.status === "cancel") {
                actionType = "rejected";
              } else if (order.status === "ready") {
                actionType = "ready";
              } else if (order.status === "pickup") {
                actionType = "pickup";
              }

              const isHistory = order.status !== "pending";

              const historyOrder = orderHistory.find((h) => h.id === order.id);
              const finalActionType = historyOrder?.action_type || actionType;

              return (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAccept={
                    order.status === "pending" ? handleAcceptOrder : undefined
                  }
                  onReject={
                    order.status === "pending" ? handleRejectOrder : undefined
                  }
                  isHistory={isHistory}
                  actionType={finalActionType}
                  actionTime={order.reserved_at || order.created_at}
                  rejectReason={order.cancel_reason}
                />
              );
            })}
          </OrdersContainer>
        )}
      </Content>

      {rejectModalOpen && currentRejectOrder && (
        <>
          <Backdrop $open={rejectModalOpen} onClick={handleCancelReject} />
          <RejectModal $open={rejectModalOpen}>
            <RejectModalContent>
              <RejectModalHeader>
                <RejectModalTitle>
                  <img src={ImportantIcon} alt="거절 사유" />
                  <span>거절 사유</span>
                </RejectModalTitle>
              </RejectModalHeader>

              <RejectModalSection>
                <RejectModalSubtitle>주문 상품 정보</RejectModalSubtitle>
                <RejectInfo>
                  <RejectOrderInfo>
                    <div>{currentRejectOrder.product_name}</div>
                    <div>{currentRejectOrder.quantity}</div>
                    <div>
                      {currentRejectOrder.product?.total_price?.toLocaleString() ||
                        currentRejectOrder.total_price?.toLocaleString() ||
                        currentRejectOrder.price?.toLocaleString() ||
                        0}
                      원
                    </div>
                  </RejectOrderInfo>
                </RejectInfo>
              </RejectModalSection>

              <RejectReason>
                <RejectModalSubtitle>취소 사유</RejectModalSubtitle>
                <RejectSelect
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                >
                  <option value="">상품이 방금 품절됐어요ㅠㅠ!</option>
                  {rejectReasons.map((reason, index) => (
                    <option key={index} value={reason}>
                      {reason}
                    </option>
                  ))}
                </RejectSelect>
              </RejectReason>

              <RejectButtons>
                <Button variant="accept" onClick={handleConfirmReject}>
                  보내기
                </Button>
              </RejectButtons>
            </RejectModalContent>
          </RejectModal>
        </>
      )}

      {newOrderAlert && (
        <>
          <Backdrop $open={true} onClick={handleCloseNewOrderAlert} />
          <RejectModal $open={true}>
            <RejectModalContent>
              <RejectModalHeader>
                <RejectModalTitle>
                  <img src={ImportantIcon} alt="새로운 주문" />
                  <span>새로운 주문이 들어왔습니다!</span>
                </RejectModalTitle>
              </RejectModalHeader>

              <RejectModalSection>
                <RejectModalSubtitle>새로운 주문 정보</RejectModalSubtitle>
                <RejectInfo>
                  {newOrderAlert.orders.map((order, index) => (
                    <RejectOrderInfo key={order.id}>
                      <div>{order.product_name}</div>
                      <div>수량: {order.quantity}개</div>
                      <div>가격: {order.price?.toLocaleString() || 0}원</div>
                      {index < newOrderAlert.orders.length - 1 && (
                        <hr
                          style={{
                            margin: "8px 0",
                            border: "none",
                            borderTop: "1px solid #eee",
                          }}
                        />
                      )}
                    </RejectOrderInfo>
                  ))}
                </RejectInfo>
              </RejectModalSection>

              <RejectButtons>
                <Button variant="accept" onClick={handleCloseNewOrderAlert}>
                  확인
                </Button>
              </RejectButtons>
            </RejectModalContent>
          </RejectModal>
        </>
      )}
    </PageContainer>
  );
}

export default MainPageSeller;
