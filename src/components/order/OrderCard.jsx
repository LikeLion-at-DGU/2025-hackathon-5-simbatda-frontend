import React from "react";
import { useNavigate } from "react-router-dom";
import forward from "../../assets/icons/forward.svg";
import {
  OrderCardContainer,
  CardHeader,
  LeftSection,
  Timestamp,
  OrderTitle,
  RightSection,
  ButtonGroup,
  AcceptButton,
  RejectButton,
  StatusBadge,
  OrderInfo,
  InfoRow,
  InfoLabel,
  InfoValue,
  DetailRow,
  DetailText,
} from "./OrderCard.styles";

const OrderCard = ({
  order,
  onAccept,
  onReject,
  isHistory = false,
  actionType,
  actionTime,
  rejectReason,
}) => {
  const navigate = useNavigate();
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = date.getHours();
    const ampm = hour >= 12 ? "오후" : "오전";
    const displayHour = hour >= 12 ? hour - 12 : hour;
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${month}.${day}. ${ampm} ${displayHour}시 ${minute}분`;
  };

  const formatPickupTime = (pickupTime) => {
    const date = new Date(pickupTime);
    const hour = date.getHours();
    const ampm = hour >= 12 ? "오후" : "오전";
    const displayHour = hour >= 12 ? hour - 12 : hour;
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${ampm} ${displayHour}시 ${minute}분 픽업`;
  };

  const formatActionTime = (dateString) => {
    const date = new Date(dateString);
    const hour = date.getHours();
    const ampm = hour >= 12 ? "오후" : "오전";
    const displayHour = hour >= 12 ? hour - 12 : hour;
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${ampm} ${displayHour}시 ${minute}분`;
  };

  const formatExpireDate = (dateString) => {
    if (!dateString) return "정보 없음";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${year}.${month}.${day} ${hour}:${minute}`;
  };

  const getStatusText = () => {
    if (actionType === "rejected") return "거절됨";
    return "수락됨";
  };

  return (
    <OrderCardContainer>
      <CardHeader>
        <LeftSection>
          <Timestamp>{formatTime(order.createdAt)}</Timestamp>
          <OrderTitle>
            {order.productName || "상품명"} {order.quantity || 1}개
          </OrderTitle>
        </LeftSection>
        <RightSection>
          {!isHistory ? (
            <ButtonGroup>
              <AcceptButton onClick={() => onAccept(order.id)}>
                수락
              </AcceptButton>
              <RejectButton onClick={() => onReject(order.id)}>
                거절
              </RejectButton>
            </ButtonGroup>
          ) : (
            <StatusBadge status={actionType}>{getStatusText()}</StatusBadge>
          )}
          <DetailRow
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/order-detail/${order.id}`);
            }}
          >
            <DetailText>주문 정보 자세히</DetailText>
            <img src={forward} alt="자세히 보기" width={16} height={16} />
          </DetailRow>
        </RightSection>
      </CardHeader>

      <OrderInfo>
        <InfoRow>
          <InfoLabel>예약 번호</InfoLabel>
          <InfoValue>
            {order.reservation_code || order.reservationCode || order.id}
          </InfoValue>
        </InfoRow>

        {order.status !== "cancel" && (
          <>
            {order.discount_price &&
              order.discount_price < order.totalPrice && (
                <>
                  <InfoRow>
                    <InfoLabel>원가</InfoLabel>
                    <InfoValue
                      style={{ textDecoration: "line-through", color: "#999" }}
                    >
                      {order.totalPrice?.toLocaleString() || "0"}원
                    </InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>할인가</InfoLabel>
                    <InfoValue style={{ color: "#E74C3C", fontWeight: "600" }}>
                      {order.discount_price?.toLocaleString() || "0"}원
                    </InfoValue>
                  </InfoRow>
                </>
              )}

            {(!order.discount_price ||
              order.discount_price >= order.totalPrice) && (
              <InfoRow>
                <InfoLabel>결제 금액</InfoLabel>
                <InfoValue style={{ color: "#37CA79", fontWeight: "600" }}>
                  {order.totalPrice?.toLocaleString() || "0"}원
                </InfoValue>
              </InfoRow>
            )}
            <InfoRow>
              <InfoLabel>유통기한</InfoLabel>
              <InfoValue>
                {order.expireDate
                  ? formatExpireDate(order.expireDate)
                  : "정보 없음"}
              </InfoValue>
            </InfoRow>
          </>
        )}

        <InfoRow>
          <InfoLabel>픽업 시간</InfoLabel>
          <InfoValue>
            {order.pickupTime || order.reservedAt
              ? formatPickupTime(order.pickupTime || order.reservedAt)
              : "주문 수락 시 30분 이내 픽업"}
          </InfoValue>
        </InfoRow>

        {actionType === "rejected" && rejectReason && (
          <InfoRow>
            <InfoLabel>거절 사유</InfoLabel>
            <InfoValue style={{ color: "#BE4A31" }}>{rejectReason}</InfoValue>
          </InfoRow>
        )}
      </OrderInfo>
    </OrderCardContainer>
  );
};

export default OrderCard;
