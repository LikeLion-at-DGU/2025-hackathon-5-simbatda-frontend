import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackHeader from "../../components/common/header/BackHeader";
import { getReservationDetail, getProductById } from "../../api/seller";
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
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setIsLoading(true);
        const orderData = await getReservationDetail(id);

        let expirationDate = "유통기한 정보 없음";
        try {
          const productDetail = await getProductById(orderData.product.id);
          if (productDetail.expiration_date) {
            expirationDate = new Date(
              productDetail.expiration_date
            ).toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            });
          }
        } catch (productErr) {}

        const transformedOrder = {
          orderNumber: `B${orderData.id.toString().padStart(5, "0")}`,
          createdAt: new Date(orderData.created_at).toLocaleString("ko-KR", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          pickupTime: orderData.pickup_time
            ? new Date(orderData.pickup_time).toLocaleString("ko-KR", {
                hour: "2-digit",
                hour12: true,
              }) + " 픽업"
            : "픽업 시간 미정",
          items: [
            {
              name: orderData.product.name,
              qty: orderData.product.quantity,
              price: orderData.product.total_price,
            },
          ],
          reserver: orderData.consumer.name || "이름 없음",
          phone: orderData.consumer.phone || "전화번호 없음",
          expire: expirationDate,
          status: orderData.status,
          storeName: orderData.store.name || "가게명 없음",
          storePhone: orderData.store.phone || "연락처 없음",
          storeAddress: orderData.store.address || "주소 정보 없음",
        };

        setOrder(transformedOrder);
      } catch (err) {
        console.error("Failed to fetch order detail:", err);
        setError(err.message || "주문 상세 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  const formatPickupTime = (pickupTime) => {
    if (!pickupTime) return "";
    return pickupTime;
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "주문 접수";
      case "confirm":
        return "주문 수락";
      case "ready":
        return "준비 완료";
      case "pickup":
        return "픽업 완료";
      case "cancel":
        return "주문 취소";
      default:
        return "주문 확인";
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <BackHeader title="주문 상세" />
        <Content>
          <div style={{ textAlign: "center", padding: "50px 20px" }}>
            주문 정보를 불러오는 중...
          </div>
        </Content>
      </PageContainer>
    );
  }

  if (error || !order) {
    return (
      <PageContainer>
        <BackHeader title="주문 상세" />
        <Content>
          <div
            style={{ textAlign: "center", padding: "50px 20px", color: "red" }}
          >
            {error || "주문 정보를 불러올 수 없습니다."}
          </div>
        </Content>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackHeader title="주문 상세" />

      <Content>
        {order.status !== "pickup" && (
          <PickupStatus>
            <PickupStatusText>
              {formatPickupTime(order.pickupTime)}
            </PickupStatusText>
          </PickupStatus>
        )}

        <OrderNumber>
          <OrderNumberLabel>예약상태</OrderNumberLabel>
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
            <OrderInfoLabel>예약자 전화번호</OrderInfoLabel>
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
