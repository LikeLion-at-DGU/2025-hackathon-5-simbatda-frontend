import React from "react";
import { useNavigate } from "react-router-dom";
import forward from "../../assets/icons/forward.svg";
import greencheck1 from "../../assets/icons/greencheck1.svg";
import graycheck1 from "../../assets/icons/graycheck1.svg";
import {
  CardContainer,
  CardHeader,
  LeftSection,
  Timestamp,
  OrderTitle,
  RightSection,
  StatusBadge,
  OrderInfo,
  InfoRow,
  InfoLabel,
  InfoValue,
  Steps,
  Step,
  StepCheck,
  DetailRow,
  DetailText,
} from "./OrderProgressCard.styles";

function StepCheckIcon({ done }) {
  return (
    <StepCheck $done={done}>
      <img
        src={done ? greencheck1 : graycheck1}
        alt={done ? "완료" : "미완료"}
        width={14}
        height={14}
      />
    </StepCheck>
  );
}

export default function OrderProgressCard({
  variant = "action",
  children,
  ...props
}) {
  const navigate = useNavigate();
  const getStatusLabel = (variant) => {
    switch (variant) {
      case "action":
        return "준비 완료";
      case "waiting":
        return "픽업 대기";
      case "done":
        return "픽업 완료";
      default:
        return "준비 완료";
    }
  };

  const formatTime = (dateString) => {
    if (typeof dateString === "string" && dateString.includes("시")) {
      return dateString;
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = date.getHours();
    const ampm = hour >= 12 ? "오후" : "오전";
    const displayHour = hour >= 12 ? hour - 12 : hour;
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${month}.${day}. ${ampm} ${displayHour}시 ${minute}분`;
  };

  const formatPickupTime = (pickupTime) => {
    if (typeof pickupTime === "string" && pickupTime.includes("시")) {
      return pickupTime;
    }

    const date = new Date(pickupTime);
    if (isNaN(date.getTime())) {
      return pickupTime;
    }

    const hour = date.getHours();
    const ampm = hour >= 12 ? "오후" : "오전";
    const displayHour = hour >= 12 ? hour - 12 : hour;

    return `${ampm} ${displayHour}시`;
  };

  return (
    <CardContainer {...props}>
      <CardHeader>
        <LeftSection>
          <Timestamp>{formatTime(children.createdAt)}</Timestamp>
          <OrderTitle>{children.itemSummary}</OrderTitle>
        </LeftSection>
        <RightSection>
          <StatusBadge $variant={variant}>
            {getStatusLabel(variant)}
          </StatusBadge>
          <DetailRow
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate("/order-detail", {
                state: {
                  orderNumber: children.orderNumber,
                  createdAt: children.createdAt,
                  pickupTime: children.pickupTime,
                  items: [
                    {
                      name: children.itemSummary,
                      qty: 1,
                      price: 5600,
                    },
                  ],
                },
              });
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
          <InfoValue>{children.orderNumber}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>픽업 시간</InfoLabel>
          <InfoValue>{formatPickupTime(children.pickupTime)}</InfoValue>
        </InfoRow>
      </OrderInfo>

      <Steps>
        <Step $done={children.steps?.confirm}>
          주문 확인
          <StepCheckIcon done={children.steps?.confirm} />
        </Step>
        <Step $done={children.steps?.prepare}>
          상품 준비
          <StepCheckIcon done={children.steps?.prepare} />
        </Step>
        <Step $done={children.steps?.pickup}>
          픽업 완료
          <StepCheckIcon done={children.steps?.pickup} />
        </Step>
      </Steps>
    </CardContainer>
  );
}
