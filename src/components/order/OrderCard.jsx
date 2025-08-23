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

    return `${ampm} ${displayHour}시 픽업`;
  };

  const formatActionTime = (dateString) => {
    const date = new Date(dateString);
    const hour = date.getHours();
    const ampm = hour >= 12 ? "오후" : "오전";
    const displayHour = hour >= 12 ? hour - 12 : hour;
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${ampm} ${displayHour}시 ${minute}분`;
  };

  const getStatusText = () => {
    if (actionType === "rejected") return "거절됨";
    return "수락됨";
  };

  return (
    <OrderCardContainer>
      <CardHeader>
        <LeftSection>
          <Timestamp>{formatTime(order.created_at)}</Timestamp>
          <OrderTitle>
            {order.product_name || "상품명"} {order.quantity || 1}개
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
          <InfoValue>{order.reservation_number || order.id}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>픽업 시간</InfoLabel>
          <InfoValue>
            {formatPickupTime(order.pickup_time || order.created_at)}
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
