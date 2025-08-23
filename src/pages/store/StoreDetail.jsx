import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/common/header/Header";
import ProductCard from "../../components/common/card/ProductCard";
import { getStoreInfo, getStoreProducts } from "../../api/products";
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

    let mounted = true;
    const load = async () => {
      try {
        if (!storeId) return;
        console.log("[StoreDetail] storeId:", storeId);
        const info = await getStoreInfo(storeId);
        console.log("[StoreDetail] getStoreInfo response:", info);
        if (!mounted) return;
        setStore({
          id: info?.id,
          name: info?.store_name || info?.name || "상점",
          isOpen: Boolean(info?.is_open),
          businessHours: info?.opening_time || "",
          phone: info?.phone || "",
          address: info?.address || "",
        });

        const products = await getStoreProducts(storeId);
        console.log(
          "[StoreDetail] getStoreProducts length:",
          Array.isArray(products) ? products.length : "(not array)",
          "sample:",
          Array.isArray(products) && products.length > 0 ? products[0] : null
        );
        if (!mounted) return;
        const mapped = (Array.isArray(products) ? products : []).map((p) => ({
          id: p.id,
          storeName: info?.store_name || info?.name || "상점",
          productName: p.name,
          originalPrice: p.price,
          discountPrice: p.discount_price,
          imageUrl: p.image || "",
          isLiked: false,
          expiryTime: p.expiration_date
            ? new Date(p.expiration_date).getTime()
            : undefined,
          stock: p.stock,
        }));
        setStoreProducts(mapped);
      } catch (e) {
        console.log("[StoreDetail] load error:", e);
        if (!mounted) return;
        setStore(null);
        setStoreProducts([]);
      }
    };

    load();
    return () => {
      mounted = false;
    };
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
            <StoreDetailValue>{store.phone || "-"}</StoreDetailValue>
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
                productName={product.productName}
                originalPrice={product.originalPrice}
                discountPrice={product.discountPrice}
                imageUrl={product.imageUrl}
                isLiked={product.isLiked}
                expiryTime={product.expiryTime}
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
