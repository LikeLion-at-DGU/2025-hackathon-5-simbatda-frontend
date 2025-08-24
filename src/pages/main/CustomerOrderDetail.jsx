import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackHeader from "../../components/common/header/BackHeader";
import { getReservationDetail } from "../../api/reservations";
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
  ProductInfo2,
} from "./CustomerOrderDetail.styles";

const CustomerOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const orderData = await getReservationDetail(orderId);

        // 사용자 정보 설정
        if (orderData.consumer) {
          setUserInfo({ name: orderData.consumer.name });
        }

        // 주문 정보 변환
        const transformedOrder = {
          id: orderData.id,
          orderNumber: `B${orderData.id.toString().padStart(5, "0")}`,
          createdAt: orderData.created_at, // 원본 날짜 문자열 유지
          status: orderData.status,
          items: [
            {
              name: orderData.product.name,
              qty: orderData.product.quantity,
              price: orderData.product.total_price,
            },
          ],
          reserver: orderData.consumer.name || "이름 없음",
          phone: orderData.consumer.phone || "전화번호 없음",
          expire: orderData.product.expire_date
            ? new Date(orderData.product.expire_date).toLocaleString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "유통기한 정보 없음",
          storeName: orderData.store.name || "가게명 없음",
          storePhone: orderData.store.phone || "연락처 없음",
          storeAddress: orderData.store.address || "주소 정보 없음",
          pickupTime: orderData.pickup_time || orderData.reserved_at,
          cancelReason: orderData.cancel_reason,
        };

        setOrder(transformedOrder);
        setOrderDetails(transformedOrder);
      } catch (error) {
        console.error("주문 상세 정보 조회 오류:", error);
        // 에러 처리
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/signin");
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "날짜 정보 없음";

    try {
      const date = new Date(timestamp);

      // 날짜가 유효한지 확인
      if (isNaN(date.getTime())) {
        console.error("유효하지 않은 날짜:", timestamp);
        return "날짜 정보 오류";
      }

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
    } catch (error) {
      console.error("날짜 포맷팅 오류:", error, timestamp);
      return "날짜 정보 오류";
    }
  };

  const formatPickupTime = (pickupTime) => {
    if (!pickupTime) return "";

    try {
      const date = new Date(pickupTime);

      // 날짜가 유효한지 확인
      if (isNaN(date.getTime())) {
        console.error("유효하지 않은 픽업 시간:", pickupTime);
        return "픽업 시간 정보 오류";
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "오후" : "오전";
      const displayHours = hours > 12 ? hours - 12 : hours;

      return `${year}.${month}.${day}. ${ampm} ${displayHours}시 ${minutes}분 픽업`;
    } catch (error) {
      console.error("픽업 시간 포맷팅 오류:", error, pickupTime);
      return "픽업 시간 정보 오류";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
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
        return "주문확인";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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
        {/* 픽업 예정 시간 - 진행중인 주문일 때만 표시 */}
        {(order.status === "pending" ||
          order.status === "confirm" ||
          order.status === "ready") &&
          order.pickupTime && (
            <PickupStatus>
              <PickupStatusText>
                {formatPickupTime(order.pickupTime)}
              </PickupStatusText>
            </PickupStatus>
          )}

        {/* 예약번호 */}
        <OrderNumber>
          <OrderNumberLabel>예약번호</OrderNumberLabel>
          <OrderNumberValue>
            B{String(order.id).padStart(5, "0")}
          </OrderNumberValue>
        </OrderNumber>

        {/* 주문 정보 */}
        <OrderInfoSection>
          <OrderInfoItem>
            <OrderInfoLabel>주문 상태</OrderInfoLabel>
            <OrderInfoValue
              style={{ color: getStatusColor(order.status), fontWeight: "700" }}
            >
              {getStatusText(order.status)}
            </OrderInfoValue>
          </OrderInfoItem>
          <OrderInfoItem>
            <OrderInfoLabel>주문시각</OrderInfoLabel>
            <OrderInfoValue>{formatDate(order?.createdAt)}</OrderInfoValue>
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
                <ProductName>{item.name}</ProductName>
                <ProductInfo2>
                  <ProductQuantity>{item.qty}개</ProductQuantity>
                  <ProductPrice>{item.price.toLocaleString()}원</ProductPrice>
                </ProductInfo2>
              </ProductInfo>
              <ProductExpiry>유통기한: {orderDetails.expire}</ProductExpiry>
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

        {/* 주문 취소 사유 (취소된 주문인 경우) */}
        {orderDetails?.cancelReason && (
          <OrderInfoSection>
            <OrderInfoItem>
              <OrderInfoLabel>취소 사유</OrderInfoLabel>
              <OrderInfoValue style={{ color: "#ef4444" }}>
                {orderDetails.cancelReason}
              </OrderInfoValue>
            </OrderInfoItem>
          </OrderInfoSection>
        )}
      </Content>
    </PageContainer>
  );
};

export default CustomerOrderDetail;
