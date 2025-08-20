import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackHeader from "../../components/common/header/BackHeader";
import { mockUtils } from "../../mocks/UnifiedMockData";
import {
  PageContainer,
  Content,
  PickupStatus,
  PickupStatusText,
  OrderNumber,
  OrderNumberLabel,
  OrderNumberValue,
  OrderInfoSection,
  OrderInfoItem,
  OrderInfoLabel,
  OrderInfoValue,
  ProductSection,
  SectionTitle,
  ProductItem,
  ProductInfo,
  ProductName,
  ProductQuantity,
  ProductPrice,
  ProductExpiry,
  StoreSection,
  StoreInfoItem,
  StoreInfoLabel,
  StoreInfoValue,
  CopyButton,
  CopyButtonText,
} from "./CustomerOrderDetail.styles";

const CustomerOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    setUserInfo({ name: "토토다람쥐" });

    // 주문 정보 가져오기
    const orderData = mockUtils.getOrderById(parseInt(orderId));
    if (orderData) {
      setOrder(orderData);

      // 주문 상세 정보 가져오기
      const details = mockUtils.getOrderWithDetails(orderData.id);
      setOrderDetails(details);
    }
  }, [orderId]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/signin");
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "오후" : "오전";
    const displayHours = hours > 12 ? hours - 12 : hours;

    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];

    return `${year}.${month}.${day}. (${weekday}) ${ampm} ${displayHours}시 ${minutes}분`;
  };

  const formatPickupTime = (pickupTime) => {
    if (!pickupTime) return "";
    const date = new Date(pickupTime);
    const hours = date.getHours();
    const ampm = hours >= 12 ? "오후" : "오전";
    const displayHours = hours > 12 ? hours - 12 : hours;
    return `${ampm} ${displayHours}시 이내 픽업 예정`;
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "픽업대기중";
      case "processing":
        return "픽업대기중";
      case "completed":
        return "픽업완료";
      default:
        return "주문확인";
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // TODO: 복사 완료 토스트 메시지 표시
  };

  if (!order || !orderDetails) {
    return (
      <PageContainer>
        <BackHeader title="주문 상세" />
        <div>주문을 찾을 수 없습니다.</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackHeader title="주문 상세" />

      <Content>
        {/* 픽업 상태 - 픽업 완료가 아닐 때만 표시 */}
        {order.status !== "completed" && (
          <PickupStatus>
            <PickupStatusText>
              {formatPickupTime(order.pickupTime)}
            </PickupStatusText>
          </PickupStatus>
        )}

        {/* 예약번호 */}
        <OrderNumber>
          <OrderNumberLabel>예약번호</OrderNumberLabel>
          <OrderNumberValue>{getStatusText(order.status)}</OrderNumberValue>
        </OrderNumber>

        {/* 주문 정보 */}
        <OrderInfoSection>
          <OrderInfoItem>
            <OrderInfoLabel>예약번호</OrderInfoLabel>
            <OrderInfoValue>
              B{String(order.id).padStart(5, "0")}
            </OrderInfoValue>
          </OrderInfoItem>
          <OrderInfoItem>
            <OrderInfoLabel>주문시각</OrderInfoLabel>
            <OrderInfoValue>{formatDate(order.createdAt)}</OrderInfoValue>
          </OrderInfoItem>
          <OrderInfoItem>
            <OrderInfoLabel>예약자명</OrderInfoLabel>
            <OrderInfoValue>{userInfo?.name || "사용자"}</OrderInfoValue>
          </OrderInfoItem>
        </OrderInfoSection>

        {/* 가게 정보 */}
        <OrderInfoSection>
          <OrderInfoItem>
            <OrderInfoLabel>가게명</OrderInfoLabel>
            <OrderInfoValue>{orderDetails?.storeName || "상점"}</OrderInfoValue>
          </OrderInfoItem>
          <OrderInfoItem>
            <OrderInfoLabel>가게연락처</OrderInfoLabel>
            <OrderInfoValue>
              {orderDetails?.storePhone || "000-000-0000"}
            </OrderInfoValue>
          </OrderInfoItem>
        </OrderInfoSection>

        {/* 주문 상품 정보 */}
        <ProductSection>
          <SectionTitle>주문 상품 정보</SectionTitle>
          {orderDetails?.items?.map((item, index) => (
            <ProductItem key={index}>
              <ProductInfo>
                <ProductName>{item.productName}</ProductName>
                <ProductQuantity>{item.quantity}</ProductQuantity>
                <ProductPrice>{item.unitPrice.toLocaleString()}원</ProductPrice>
              </ProductInfo>
              <ProductExpiry>
                유통기한:{" "}
                {(() => {
                  try {
                    // 상품의 실제 유통기한을 가져오기
                    const product = mockUtils.getProductById(item.productId);
                    if (product && product.expiryTime) {
                      const expiryDate = new Date(product.expiryTime);
                      if (!isNaN(expiryDate.getTime())) {
                        const month = expiryDate.getMonth() + 1;
                        const day = expiryDate.getDate();
                        const hours = expiryDate
                          .getHours()
                          .toString()
                          .padStart(2, "0");
                        const minutes = expiryDate
                          .getMinutes()
                          .toString()
                          .padStart(2, "0");
                        return `${month}월 ${day}일 ${hours}:${minutes}`;
                      }
                    }

                    // 기본값: 픽업 시간 + 3일
                    if (order.pickupTime) {
                      const defaultExpiry = new Date(
                        order.pickupTime + 3 * 24 * 60 * 60 * 1000
                      );
                      if (!isNaN(defaultExpiry.getTime())) {
                        const month = defaultExpiry.getMonth() + 1;
                        const day = defaultExpiry.getDate();
                        const hours = defaultExpiry
                          .getHours()
                          .toString()
                          .padStart(2, "0");
                        const minutes = defaultExpiry
                          .getMinutes()
                          .toString()
                          .padStart(2, "0");
                        return `${month}월 ${day}일 ${hours}:${minutes}`;
                      }
                    }

                    return "정보 없음";
                  } catch (error) {
                    console.error("유통기한 계산 오류:", error);
                    return "정보 없음";
                  }
                })()}
              </ProductExpiry>
            </ProductItem>
          ))}
        </ProductSection>

        {/* 매장 정보 */}
        <StoreSection>
          <SectionTitle>매장 정보</SectionTitle>
          <StoreInfoItem>
            <StoreInfoLabel>매장주소</StoreInfoLabel>
            <StoreInfoValue>
              {orderDetails?.storeAddress || "서울특별시 중구 필동로 1길 30"}
            </StoreInfoValue>
            <CopyButton
              onClick={() =>
                copyToClipboard(
                  orderDetails?.storeAddress || "서울특별시 중구 필동로 1길 30"
                )
              }
            >
              <CopyButtonText>주소 복사</CopyButtonText>
            </CopyButton>
          </StoreInfoItem>
        </StoreSection>
      </Content>
    </PageContainer>
  );
};

export default CustomerOrderDetail;
