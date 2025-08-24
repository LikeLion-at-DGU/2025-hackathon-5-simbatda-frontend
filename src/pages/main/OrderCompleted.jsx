import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSellerMe,
  getSellerOrders,
  getProductStock,
} from "../../api/seller";
import { logout } from "../../api/auth";
import CompletedCard from "../../components/order/CompletedCard";
import Button from "../../components/common/button/Button";
import { useStoreStatus } from "../../hooks/useStoreStatus";
import {
  PageContainer,
  Content,
  OpenStatusSection,
  OpenStatusText,
  SectionTitleWrapper,
  SectionTitle,
  StatusButtons,
  OrderList,
  DateSection,
  DateHeader,
  EmptyMessage,
} from "./OrderCompleted.styles";
import HeaderSeller from "../../components/common/header/HeaderSeller";

export default function OrderCompleted() {
  const navigate = useNavigate();
  const { isOpen, handleToggleOpenStatus } = useStoreStatus();
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productStocks, setProductStocks] = useState({});

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

      const completedOrders = allOrders.filter(
        (order) => order.status === "pickup"
      );

      const transformedOrders = completedOrders.map((order) => ({
        id: order.id,
        reservation_number: `B${order.id.toString().padStart(5, "0")}`,
        product_name: order.product?.name || "상품명 없음",
        quantity: order.quantity || 1,
        price: order.product?.total_price || order.total_price || 0,
        created_at: order.created_at,
        pickup_time: order.pickup_time || order.reserved_at || order.created_at,
        status: order.status,
        consumer: order.consumer,
        product: order.product,
        ...order,
      }));

      setOrders(transformedOrders);

      const stockPromises = completedOrders.map(async (order) => {
        try {
          const stockInfo = await getProductStock(order.product.id);
          return { productId: order.product.id, stockInfo };
        } catch (err) {
          console.error(
            `Failed to fetch stock for product ${order.product.id}:`,
            err
          );
          return { productId: order.product.id, stockInfo: null };
        }
      });

      const stockResults = await Promise.all(stockPromises);
      const stockMap = {};
      stockResults.forEach(({ productId, stockInfo }) => {
        if (stockInfo) {
          stockMap[productId] = stockInfo;
        }
      });

      setProductStocks(stockMap);
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

  const ordersGroupedByDate = orders.reduce((acc, order) => {
    const date = new Date(order.created_at).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    if (!acc[date]) {
      acc[date] = [];
    }

    const currentStock = productStocks[order.product.id]?.stock || "정보 없음";

    acc[date].push({
      id: order.id,
      createdAt: (() => {
        const date = new Date(order.created_at);
        const hour = date.getHours();
        const ampm = hour >= 12 ? "오후" : "오전";
        const displayHour = hour >= 12 ? hour - 12 : hour;
        const minute = String(date.getMinutes()).padStart(2, "0");
        return `${ampm} ${displayHour}시 ${minute}분`;
      })(),
      originalCreatedAt: order.created_at,
      orderNumber:
        order.reservation_number || `B${order.id.toString().padStart(5, "0")}`,
      itemSummary: `${order.product_name || "상품명 없음"} ${order.quantity}개`,
      pickupTime: order.pickup_time
        ? (() => {
            const date = new Date(order.pickup_time);
            const hour = date.getHours();
            const ampm = hour >= 12 ? "오후" : "오전";
            const displayHour = hour >= 12 ? hour - 12 : hour;
            const minute = String(date.getMinutes()).padStart(2, "0");
            return `${ampm} ${displayHour}시 ${minute}분 픽업`;
          })()
        : "픽업 시간 미정",
      currentStock: currentStock,
    });

    return acc;
  }, {});

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin-seller");
    } catch (err) {
      console.error("Failed to logout:", err);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

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
          <SectionTitle onClick={() => navigate("/product-register")}>
            상품 등록
          </SectionTitle>
        </SectionTitleWrapper>

        <StatusButtons>
          <Button variant="status" onClick={() => navigate("/mainpage-seller")}>
            주문 접수
          </Button>
          <Button
            variant="status"
            onClick={() => navigate("/order-in-progress")}
          >
            진행 중
          </Button>
          <Button variant="status" className="active">
            진행 완료
          </Button>
        </StatusButtons>

        <OrderList>
          {isLoading ? (
            <EmptyMessage>주문 목록을 불러오는 중...</EmptyMessage>
          ) : Object.keys(ordersGroupedByDate).length === 0 ? (
            <EmptyMessage>완료된 주문이 없습니다.</EmptyMessage>
          ) : (
            Object.entries(ordersGroupedByDate)
              .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
              .map(([date, orders]) => (
                <DateSection key={date}>
                  <DateHeader>{date}</DateHeader>
                  {orders
                    .sort((a, b) => {
                      const timeA = new Date(a.originalCreatedAt);
                      const timeB = new Date(b.originalCreatedAt);
                      return timeB - timeA;
                    })
                    .map((order, index) => (
                      <CompletedCard
                        key={`${date}-${index}`}
                        stockInfo={order.currentStock}
                      >
                        {order}
                      </CompletedCard>
                    ))}
                </DateSection>
              ))
          )}
        </OrderList>
      </Content>
    </PageContainer>
  );
}
