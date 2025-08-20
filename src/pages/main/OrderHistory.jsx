import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/header/Header";
import { mockUtils } from "../../mocks/UnifiedMockData";
import greencheck from "../../assets/icons/check.svg";
import graycheck from "../../assets/icons/uncheck.svg";
import empty from "../../assets/images/crying-character.svg";
import {
  Container,
  OrderList,
  OrderItem,
  OrderHeader,
  OrderInfo,
  OrderStatus,
  OrderDetails,
  OrderProduct,
  OrderProductImage,
  OrderProductInfo,
  OrderProductName,
  OrderProductQuantity,
  OrderSummary,
  OrderDate,
  EmptyState,
  EmptyText,
  ProgressSection,
  ProgressStep,
  StepHeader,
  StepStoreName,
  StepStatus,
  StepProducts,
  StepProduct,
  StepProductInfo,
  StepProductName,
  StepProductQuantity,
  StepSummary,
  ProgressBar,
  ProgressSteps,
  ProgressStepItem,
  StepLabel,
  StepLine,
  PickupInfo,
  PickupTime,
  PickupMessage,
} from "./OrderHistory.styles";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자 정보 설정
    setUserInfo({ name: "테스트 사용자" });

    // 사용자 ID 1번의 주문 내역 가져오기
    const userOrders = mockUtils.getOrdersByUser(1);

    // 주문 상태별 우선순위 정렬 (진행중인 주문이 맨 위에 오도록)
    const sortedOrders = userOrders.sort((a, b) => {
      const statusPriority = {
        pending: 1, // 주문확인 대기 (가장 높음)
        processing: 2, // 상품 준비 중
        completed: 3, // 픽업 완료
        cancelled: 4, // 주문 취소 (가장 낮음)
      };

      return statusPriority[a.status] - statusPriority[b.status];
    });

    setOrders(sortedOrders);
  }, []);

  const handleLogout = () => {
    navigate("/signin");
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "주문확인 대기";
      case "processing":
        return "상품 준비 중";
      case "completed":
        return "픽업 완료";
      case "cancelled":
        return "주문 취소";
      default:
        return "알 수 없음";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f59e0b";
      case "processing":
        return "#37ca79";
      case "completed":
        return "#775c4a";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getProgressSteps = (status) => {
    const steps = [
      { name: "주문 확인", status: "pending" },
      { name: "상품 준비", status: "processing" },
      { name: "픽업 완료", status: "completed" },
    ];

    return steps.map((step) => {
      if (step.status === status) {
        return { ...step, isCurrent: true };
      } else if (
        (step.status === "pending" && status === "processing") ||
        (step.status === "pending" && status === "completed") ||
        (step.status === "processing" && status === "completed")
      ) {
        return { ...step, isCompleted: true };
      } else {
        return { ...step, isPending: true };
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  const formatPrice = (price) => {
    return price.toLocaleString() + "원";
  };

  if (orders.length === 0) {
    return (
      <Container>
        <Header userInfo={userInfo} onLogout={handleLogout} title="주문 내역" />
        <EmptyState>
          <img
            src={empty}
            alt="empty"
            style={{ width: "124px", height: "124px", opacity: 0.6 }}
          />
          <EmptyText>아직 주문 내역이 없습니다.</EmptyText>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header userInfo={userInfo} onLogout={handleLogout} title="주문 내역" />

      {/* 진행중인 주문 카드 */}
      {orders.filter(
        (order) => order.status === "pending" || order.status === "processing"
      ).length > 0 && (
        <OrderItem>
          <OrderHeader>
            <OrderInfo>
              <OrderDate>진행중인 주문</OrderDate>
              <OrderStatus color="#37ca79">진행중</OrderStatus>
            </OrderInfo>
          </OrderHeader>

          <OrderDetails>
            <ProgressSection>
              <ProgressSteps>
                {orders
                  .filter(
                    (order) =>
                      order.status === "pending" ||
                      order.status === "processing"
                  )
                  .map((order) => {
                    const orderWithDetails = mockUtils.getOrderWithDetails(
                      order.id
                    );
                    const progressSteps = getProgressSteps(order.status);

                    return (
                      <ProgressStep key={order.id}>
                        <StepHeader>
                          <StepStoreName>
                            {orderWithDetails?.storeName}
                          </StepStoreName>
                          <StepStatus color={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </StepStatus>
                        </StepHeader>

                        <StepProducts>
                          {orderWithDetails?.items?.map((item, index) => {
                            return (
                              <StepProduct key={index}>
                                <OrderProductImage
                                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAyMEMyNC40NzcgMjAgMjAgMjQuNDc3IDIwIDMwQzIwIDM1LjUyMyAyNC40NzcgNDAgMzAgNDBDMzUuNTIzIDQwIDQwIDM1LjUyMyA0MCAzMEM0MCAyNC40NzcgMzAgMjBaIiBmaWxsPSIjOENBM0FGIi8+Cjwvc3ZnPgo="
                                  alt={item.productName}
                                />
                                <StepProductInfo>
                                  <StepProductName>
                                    {item.productName}
                                  </StepProductName>
                                  <StepProductQuantity>
                                    {item.quantity}개 ×{" "}
                                    {formatPrice(item.unitPrice)}
                                  </StepProductQuantity>
                                </StepProductInfo>
                              </StepProduct>
                            );
                          })}
                        </StepProducts>

                        <StepSummary>
                          <div>주문일: {formatDate(order.createdAt)}</div>
                          <div>최종 결제: {formatPrice(order.finalAmount)}</div>
                        </StepSummary>
                        {/* 각 주문별 픽업 정보 */}
                        {order.pickupTime && (
                          <PickupInfo>
                            <PickupTime>
                              {formatDate(order.pickupTime)}{" "}
                              {new Date(order.pickupTime).getHours() >= 12
                                ? "오후"
                                : "오전"}{" "}
                              {new Date(order.pickupTime).getHours() > 12
                                ? new Date(order.pickupTime).getHours() - 12
                                : new Date(order.pickupTime).getHours()}
                              :
                              {String(
                                new Date(order.pickupTime).getMinutes()
                              ).padStart(2, "0")}{" "}
                              픽업
                            </PickupTime>
                            <PickupMessage>{order.pickupMessage}</PickupMessage>
                          </PickupInfo>
                        )}
                        <ProgressBar>
                          <ProgressSteps>
                            {progressSteps.map((step, index) => (
                              <ProgressStepItem key={index}>
                                <img
                                  src={
                                    step.isCompleted
                                      ? greencheck
                                      : step.isCurrent
                                      ? greencheck
                                      : graycheck
                                  }
                                  alt={step.name}
                                  width="25"
                                  height="25"
                                />
                                <StepLabel>{step.name}</StepLabel>
                                {index < progressSteps.length - 1 && (
                                  <StepLine $isCompleted={step.isCompleted} />
                                )}
                              </ProgressStepItem>
                            ))}
                          </ProgressSteps>
                        </ProgressBar>
                      </ProgressStep>
                    );
                  })}
              </ProgressSteps>
            </ProgressSection>
          </OrderDetails>
        </OrderItem>
      )}

      {/* 완료된 주문 카드들 */}
      <OrderList>
        {orders
          .filter((order) => order.status === "completed")
          .map((order) => {
            const orderWithDetails = mockUtils.getOrderWithDetails(order.id);

            return (
              <OrderItem key={order.id}>
                <OrderHeader>
                  <OrderInfo>
                    <OrderDate>{formatDate(order.createdAt)}</OrderDate>
                    <OrderStatus color={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </OrderStatus>
                  </OrderInfo>
                </OrderHeader>

                <OrderDetails>
                  {orderWithDetails?.items?.map((item, index) => {
                    return (
                      <OrderProduct key={index}>
                        <OrderProductImage
                          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAyMEMyNC40NzcgMjAgMjAgMjQuNDc3IDIwIDMwQzIwIDM1LjUyMyAyNC40NzcgNDAgMzAgNDBDMzUuNTIzIDQwIDQwIDM1LjUyMyA0MCAzMEM0MCAyNC40NzcgMzAgMjBaIiBmaWxsPSIjOENBM0FGIi8+Cjwvc3ZnPgo="
                          alt={item.productName}
                        />
                        <OrderProductInfo>
                          <OrderProductName>
                            {item.productName}
                          </OrderProductName>
                          <OrderProductQuantity>
                            {item.quantity}개 × {formatPrice(item.unitPrice)}
                          </OrderProductQuantity>
                        </OrderProductInfo>
                      </OrderProduct>
                    );
                  })}

                  <OrderSummary>
                    <div>상점: {orderWithDetails?.storeName}</div>
                    <div>주소: {orderWithDetails?.storeAddress}</div>
                    <div>정가: {formatPrice(order.totalAmount)}</div>
                    <div>할인: -{formatPrice(order.discountAmount)}</div>
                    <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                      최종 결제: {formatPrice(order.finalAmount)}
                    </div>
                  </OrderSummary>
                </OrderDetails>
              </OrderItem>
            );
          })}
      </OrderList>
    </Container>
  );
}

export default OrderHistory;
