import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSellerOrders,
  markOrderReady,
  markOrderPickup,
  getSellerMe,
} from "../../api/seller";
import { logout } from "../../api/auth";
import OrderProgressCard from "../../components/order/OrderProgressCard";
import Button from "../../components/common/button/Button";

import {
  PageContainer,
  Content,
  SectionTitleWrapper,
  SectionTitle,
  StatusButtons,
  OrderList,
  EmptyMessage,
} from "./OrderInProgress.styles";
import HeaderSeller from "../../components/common/header/HeaderSeller";

export default function OrderInProgress() {
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const drawerRef = useRef(null);

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

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const allOrders = await getSellerOrders();

      const inProgressOrders = allOrders.filter((order) =>
        ["confirm", "ready", "pickup"].includes(order.status)
      );

      const transformedOrders = inProgressOrders.map((order) => ({
        id: order.id,
        reservation_code: order.reservation_code,
        reservation_number: `B${order.id.toString().padStart(5, "0")}`,
        product_name: order.product?.name || "상품명 없음",
        quantity: order.quantity || 1,
        price: order.product?.total_price || order.total_price || 0,
        // 할인 정보 추가 (백엔드 필드명과 일치)
        discount_price: order.product?.discount_price || null,
        discount_rate: order.product?.discount_rate || null,
        created_at: order.created_at,
        pickup_time: order.reserved_at || order.created_at,
        status: order.status,
        consumer: order.consumer,
        product: order.product,
        ...order,
      }));

      // 최신순으로 정렬 (created_at 기준, 내림차순)
      const sortedOrders = transformedOrders.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });

      setOrders(sortedOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkReady = async (orderId) => {
    try {
      await markOrderReady(orderId);
      await fetchOrders();
    } catch (err) {
      console.error("Failed to mark order ready:", err);
      alert("준비 완료 처리에 실패했습니다.");
    }
  };

  const handleMarkPickup = async (orderId) => {
    try {
      await markOrderPickup(orderId);
      await fetchOrders();

      navigate("/order-completed");
    } catch (err) {
      console.error("Failed to mark order pickup:", err);
      alert("픽업 완료 처리에 실패했습니다.");
    }
  };

  const getOrderVariant = (status) => {
    switch (status) {
      case "confirm":
        return "action";
      case "ready":
        return "ready";
      case "pickup":
        return "done";
      default:
        return "action";
    }
  };

  const getOrderSteps = (status) => {
    return {
      confirm:
        status === "confirm" || status === "ready" || status === "pickup",
      prepare: status === "ready" || status === "pickup",
      pickup: status === "pickup",
    };
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin-seller");
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  return (
    <PageContainer>
      <HeaderSeller userInfo={userInfo} onLogout={handleLogout} />

      <Content>
        <SectionTitleWrapper>
          <SectionTitle className="active">주문 현황</SectionTitle>
          <SectionTitle onClick={() => navigate("/product-register")}>
            상품 등록
          </SectionTitle>
        </SectionTitleWrapper>

        <StatusButtons>
          <Button variant="status" onClick={() => navigate("/mainpage-seller")}>
            주문 접수
          </Button>
          <Button variant="status" className="active">
            진행 중
          </Button>
          <Button variant="status" onClick={() => navigate("/order-completed")}>
            진행 완료
          </Button>
        </StatusButtons>

        <OrderList>
          {isLoading ? (
            <EmptyMessage>주문 목록을 불러오는 중...</EmptyMessage>
          ) : orders.length === 0 ? (
            <EmptyMessage>진행 중인 주문이 없습니다.</EmptyMessage>
          ) : (
            orders.map((order) => (
              <OrderProgressCard
                key={order.id}
                variant={getOrderVariant(order.status)}
                onReady={() => handleMarkReady(order.id)}
                onPickup={() => handleMarkPickup(order.id)}
              >
                {{
                  id: order.id,
                  reservation_code: order.reservation_code,
                  createdAt: (() => {
                    const date = new Date(order.created_at);
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    const hour = date.getHours();
                    const ampm = hour >= 12 ? "오후" : "오전";
                    const displayHour = hour >= 12 ? hour - 12 : hour;
                    const minute = String(date.getMinutes()).padStart(2, "0");
                    return `${month}.${day}. ${ampm} ${displayHour}시 ${minute}분`;
                  })(),
                  orderNumber: `B${order.id.toString().padStart(5, "0")}`,
                  itemSummary: `${order.product?.name || "상품명 없음"} ${
                    order.quantity
                  }개`,

                  totalPrice: order.price,
                  discount_price: order.discount_price,
                  discount_rate: order.discount_rate,
                  pickupTime:
                    order.pickup_time || order.reserved_at
                      ? (() => {
                          const date = new Date(
                            order.pickup_time || order.reserved_at
                          );
                          const hour = date.getHours();
                          const ampm = hour >= 12 ? "오후" : "오전";
                          const displayHour = hour >= 12 ? hour - 12 : hour;
                          const minute = String(date.getMinutes()).padStart(
                            2,
                            "0"
                          );
                          return `${ampm} ${displayHour}시 ${minute}분 픽업`;
                        })()
                      : "픽업 시간 미정",
                  steps: getOrderSteps(order.status),
                }}
              </OrderProgressCard>
            ))
          )}
        </OrderList>
      </Content>
    </PageContainer>
  );
}
