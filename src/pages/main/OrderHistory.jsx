import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/header/Header";
import { getReservations } from "../../api/reservations";
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
  ProgressStepBar,
} from "./OrderHistory.styles";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자 정보 설정
    setUserInfo({ name: "테스트 사용자" });

    // 주문내역 API 호출
    const fetchOrders = async () => {
      try {
        const reservations = await getReservations();

        // API 응답을 기존 형식에 맞게 변환
        const mappedOrders = reservations.map((reservation) => ({
          id: reservation.id,
          status: reservation.status,
          storeName: reservation.store.name,
          productName: reservation.product.name,
          quantity: reservation.quantity,
          reservedAt: reservation.reserved_at,
          createdAt: reservation.created_at,
          cancelReason: reservation.cancel_reason,
          storeLat: reservation.store.lat,
          storeLng: reservation.store.lng,
        }));

        // 주문 상태별 우선순위 정렬 (진행중인 주문이 맨 위에 오도록)
        const sortedOrders = mappedOrders.sort((a, b) => {
          const statusPriority = {
            pending: 1, // 주문확인 대기 (가장 높음)
            confirm: 2, // 주문 확인됨
            ready: 3, // 상품 준비 완료
            pickup: 4, // 픽업 완료
            cancel: 5, // 주문 취소 (가장 낮음)
          };

          return (
            statusPriority[a.status?.toLowerCase()] -
            statusPriority[b.status?.toLowerCase()]
          );
        });

        setOrders(sortedOrders);
      } catch (error) {
        console.error("주문내역 조회 오류:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    navigate("/signin");
  };

  const getStatusText = (status) => {
    // 상태값을 대문자로 정규화
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
      case "pending":
        return "주문확인 대기";
      case "confirm":
        return "주문 확인됨";
      case "ready":
        return "상품 준비 완료";
      case "pickup":
        return "픽업 완료";
      case "cancel":
        return "주문 취소";
      default:
        return "알 수 없음";
    }
  };

  const getStatusColor = (status) => {
    // 상태값을 소문자로 정규화
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
      case "pending":
        return "#f59e0b"; // 주황색 - 주문확인 대기
      case "confirm":
        return "#3b82f6"; // 파란색 - 주문 확인됨
      case "ready":
        return "#37ca79"; // 초록색 - 상품 준비 완료
      case "pickup":
        return "#775c4a"; // 갈색 - 픽업 완료
      case "cancel":
        return "#ef4444"; // 빨간색 - 주문 취소
      default:
        return "#6b7280"; // 회색 - 알 수 없음
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일 ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const getProgressSteps = (status) => {
    // 상태값을 소문자로 정규화
    const normalizedStatus = status?.toLowerCase();

    const steps = [
      { name: "주문 확인", status: "pending" },
      { name: "상품 준비", status: "ready" },
      { name: "픽업 완료", status: "pickup" },
    ];

    return steps.map((step) => {
      if (step.status === "pending") {
        // 주문 확인 단계
        if (normalizedStatus === "pending") {
          return {
            ...step,
            isCurrent: false,
            isCompleted: false,
            isPending: true,
          };
        } else if (["confirm", "ready", "pickup"].includes(normalizedStatus)) {
          return {
            ...step,
            isCompleted: true,
            isCurrent: false,
            isPending: false,
          };
        } else {
          return {
            ...step,
            isPending: true,
            isCurrent: false,
            isCompleted: false,
          };
        }
      } else if (step.status === "ready") {
        // 상품 준비 단계
        if (normalizedStatus === "ready") {
          return { ...step, isCurrent: true, isCompleted: false };
        } else if (normalizedStatus === "pickup") {
          return { ...step, isCompleted: true, isCurrent: false };
        } else if (["pending", "confirm"].includes(normalizedStatus)) {
          return { ...step, isPending: true, isCurrent: false };
        } else {
          return { ...step, isPending: true, isCurrent: false };
        }
      } else if (step.status === "pickup") {
        // 픽업 완료 단계
        if (normalizedStatus === "pickup") {
          return { ...step, isCurrent: true, isCompleted: false };
        } else if (["pending", "confirm", "ready"].includes(normalizedStatus)) {
          return { ...step, isPending: true, isCurrent: false };
        } else {
          return { ...step, isPending: true, isCurrent: false };
        }
      }

      return { ...step, isPending: true, isCurrent: false };
    });
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "0원";
    return Number(price).toLocaleString() + "원";
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
        (order) =>
          order.status?.toLowerCase() === "pending" ||
          order.status?.toLowerCase() === "confirm" ||
          order.status?.toLowerCase() === "ready"
      ).length > 0 && (
        <OrderItem>
          <OrderHeader>
            <OrderInfo>
              <OrderDate>진행중인 주문</OrderDate>
            </OrderInfo>
          </OrderHeader>

          <OrderDetails>
            <ProgressSection>
              <ProgressSteps>
                {orders
                  .filter(
                    (order) =>
                      order.status?.toLowerCase() === "pending" ||
                      order.status?.toLowerCase() === "confirm" ||
                      order.status?.toLowerCase() === "ready"
                  )
                  .map((order) => {
                    const progressSteps = getProgressSteps(order.status);

                    return (
                      <ProgressStep
                        key={order.id}
                        onClick={() =>
                          navigate(`/customer-order-detail/${order.id}`)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <StepHeader>
                          <StepStoreName>{order.storeName}</StepStoreName>
                          <StepStatus color={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </StepStatus>
                        </StepHeader>

                        <StepProducts>
                          <StepProduct>
                            <OrderProductImage
                              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAyMEMyNC40NzcgMjAgMjAgMjQuNDc3IDIwIDMwQzIwIDM1LjUyMyAyNC40NzcgNDAgMzAgNDBDMzUuNTIzIDQwIDQwIDM1LjUyMyA0MCAzMEM0MCAyNC40NzcgMzAgMjBaIiBmaWxsPSIjOENBM0FGIi8+Cjwvc3ZnPgo="
                              alt={order.productName}
                            />
                            <StepProductInfo>
                              <StepProductName>
                                {order.productName}
                              </StepProductName>
                              <StepProductQuantity>
                                {order.quantity}개
                              </StepProductQuantity>
                            </StepProductInfo>
                          </StepProduct>
                        </StepProducts>

                        <StepSummary>
                          <div>주문일: {formatDate(order.createdAt)}</div>
                        </StepSummary>

                        {/* 픽업 시간 정보 */}
                        {order.reservedAt ? (
                          <PickupInfo>
                            <PickupTime>
                              {formatDate(order.reservedAt)}{" "}
                              {new Date(order.reservedAt).getHours() >= 12
                                ? "오후"
                                : "오전"}{" "}
                              {new Date(order.reservedAt).getHours() > 12
                                ? new Date(order.reservedAt).getHours() - 12
                                : new Date(order.reservedAt).getHours()}
                              :
                              {String(
                                new Date(order.reservedAt).getMinutes()
                              ).padStart(2, "0")}{" "}
                              픽업
                            </PickupTime>
                          </PickupInfo>
                        ) : (
                          <PickupInfo>
                            <PickupTime>주문 수락 시 30분 이내 픽업 해야합니다.</PickupTime>
                          </PickupInfo>
                        )}

                        <ProgressBar>
                          <ProgressStepBar>
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
                          </ProgressStepBar>
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
          .filter((order) => order.status?.toLowerCase() === "pickup")
          .map((order) => {
            return (
              <OrderItem
                key={order.id}
                onClick={() => navigate(`/customer-order-detail/${order.id}`)}
                style={{ cursor: "pointer" }}
              >
                <OrderHeader>
                  <OrderInfo>
                    <OrderDate>{formatDate(order.createdAt)}</OrderDate>
                    <OrderStatus color={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </OrderStatus>
                  </OrderInfo>
                </OrderHeader>

                <OrderDetails>
                  <OrderProduct>
                    <OrderProductImage
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAyMEMyNC40NzcgMjAgMjAgMjQuNDc3IDIwIDMwQzIwIDM1LjUyMyAyNC40NzcgNDAgMzAgNDBDMzUuNTIzIDQwIDQwIDM1LjUyMyA0MCAzMEM0MCAyNC40NzcgMzAgMjBaIiBmaWxsPSIjOENBM0FGIi8+Cjwvc3ZnPgo="
                      alt={order.productName}
                    />
                    <OrderProductInfo>
                      <OrderProductName>{order.productName}</OrderProductName>
                      <OrderProductQuantity>
                        {order.quantity}개
                      </OrderProductQuantity>
                    </OrderProductInfo>
                  </OrderProduct>

                  <OrderSummary>
                    <div>상점: {order.storeName}</div>
                    <div>주문일: {formatDate(order.createdAt)}</div>
                  </OrderSummary>
                </OrderDetails>
              </OrderItem>
            );
          })}
      </OrderList>

      {/* 취소된 주문 카드들 */}
      <OrderList>
        {orders
          .filter((order) => order.status?.toLowerCase() === "cancel")
          .map((order) => {
            return (
              <OrderItem
                key={order.id}
                onClick={() => navigate(`/customer-order-detail/${order.id}`)}
                style={{ cursor: "pointer" }}
              >
                <OrderHeader>
                  <OrderInfo>
                    <OrderDate>{formatDate(order.createdAt)}</OrderDate>
                    <OrderStatus color={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </OrderStatus>
                  </OrderInfo>
                </OrderHeader>

                <OrderDetails>
                  <OrderProduct>
                    <OrderProductImage
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAyMEMyNC40NzcgMjAgMjAgMjQuNDc3IDIwIDMwQzIwIDM1LjUyMyAyNC40NzcgNDAgMzAgNDBDMzUuNTIzIDQwIDQwIDM1LjUyMyA0MCAzMEM0MCAyNC40NzcgMzAgMjBaIiBmaWxsPSIjOENBM0FGIi8+Cjwvc3ZnPgo="
                      alt={order.productName}
                    />
                    <OrderProductInfo>
                      <OrderProductName>{order.productName}</OrderProductName>
                      <OrderProductQuantity>
                        {order.quantity}개
                      </OrderProductQuantity>
                    </OrderProductInfo>
                  </OrderProduct>

                  <OrderSummary>
                    <div>상점: {order.storeName}</div>
                    <div>주문일: {formatDate(order.createdAt)}</div>
                    {order.cancelReason && (
                      <div style={{ color: "#ef4444" }}>
                        취소 사유: {order.cancelReason}
                      </div>
                    )}
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
