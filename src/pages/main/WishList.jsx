import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/header/Header";
import WishListCard from "../../components/common/products/WishListCard";
import {
  Container,
  CardsGrid,
  EmptyState,
  EmptyText,
  EmptyImage,
} from "./WishList.styles";
import cryingCharacter from "../../assets/images/crying-character.svg";

const WishList = () => {
  const navigate = useNavigate();
  const [wishListItems, setWishListItems] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "사용자" });

  useEffect(() => {
    const mockWishListItems = [
      {
        id: 1,
        distance: "300m",
        storeName: "김치만 선생",
        productName: "돼지주물럭",
        category: "치킨",
        imageUrl: null,
        originalPrice: 8000,
        discountPrice: 5900,
        isLiked: true,
      },
      {
        id: 2,
        distance: "300m",
        storeName: "김치만 선생",
        productName: "돼지주물럭",
        category: "패스트푸드",
        imageUrl: null,
        originalPrice: 8000,
        discountPrice: 5900,
        isLiked: true,
      },
      {
        id: 3,
        distance: "300m",
        storeName: "김치만 선생",
        productName: "돼지주물럭",
        category: "치킨",
        imageUrl: null,
        originalPrice: 8000,
        discountPrice: 5900,
        isLiked: true,
      },
    ];

    setWishListItems(mockWishListItems);
  }, []);

  const handleLikeToggle = (productId, isLiked) => {
    if (!isLiked) {
      setWishListItems((prev) => prev.filter((item) => item.id !== productId));
    }

    console.log(`상품 ${productId} 찜 ${isLiked ? "추가" : "제거"}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/registeration/${productId}`);
  };

  const handleLogout = () => {
    console.log("로그아웃");
    navigate("/signin");
  };

  return (
    <Container>
      <Header userInfo={userInfo} onLogout={handleLogout} title="찜 목록" />

      {wishListItems.length > 0 ? (
        <CardsGrid>
          {wishListItems.map((item) => (
            <WishListCard
              key={item.id}
              {...item}
              onLikeToggle={handleLikeToggle}
              onClick={() => handleProductClick(item.id)}
            />
          ))}
        </CardsGrid>
      ) : (
        <EmptyState>
          <EmptyImage src={cryingCharacter} alt="cryingCharacter" />
          <EmptyText>아직 찜 내역이 없습니다</EmptyText>
        </EmptyState>
      )}
    </Container>
  );
};

export default WishList;
