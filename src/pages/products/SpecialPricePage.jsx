import React from "react";
import ProductListPage from "../../components/common/products/ProductListPage";
import { mockUtils } from "../../mocks/UnifiedMockData";

const getSpecialPriceProducts = () => {
  const products = mockUtils.getSpecialPriceProducts();

  const mappedProducts = products.map((product) => ({
    id: product.id,
    storeName: mockUtils.getStoreById(product.storeId)?.name || "상점",
    productName: product.name,
    categoryName:
      mockUtils.getCategoryById(product.categoryId)?.name || "카테고리",
    originalPrice: product.originalPrice,
    discountPrice: product.discountPrice,
    imageUrl: product.images?.[0] || "",
    isLiked: mockUtils.isProductLiked(1, product.id),
    expiryTime: Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000, // 랜덤 유통기한 (7일 이내)
  }));

  return mappedProducts;
};

const SpecialPricePage = () => {
  return (
    <ProductListPage
      title="특가 상품"
      getProducts={getSpecialPriceProducts}
      showExpiry={true}
      showCategory={true}
      description="30% 이상 할인된 상품을 확인해보세요!"
    />
  );
};

export default SpecialPricePage;
