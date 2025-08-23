import React from "react";
import ProductListPage from "../../components/common/products/ProductListPage";
import { getRecommendedProducts, getStoreInfo } from "../../api/products";

const RecommendedPage = () => {
  const getProducts = async () => {
    const apiProducts = await getRecommendedProducts();

    const mapped = await Promise.all(
      (apiProducts || []).map(async (product) => {
        try {
          const storeInfo = product.store_id
            ? await getStoreInfo(product.store_id)
            : null;
          return {
            id: product.id,
            storeName:
              storeInfo?.name ||
              product.store_name ||
              product.store?.name ||
              "상점",
            productName: product.name,
            originalPrice: product.price,
            discountPrice: product.discount_price,
            imageUrl: product.image || "",
            isLiked: false,
            expiryTime: product.expiration_date
              ? new Date(product.expiration_date).getTime()
              : undefined,
            stock: product.stock,
            categoryName: product.category_name || product.category?.name,
          };
        } catch (_) {
          return {
            id: product.id,
            storeName: product.store_name || product.store?.name || "상점",
            productName: product.name,
            originalPrice: product.price,
            discountPrice: product.discount_price,
            imageUrl: product.image || "",
            isLiked: false,
            expiryTime: product.expiration_date
              ? new Date(product.expiration_date).getTime()
              : undefined,
            stock: product.stock,
            categoryName: product.category_name || product.category?.name,
          };
        }
      })
    );

    return mapped;
  };

  

  return (
    <ProductListPage
      title="추천 상품"
      getProducts={getProducts}
      showExpiry={true}
      showCategory={false}
      description="회원님이 좋아하실 재고를 발견했어요!"
    />
  );
};

export default RecommendedPage;
