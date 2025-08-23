import React, { useState, useMemo } from "react";
import likeIcon from "../../../assets/icons/like/like.svg";
import unlikeIcon from "../../../assets/icons/like/unlike.svg";
import defaultImage from "../../../assets/images/defaultImage.svg";
import {
  CardContainer,
  DistanceBadge,
  LikeButton,
  LikeIcon,
  CardContent,
  StoreName,
  ProductName,
  CategoryTag,
  ProductImage,
  PriceSection,
  DiscountRate,
  Price,
} from "./WishListCard.styles";

const WishListCard = ({
  id,
  distance = "300m",
  storeName,
  productName,
  category,
  imageUrl,
  originalPrice,
  discountPrice,
  isLiked = true,
  onLikeToggle,
  onClick,
}) => {
  const [liked, setLiked] = useState(isLiked);

  const discountRate = useMemo(() => {
    if (originalPrice <= discountPrice) return 0;
    const rate = Math.round(
      ((originalPrice - discountPrice) / originalPrice) * 100
    );
    return rate > 0 ? rate : 0;
  }, [originalPrice, discountPrice]);

  const displayImage = imageUrl || defaultImage;

  const handleLikeClick = (e) => {
    e.stopPropagation();
    const newLikedState = !liked;
    setLiked(newLikedState);
    onLikeToggle?.(id, newLikedState);
  };

  return (
    <CardContainer onClick={onClick}>
      <DistanceBadge>{distance}</DistanceBadge>
      <LikeButton
        onClick={handleLikeClick}
        aria-label={liked ? "찜 취소" : "찜하기"}
      >
        <LikeIcon
          src={liked ? likeIcon : unlikeIcon}
          alt={liked ? "찜됨" : "찜 안됨"}
        />
      </LikeButton>

      <CardContent>
        <StoreName>{storeName}</StoreName>
        <ProductName>
          {productName}
          {category && <CategoryTag>{category}</CategoryTag>}
        </ProductName>
      </CardContent>

      <ProductImage src={displayImage} alt={productName} />

      <PriceSection>
        {discountRate > 0 && <DiscountRate>{discountRate}%</DiscountRate>}
        <Price>{discountPrice.toLocaleString()}원</Price>
      </PriceSection>
    </CardContainer>
  );
};

export default WishListCard;
