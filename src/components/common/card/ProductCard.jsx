import React, { useState, useMemo, useEffect } from "react";

import likeIcon from "../../../assets/icons/like/like.svg";
import unlikeIcon from "../../../assets/icons/like/unlike.svg";
import defaultImage from "../../../assets/images/defaultImage.svg";
import {
  CardContainer,
  CardContent,
  CardImage,
  DiscountRate,
  LikeButton,
  LikeIcon,
  PriceSection,
  ProductCardContainer,
  ProductCardContent,
  ProductCardDiscountRate,
  ProductCardImage,
  ProductCardPrice,
  ProductCardPriceSection,
  ProductName,
  StoreName,
  ListCardContainer,
  ListCardImage,
  ListCardContent,
  ListCardHeader,
  ListCardFooter,
  ListCardPriceSection,
  ListCardDiscountPrice,
  ListCardOriginalPrice,
  ListCardDiscountRate,
  ListCardCategory,
  ListCardStock,
  ListCardExpiry,
  ListCardContainer2,
  ProductName2,
} from "./ProductCard.styles";

const ProductCard = ({
  variant = "default",
  storeName,
  storeId,
  productName,
  categoryName,
  originalPrice,
  discountPrice,
  discountRate: discountRateProp,
  imageUrl,
  defaultImage: customDefaultImage = defaultImage,
  isLiked = false,
  onLikeToggle,
  onClick,
  onStoreClick,
  className = "",
  expiryTime,
  stock,
  id, // productId 추가
  ...props
}) => {
  const [liked, setLiked] = useState(isLiked);

  // isLiked prop이 변경될 때 내부 상태 동기화
  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked, id]);

  const discountRate = useMemo(() => {
    if (discountRateProp !== undefined && discountRateProp !== null) {
      return Number(discountRateProp) || 0;
    }
    if (
      originalPrice > 0 &&
      discountPrice >= 0 &&
      originalPrice > discountPrice
    ) {
      const rate = Math.round(
        ((originalPrice - discountPrice) / originalPrice) * 100
      );
      return rate > 0 ? rate : 0;
    }
    return 0;
  }, [discountRateProp, originalPrice, discountPrice]);

  const hasDiscount =
    originalPrice > 0 && discountPrice > 0 && originalPrice > discountPrice;

  const discountPriceText = Number(discountPrice || 0).toLocaleString();

  const displayImage = imageUrl || customDefaultImage;

  const handleLikeClick = (e) => {
    e.stopPropagation();
    const newLikedState = !liked;
    setLiked(newLikedState);
    // productId와 새로운 좋아요 상태를 전달
    onLikeToggle?.(id, newLikedState);
  };

  const handleStoreClick = (e) => {
    if (!onStoreClick) return;
    e.stopPropagation();
    onStoreClick(storeId);
  };

  const displayStoreName = (storeName || "").trim() || "상점";

  const getExpiryText = (expiryTime) => {
    if (!expiryTime) return "";
    const now = Date.now();
    const diff = expiryTime - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `D-${days}, ${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:00 남음`;
    } else if (hours > 0) {
      return `${hours}시간 ${minutes}분 남음`;
    } else {
      return `${minutes}분 남음`;
    }
  };

  return (
    <>
      {variant === "default" ? (
        <CardContainer onClick={onClick} style={{ cursor: "pointer" }}>
          <LikeButton
            onClick={handleLikeClick}
            aria-label={liked ? "좋아요 취소" : "좋아요"}
          >
            <LikeIcon
              src={liked ? likeIcon : unlikeIcon}
              alt={liked ? "좋아요" : "좋아요 안함"}
            />
          </LikeButton>
          <CardImage src={displayImage} alt={productName} />
          <CardContent>
            <StoreName
              onClick={onStoreClick ? handleStoreClick : undefined}
              style={onStoreClick ? { cursor: "pointer" } : {}}
            >
              {displayStoreName}
            </StoreName>
            <ProductName>{productName}</ProductName>
            <PriceSection>
              <p>{discountPriceText}원</p>
              {hasDiscount && discountRate > 0 ? (
                <DiscountRate>{discountRate}% 할인</DiscountRate>
              ) : hasDiscount ? (
                <DiscountRate>할인</DiscountRate>
              ) : (
                ""
              )}
            </PriceSection>
          </CardContent>
        </CardContainer>
      ) : variant === "compact" ? (
        <ProductCardContainer onClick={onClick} style={{ cursor: "pointer" }}>
          <LikeButton
            onClick={handleLikeClick}
            aria-label={liked ? "좋아요 취소" : "좋아요"}
          >
            <LikeIcon
              src={liked ? likeIcon : unlikeIcon}
              alt={liked ? "좋아요" : "좋아요 안함"}
            />
          </LikeButton>
          <ProductCardImage src={displayImage} alt={productName} />
          <ProductCardContent>
            <ProductName>{productName}</ProductName>
            <ProductCardPriceSection>
              {hasDiscount && discountRate > 0 ? (
                <ProductCardDiscountRate>
                  {discountRate}%
                </ProductCardDiscountRate>
              ) : hasDiscount ? (
                <ProductCardDiscountRate>할인</ProductCardDiscountRate>
              ) : (
                ""
              )}
              <ProductCardPrice>{discountPriceText}원</ProductCardPrice>
            </ProductCardPriceSection>
          </ProductCardContent>
        </ProductCardContainer>
      ) : variant === "list" ? (
        <ListCardContainer onClick={onClick} style={{ cursor: "pointer" }}>
          <ListCardExpiry>{getExpiryText(expiryTime)}</ListCardExpiry>
          <LikeButton
            onClick={handleLikeClick}
            aria-label={liked ? "좋아요 취소" : "좋아요"}
          >
            <LikeIcon
              src={liked ? likeIcon : unlikeIcon}
              alt={liked ? "좋아요" : "좋아요 안함"}
            />
          </LikeButton>
          <ListCardContainer2>
            <ListCardImage src={displayImage} alt={productName} />
            <ListCardContent>
              <ListCardHeader>
                <StoreName
                  onClick={onStoreClick ? handleStoreClick : undefined}
                  style={onStoreClick ? { cursor: "pointer" } : {}}
                >
                  {displayStoreName}
                </StoreName>
                <ProductName2>{productName}</ProductName2>
                {stock !== undefined && (
                  <ListCardStock>재고: {stock}개</ListCardStock>
                )}
              </ListCardHeader>
              <ListCardFooter>
                <ListCardPriceSection>
                  {hasDiscount && (
                    <ListCardOriginalPrice>
                      {Number(originalPrice || 0).toLocaleString()}원
                    </ListCardOriginalPrice>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {hasDiscount && discountRate > 0 ? (
                      <ListCardDiscountRate>
                        {discountRate}%
                      </ListCardDiscountRate>
                    ) : hasDiscount ? (
                      <ListCardDiscountRate>할인</ListCardDiscountRate>
                    ) : null}
                    <ListCardDiscountPrice>
                      {discountPriceText}원
                    </ListCardDiscountPrice>
                  </div>
                </ListCardPriceSection>
              </ListCardFooter>
            </ListCardContent>
          </ListCardContainer2>
        </ListCardContainer>
      ) : null}
    </>
  );
};

export default ProductCard;
