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
} from "./ProductCard.styles";

const ProductCard = ({
  variant = "default",
  storeName,
  productName,
  originalPrice,
  discountPrice,
  imageUrl,
  defaultImage: customDefaultImage = defaultImage,
  isLiked = false,
  onLikeToggle,
  onClick,
  className = "",
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
      ) : (
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
      )}
    </>
  );
};

export default ProductCard;
