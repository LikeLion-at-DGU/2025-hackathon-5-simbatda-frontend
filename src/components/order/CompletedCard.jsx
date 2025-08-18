import React from "react";
import { useNavigate } from "react-router-dom";
import forward from "../../assets/icons/forward.png";
import {
  CardContainer,
  CardHeader,
  OrderMeta,
  OrderTitle,
  RightColumn,
  StatusBadge,
  OrderInfo,
  InfoRow,
  InfoLabel,
  InfoValue,
  DetailRow,
  DetailText,
} from "./CompletedCard.styles";

export default function CompletedCard({ children, ...props }) {
  const navigate = useNavigate();

  return (
    <CardContainer {...props}>
      <CardHeader>
        <div>
          <OrderMeta>{children.createdAt}</OrderMeta>
          <OrderTitle>{children.itemSummary}</OrderTitle>
        </div>
        <RightColumn>
          <StatusBadge>진행 완료</StatusBadge>
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
        </RightColumn>
      </CardHeader>

      <OrderInfo>
        <InfoRow>
          <InfoLabel>예약 번호</InfoLabel>
          <InfoValue>{children.orderNumber}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>픽업 시간</InfoLabel>
          <InfoValue>{children.pickupTime}</InfoValue>
        </InfoRow>
      </OrderInfo>
    </CardContainer>
  );
}
