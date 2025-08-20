import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackHeader from "../../components/common/header/BackHeader";
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
} from "./OrderDetail.styles";

export default function OrderDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state;

  const order = {
    orderNumber: orderData?.orderNumber || "B12345",
    createdAt: orderData?.createdAt || "08.06. 오후 8시 33분",
    pickupTime: orderData?.pickupTime || "오후 9시 픽업",
    items: orderData?.items || [
      { name: "김치찌개 1인분", qty: 1, price: 5600 },
    ],
    reserver: orderData?.reserver || "다람쥐쥐쥐쥐",
    phone: orderData?.phone || "000-000-0000",
    expire: orderData?.expire || "08.09. 22:00",
    status: orderData?.status || "pending",
    storeName: orderData?.storeName || "맛있는 김치찌개",
    storePhone: orderData?.storePhone || "02-1234-5678",
    storeAddress: orderData?.storeAddress || "서울특별시 중구 필동로 1길 30",
  };

  const formatPickupTime = (pickupTime) => {
    if (!pickupTime) return "";
    return pickupTime;
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
  };

  return (
    <PageContainer>
      <BackHeader title="주문 상세" />

      <Content>
        {order.status !== "completed" && (
          <PickupStatus>
            <PickupStatusText>
              {formatPickupTime(order.pickupTime)}
            </PickupStatusText>
          </PickupStatus>
        )}

        <OrderNumber>
          <OrderNumberLabel>예약번호</OrderNumberLabel>
          <OrderNumberValue>{getStatusText(order.status)}</OrderNumberValue>
        </OrderNumber>

        <OrderInfoSection>
          <OrderInfoItem>
            <OrderInfoLabel>예약번호</OrderInfoLabel>
            <OrderInfoValue>{order.orderNumber}</OrderInfoValue>
          </OrderInfoItem>
          <OrderInfoItem>
            <OrderInfoLabel>주문시각</OrderInfoLabel>
            <OrderInfoValue>{order.createdAt}</OrderInfoValue>
          </OrderInfoItem>
          <OrderInfoItem>
            <OrderInfoLabel>예약자명</OrderInfoLabel>
            <OrderInfoValue>{order.reserver}</OrderInfoValue>
          </OrderInfoItem>
          <OrderInfoItem>
            <OrderInfoLabel>예약자 번호</OrderInfoLabel>
            <OrderInfoValue>{order.phone}</OrderInfoValue>
          </OrderInfoItem>
        </OrderInfoSection>

        <OrderInfoSection>
          <OrderInfoItem>
            <OrderInfoLabel>가게명</OrderInfoLabel>
            <OrderInfoValue>{order.storeName}</OrderInfoValue>
          </OrderInfoItem>
          <OrderInfoItem>
            <OrderInfoLabel>가게연락처</OrderInfoLabel>
            <OrderInfoValue>{order.storePhone}</OrderInfoValue>
          </OrderInfoItem>
        </OrderInfoSection>

        <ProductSection>
          <SectionTitle>주문 상품 정보</SectionTitle>
          {order.items.map((item, index) => (
            <ProductItem key={index}>
              <ProductInfo>
                <ProductName>{item.name}</ProductName>
                <ProductQuantity>{item.qty}</ProductQuantity>
                <ProductPrice>{item.price.toLocaleString()}원</ProductPrice>
              </ProductInfo>
              <ProductExpiry>유통기한: {order.expire}</ProductExpiry>
            </ProductItem>
          ))}
        </ProductSection>

        <StoreSection>
          <SectionTitle>매장 정보</SectionTitle>
          <StoreInfoItem>
            <StoreInfoLabel>매장주소</StoreInfoLabel>
            <StoreInfoValue>{order.storeAddress}</StoreInfoValue>
            <CopyButton onClick={() => copyToClipboard(order.storeAddress)}>
              <CopyButtonText>주소 복사</CopyButtonText>
            </CopyButton>
          </StoreInfoItem>
        </StoreSection>
      </Content>
    </PageContainer>
  );
}
