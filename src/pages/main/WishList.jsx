import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/header/Header";
import WishListCard from "../../components/common/products/WishListCard";
import { getWishlistProducts, toggleWishlist } from "../../api/products";
import { getConsumerMe } from "../../api/auth";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getConsumerMe();
        setUserInfo({ name: userData.name });
      } catch (error) {
        console.error("사용자 정보 조회 오류:", error);
        setUserInfo({ name: "사용자" });
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const wishlistData = await getWishlistProducts();

        const mappedWishlistItems = wishlistData.map((item) => ({
          id: item.id,
          storeName: item.store_name || item.store?.name || "상점",
          productName: item.name,
          category: item.category_name || item.category?.name || "카테고리",
          imageUrl: item.image,
          originalPrice: item.price,
          discountPrice: item.discount_price,
          isLiked: true,
        }));

        setWishListItems(mappedWishlistItems);
      } catch (error) {
        console.error("찜 목록 조회 오류:", error);
        setError("찜 목록을 불러오는데 실패했습니다.");
        setWishListItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, []);

  const handleLikeToggle = async (productId, isLiked) => {
    try {
      await toggleWishlist(productId, !isLiked);

      if (!isLiked) {
        setWishListItems((prev) =>
          prev.filter((item) => item.id !== productId)
        );
      }

      console.log(`상품 ${productId} 찜 ${isLiked ? "추가" : "제거"} 완료`);
    } catch (error) {
      console.error("찜 상태 변경 오류:", error);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/registeration/${productId}`);
  };

  return (
    <Container>
      <Header userInfo={userInfo} title="찜 목록" />

      {loading ? (
        <EmptyState>
          <EmptyText>찜 목록을 불러오는 중...</EmptyText>
        </EmptyState>
      ) : error ? (
        <EmptyState>
          <EmptyImage src={cryingCharacter} alt="cryingCharacter" />
          <EmptyText>{error}</EmptyText>
        </EmptyState>
      ) : wishListItems.length > 0 ? (
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
