import React from "react";
import ProductListPage from "../../components/common/products/ProductListPage";
import {
  getRecommendedProducts,
  getStoreInfo,
  getWishlistProducts,
} from "../../api/products";

const RecommendedPage = () => {
  const getProducts = async () => {
    // 찜 목록 가져오기
    let wishlistProducts = [];
    try {
      wishlistProducts = await getWishlistProducts();
    } catch (error) {
      // 찜 목록 조회 실패 시 기본값 사용
    }

    // 찜 상품 ID Set 생성
    const wishlistProductIds = new Set(wishlistProducts.map((p) => p.id));

    const apiProducts = await getRecommendedProducts();

    const mapped = await Promise.all(
      (apiProducts || []).map(async (product) => {
        try {
          const storeInfo = product.store_id
            ? await getStoreInfo(product.store_id)
            : null;

          // 찜 상태 확인
          const isLiked = wishlistProductIds.has(product.id);

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
            isLiked: isLiked,
            expiryTime: product.expiration_date
              ? new Date(product.expiration_date).getTime()
              : undefined,
            stock: product.stock,
            categoryName: product.category_name || product.category?.name,
          };
        } catch (_) {
          // 찜 상태 확인
          const isLiked = wishlistProductIds.has(product.id);

          return {
            id: product.id,
            storeName: product.store_name || product.store?.name || "상점",
            productName: product.name,
            originalPrice: product.price,
            discountPrice: product.discount_price,
            imageUrl: product.image || "",
            isLiked: isLiked,
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
