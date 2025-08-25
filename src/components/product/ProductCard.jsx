import React, { useEffect, useState } from "react";
import dots from "../../assets/icons/dots.png";
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

export default function ProductCard({ product, categories, onDelete }) {
  const [remainText, setRemainText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const productStock = product.stock || 0;
  const productExpiry = product.expiration_date
    ? new Date(product.expiration_date)
    : null;
  const productPrice = product.price || 0;
  const discountPrice = product.discount_price || null;

  const productCategory =
    categories?.find((cat) => cat.id === product.category)?.name || "기타";

  const productImage = product.image || product.imageUrl;

  useEffect(() => {
    if (productExpiry) {
      setRemainText(formatRemain(productExpiry));
      const timer = setInterval(
        () => setRemainText(formatRemain(productExpiry)),
        1000
      );
      return () => clearInterval(timer);
    }
  }, [productExpiry]);

  return (
    <CardContainer>
      <StockNotice $low={productStock <= 1}>
        <span>
          현재 재고 {String(productStock).padStart(2, "")}개 남았습니다
        </span>
        <div style={{ position: "relative" }}>
          <div onClick={() => setMenuOpen((v) => !v)} $menu>
            <img src={dots} alt="더보기" width={13} height={18} />
          </div>
          {menuOpen && (
            <MoreMenu onMouseLeave={() => setMenuOpen(false)}>
              <MoreMenuItem onClick={() => onDelete?.(product.id)}>
                메뉴 삭제
              </MoreMenuItem>
            </MoreMenu>
          )}
        </div>
      </StockNotice>

      <CardBody>
        <LeftColumn>
          <Preview>
            {productImage ? (
              <img src={productImage} alt={product.name} />
            ) : (
              <span>이미지 등록 필요</span>
            )}
          </Preview>
          <Meta>
            <Category>{productCategory}</Category>
            <Title>{product.name}</Title>
            {product.description && (
              <Description>{product.description}</Description>
            )}
            {productExpiry && <ExpireLabel>{remainText}</ExpireLabel>}
          </Meta>
        </LeftColumn>

        <RightColumn>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <StatusPill>
              <span>판매 중</span>
            </StatusPill>
          </div>

          <FooterRow>
            <Price>{(discountPrice || productPrice).toLocaleString()}원</Price>
          </FooterRow>
        </RightColumn>
      </CardBody>
    </CardContainer>
  );
}
