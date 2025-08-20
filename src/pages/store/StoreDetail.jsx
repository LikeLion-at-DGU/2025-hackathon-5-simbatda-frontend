import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/common/header/Header";
import ProductCard from "../../components/common/card/ProductCard";
import { mockUtils } from "../../mocks/UnifiedMockData";
import {
  PageContainer,
  Content,
  StoreHeader,
  StoreInfo,
  StoreName,
  StoreStatus,
  StoreDetails,
  StoreDetailItem,
  StoreDetailLabel,
  StoreDetailValue,
  StoreProducts,
  StoreProductsTitle,
  ProductGrid,
  EmptyState,
  EmptyText,
} from "./StoreDetail.styles";

const StoreDetail = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [storeProducts, setStoreProducts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    setUserInfo({ name: "테스트 사용자" });

    // 상점 정보 가져오기
    const storeData = mockUtils.getStoreById(parseInt(storeId));
    if (storeData) {
      setStore(storeData);

      // 해당 상점의 상품들 가져오기
      const products = mockUtils.getProductsByStore(parseInt(storeId));
      setStoreProducts(products);
    }
  }, [storeId]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/signin");
  };

  const handleProductClick = (productId) => {
    navigate(`/registeration/${productId}`);
  };

  const handleProductLikeToggle = (productId, isLiked) => {
    // TODO: 좋아요 API 연동
  };

  if (!store) {
    return (
      <PageContainer>
        <Header userInfo={userInfo} onLogout={handleLogout} title="상점 정보" />
        <EmptyState>
          <EmptyText>상점을 찾을 수 없습니다.</EmptyText>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header userInfo={userInfo} onLogout={handleLogout} title="상점 정보" />

      <Content>
        <StoreHeader>
          <StoreInfo>
            <StoreName>{store.name}</StoreName>
            <StoreStatus>{store.isOpen ? "open" : "close"}</StoreStatus>
          </StoreInfo>
          <StoreDetailItem>
            <StoreDetailLabel>영업시간</StoreDetailLabel>
            <StoreDetailValue>{store.businessHours}</StoreDetailValue>
          </StoreDetailItem>
          <StoreDetailItem>
            <StoreDetailLabel>가게번호</StoreDetailLabel>
            <StoreDetailValue>{store.phone}</StoreDetailValue>
          </StoreDetailItem>
          <StoreDetailItem>
            <StoreDetailLabel>매장주소</StoreDetailLabel>
            <StoreDetailValue>{store.address}</StoreDetailValue>
          </StoreDetailItem>
        </StoreHeader>

          <StoreProductsTitle>{store.name}에 등록된 재고들</StoreProductsTitle>

          {storeProducts.length > 0 ? (
            <ProductGrid>
              {storeProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  variant="list"
                  storeName={store.name}
                  productName={product.name}
                  originalPrice={product.originalPrice}
                  discountPrice={product.discountPrice}
                  imageUrl={product.images?.[0] || ""}
                  isLiked={mockUtils.isProductLiked(1, product.id)}
                  expiryTime={
                    Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000
                  }
                  stock={product.stock}
                  onClick={() => handleProductClick(product.id)}
                  onLikeToggle={() =>
                    handleProductLikeToggle(product.id, product.isLiked)
                  }
                />
              ))}
            </ProductGrid>
          ) : (
            <EmptyState>
              <EmptyText>등록된 상품이 없습니다.</EmptyText>
            </EmptyState>
          )}
      </Content>
    </PageContainer>
  );
};

export default StoreDetail;
