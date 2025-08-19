import React, { useState, useMemo } from "react";

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
  ListCardExpiry,
  ListCardContainer2,
  ProductName2,
} from "./ProductCard.styles";

const ProductCard = ({
  variant = "default",
  storeName,
  productName,
  categoryName,
  originalPrice,
  discountPrice,
  imageUrl,
  defaultImage: customDefaultImage = defaultImage,
  isLiked = false,
  onLikeToggle,
  onClick,
  className = "",
  expiryTime,
  ...props
}) => {
  const [liked, setLiked] = useState(isLiked);

  // 할인율 자동 계산
  const discountRate = useMemo(() => {
    if (originalPrice <= discountPrice) return 0;
    const rate = Math.round(
      ((originalPrice - discountPrice) / originalPrice) * 100
    );
    return rate > 0 ? rate : 0;
  }, [originalPrice, discountPrice]);

  // 할인 여부
  const hasDiscount = discountRate > 0;

  const discountPriceText = discountPrice.toLocaleString();

  const displayImage = customDefaultImage;

  const handleLikeClick = (e) => {
    e.stopPropagation();
    const newLikedState = !liked;
    setLiked(newLikedState);
    onLikeToggle?.(newLikedState);
  };

  // 유통기한 계산
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
            <StoreName>{storeName}</StoreName>
            <ProductName>{productName}</ProductName>
            <PriceSection>
              <p>{discountPriceText}원</p>
              {hasDiscount ? (
                <DiscountRate>{discountRate}% 할인</DiscountRate>
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
            <StoreName>{storeName}</StoreName>
            <ProductName>{productName}</ProductName>
            <ProductCardPriceSection>
              {hasDiscount ? (
                <ProductCardDiscountRate>
                  {discountRate}%
                </ProductCardDiscountRate>
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
                <StoreName>{storeName}</StoreName>
                <ProductName2>{productName}</ProductName2>
                {categoryName && (
                  <ListCardCategory>{categoryName}</ListCardCategory>
                )}
              </ListCardHeader>
              <ListCardFooter>
                <ListCardPriceSection>
                  {hasDiscount && (
                    <ListCardDiscountRate>{discountRate}%</ListCardDiscountRate>
                  )}
                  <ListCardDiscountPrice>
                    {discountPriceText}원
                  </ListCardDiscountPrice>
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
