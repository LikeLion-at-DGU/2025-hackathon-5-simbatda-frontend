import React from "react";
import { useNavigate } from "react-router-dom";
import greencheck from "../../assets/icons/greencheck.png";
import graycheck from "../../assets/icons/graycheck.png";
import forward from "../../assets/icons/forward.png";
import {
  CardContainer,
  CardHeader,
  OrderMeta,
  OrderTitle,
  RightColumn,
  StatusBadge,
  PickupTime,
  CardBody,
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
        src={done ? greencheck : graycheck}
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

  return (
    <CardContainer {...props}>
      <CardHeader>
        <div>
          <OrderMeta>{children.createdAt}</OrderMeta>
          <OrderTitle>
            예약 번호 {children.orderNumber}
            <span>{children.itemSummary}</span>
          </OrderTitle>
        </div>
        <RightColumn>
          <StatusBadge $variant={variant}>
            {getStatusLabel(variant)}
          </StatusBadge>
          <PickupTime>{children.pickupTime}</PickupTime>
          <DetailRow
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("주문 정보 자세히 클릭됨");
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
        </RightColumn>
      </CardHeader>

      <CardBody>
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
      </CardBody>
    </CardContainer>
  );
}
