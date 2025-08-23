import React from "react";
import ProductListPage from "../../components/common/products/ProductListPage";
import {
  getSpecialPriceProducts,
  getStoreInfo,
  getWishlistProducts,
} from "../../api/products";

const SpecialPricePage = () => {
  const getProducts = async () => {
    let lat = 37.498095;
    let lng = 127.02761;
    const radius = 5;

    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        });
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      } catch (_) {
        // 권한 거부/실패 시 기본값 유지
      }
    }

    // 찜 목록 가져오기
    let wishlistProducts = [];
    try {
      wishlistProducts = await getWishlistProducts();
    } catch (error) {
      // 찜 목록 조회 실패 시 기본값 사용
    }

    // 찜 상품 ID Set 생성
    const wishlistProductIds = new Set(wishlistProducts.map((p) => p.id));

    const apiProducts = await getSpecialPriceProducts(lat, lng, radius);

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
      title="특가 상품"
      getProducts={getProducts}
      showExpiry={true}
      showCategory={false}
      description="30% 이상 할인된 상품을 확인해보세요!"
    />
  );
};

export default SpecialPricePage;
