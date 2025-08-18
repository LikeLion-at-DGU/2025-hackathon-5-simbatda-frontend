import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import forward from "../../assets/icons/forward.png";
import {
  PageContainer,
  Header,
  BackButton,
  Section,
  Title,
  MetaList,
  MetaLabel,
  MetaValue,
  SectionHeader,
  ProductRow,
  ProductNote,
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
    reserver: "다람쥐쥐쥐쥐",
    phone: "000-000-0000",
    expire: "08.09. 22:00",
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <img src={forward} alt="뒤로 가기" />
        </BackButton>
        주문 상세
      </Header>

      <Section>
        <Title>{order.pickupTime} </Title>
        <MetaList>
          <MetaLabel>예약번호</MetaLabel>
          <MetaValue>{order.orderNumber}</MetaValue>
          <MetaLabel>주문시각</MetaLabel>
          <MetaValue>{order.createdAt}</MetaValue>
          <MetaLabel>예약자명</MetaLabel>
          <MetaValue>{order.reserver}</MetaValue>
          <MetaLabel>예약자 번호</MetaLabel>
          <MetaValue>{order.phone}</MetaValue>
        </MetaList>
      </Section>

      <Section>
        <SectionHeader>주문 상품 정보</SectionHeader>
        {order.items.map((it, idx) => (
          <ProductRow key={idx} $isLastItem={order.items.length === 1}>
            <div>{it.name}</div>
            <div style={{ textAlign: "center" }}>{it.qty}</div>
            <div style={{ textAlign: "right", fontWeight: 700 }}>
              {it.price.toLocaleString()}원
            </div>
            <ProductNote>유통기한: {order.expire}</ProductNote>
          </ProductRow>
        ))}
      </Section>
    </PageContainer>
  );
}
