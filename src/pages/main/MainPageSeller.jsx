import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSellerMe, logout } from "../../api/auth";
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

import ImportantIcon from "../../assets/icons/Important.png";
import HeaderSeller from "../../components/common/header/HeaderSeller";

function MainPageSeller() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [currentRejectOrder, setCurrentRejectOrder] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState(() => {
    const savedHistory = localStorage.getItem("sellerOrderHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const rejectReasons = [
    "상품의 상태가 좋지 않아요...",
    "가게 내부 문제 발생",
    "기타 사유",
  ];

  const sampleOrders = [
    {
      id: 1,
      reservation_number: "B12345",
      product_name: "김치찌개 1인분",
      quantity: 1,
      price: 5600,
      created_at: new Date(Date.now() - 30 * 60 * 1000),
      pickup_time: new Date(Date.now() + 60 * 60 * 1000),
      status: "pending",
    },
    {
      id: 2,
      reservation_number: "B12346",
      product_name: "된장찌개 1인분",
      quantity: 2,
      price: 5200,
      created_at: new Date(Date.now() - 15 * 60 * 1000),
      pickup_time: new Date(Date.now() + 45 * 60 * 1000),
      status: "pending",
    },
  ];

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getSellerMe();
        setUserInfo(data);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        navigate("/signin-seller");
      }
    };
    fetchUserInfo();
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPendingOrders(sampleOrders);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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

  const handleAcceptOrder = (orderId) => {
    const order = pendingOrders.find((order) => order.id === orderId);
    if (order) {
      const updatedPendingOrders = pendingOrders.filter(
        (order) => order.id !== orderId
      );
      setPendingOrders(updatedPendingOrders);

      const acceptedOrder = {
        ...order,
        status: "accepted",
        action_time: new Date(),
        action_type: "accepted",
      };
      setOrderHistory((prev) => [acceptedOrder, ...prev]);

      alert("주문을 접수했습니다!");

      setTimeout(() => {
        navigate("/order-in-progress");
      }, 1000);
    }
  };

  const handleRejectOrder = (orderId) => {
    const order = pendingOrders.find((o) => o.id === orderId);
    setCurrentRejectOrder(order);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (currentRejectOrder) {
      const updatedPendingOrders = pendingOrders.filter(
        (order) => order.id !== currentRejectOrder.id
      );
      setPendingOrders(updatedPendingOrders);

      const rejectedOrder = {
        ...currentRejectOrder,
        status: "rejected",
        action_time: new Date(),
        action_type: "rejected",
        reject_reason: rejectReason || "상품이 방금 품절됐어요ㅠㅠ!",
      };
      setOrderHistory((prev) => [rejectedOrder, ...prev]);

      alert("주문을 거절했습니다.");
      setRejectModalOpen(false);
      setCurrentRejectOrder(null);
      setRejectReason("");
    }
  };

  const handleCancelReject = () => {
    setRejectModalOpen(false);
    setCurrentRejectOrder(null);
    setRejectReason("");
  };

  const allOrders = [...pendingOrders, ...orderHistory].sort((a, b) => {
    const timeA = a.action_time || a.created_at;
    const timeB = b.action_time || b.created_at;
    return new Date(timeB) - new Date(timeA);
  });

  return (
    <PageContainer>
      <HeaderSeller userInfo={userInfo} onLogout={handleLogout} />

      <Content>
        <OpenStatusSection>
          <Button
            variant={isOpen ? "open" : "close"}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "open" : "close"}
          </Button>
          <OpenStatusText>영업상태 변경</OpenStatusText>
        </OpenStatusSection>

        <SectionTitleWrapper>
          <SectionTitle className="active">주문 현황</SectionTitle>
          <SectionTitle onClick={() => navigate("/product-register")}>
            상품 등록
          </SectionTitle>
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

        {allOrders.length === 0 ? (
          <EmptyMessage>아직 주문 접수된 건이 없어요</EmptyMessage>
        ) : (
          <OrdersContainer>
            {allOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={
                  order.status === "pending" ? handleAcceptOrder : undefined
                }
                onReject={
                  order.status === "pending" ? handleRejectOrder : undefined
                }
                isHistory={order.status !== "pending"}
                actionType={order.action_type}
                actionTime={order.action_time}
                rejectReason={order.reject_reason}
              />
            ))}
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
                    <div>{currentRejectOrder.price.toLocaleString()}원</div>
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
    </PageContainer>
  );
}

export default MainPageSeller;
