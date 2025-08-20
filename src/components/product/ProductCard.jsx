import React, { useEffect, useMemo, useState } from "react";
import dots from "../../assets/icons/dots.svg";
import {
  CardContainer,
  StockNotice,
  CardBody,
  LeftColumn,
  Preview,
  Meta,
  Category,
  Title,
  Description,
  FooterRow,
  ExpireLabel,
  Price,
  RightColumn,
  StatusPill,
  MoreMenu,
  MoreMenuItem,
} from "./ProductCard.styles";

function formatRemain(expiry) {
  const now = new Date();
  const diffMs = Math.max(0, expiry.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `D-${days}, ${hours}:${minutes}:${seconds} 남음`;
}

export default function ProductCard({ product, onDelete }) {
  const [remainText, setRemainText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const expiry = useMemo(
    () => new Date(product.expiryISO),
    [product.expiryISO]
  );

  useEffect(() => {
    setRemainText(formatRemain(expiry));
    const timer = setInterval(() => setRemainText(formatRemain(expiry)), 1000);
    return () => clearInterval(timer);
  }, [expiry]);

  return (
    <CardContainer>
      <StockNotice $low={Number(product.quantity) <= 1}>
        <span>
          현재 재고 {String(product.quantity).padStart(2, "")}개 남았습니다
        </span>
      </StockNotice>

      <CardBody>
        <LeftColumn>
          <Preview>
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} />
            ) : (
              <span>이미지 등록 필요</span>
            )}
          </Preview>
          <Meta>
            <Category>{product.categories?.[0] || "기타"}</Category>
            <Title>{product.name}</Title>
            {product.description && (
              <Description>{product.description}</Description>
            )}
          </Meta>
          <ExpireLabel>{remainText}</ExpireLabel>
        </LeftColumn>

        <RightColumn>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <StatusPill>
              <span>판매 중</span>
            </StatusPill>
            <div style={{ position: "relative" }}>
              <StatusPill onClick={() => setMenuOpen((v) => !v)} $menu>
                <img src={dots} alt="더보기" width={13} height={13} />
              </StatusPill>
              {menuOpen && (
                <MoreMenu onMouseLeave={() => setMenuOpen(false)}>
                  <MoreMenuItem onClick={() => onDelete?.(product.id)}>
                    메뉴 삭제
                  </MoreMenuItem>
                </MoreMenu>
              )}
            </div>
          </div>

          <FooterRow>
            <Price>{Number(product.finalPrice || 0).toLocaleString()}원</Price>
          </FooterRow>
        </RightColumn>
      </CardBody>
    </CardContainer>
  );
}
