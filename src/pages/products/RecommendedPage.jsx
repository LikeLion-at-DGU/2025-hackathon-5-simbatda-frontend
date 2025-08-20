import React from "react";
import ProductListPage from "../../components/common/products/ProductListPage";
import { mockUtils } from "../../mocks/UnifiedMockData";

const getRecommendedProducts = () => {
  const products = mockUtils.getRecommendedProducts();

  return products.map((product) => ({
    id: product.id,
    storeName: mockUtils.getStoreById(product.storeId)?.name || "상점",
    productName: product.name,
    originalPrice: product.originalPrice,
    discountPrice: product.discountPrice,
    imageUrl: product.images?.[0] || "",
    isLiked: mockUtils.isProductLiked(1, product.id),
    expiryTime: Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000,
    stock: product.stock,
  }));
};

const RecommendedPage = () => {
  return (
    <ProductListPage
      title="추천 상품"
      getProducts={getRecommendedProducts}
      showExpiry={true}
      showCategory={false}
      description="테스트 사용자님이 좋아하실 재고를 발견했어요!"
    />
  );
};

export default RecommendedPage;
