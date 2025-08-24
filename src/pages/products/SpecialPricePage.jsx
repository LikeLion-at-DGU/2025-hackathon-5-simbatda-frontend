import React, { useState, useEffect } from "react";
import ProductListPage from "../../components/common/products/ProductListPage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  getSpecialPriceProducts,
  getStoreInfo,
  getWishlistProducts,
} from "../../api/products";

const SpecialPricePage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

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
        console.error("위치 정보 가져오기 실패:", error);
      }
    }

    let wishlistProducts = [];
    try {
      wishlistProducts = await getWishlistProducts();
    } catch (error) {
      console.error("찜 목록 가져오기 실패:", error);
    }

    const wishlistProductIds = new Set(wishlistProducts.map((p) => p.id));

    const apiProducts = await getSpecialPriceProducts(lat, lng, radius);

    const mapped = await Promise.all(
      (apiProducts || []).map(async (product) => {
        try {
          const storeInfo = product.store_id
            ? await getStoreInfo(product.store_id)
            : null;

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("특가 상품 조회 오류:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingSpinner text="특가 상품을 불러오는 중..." />;
  }

  return (
    <ProductListPage
      title="특가 상품"
      products={products}
      showExpiry={true}
      showCategory={false}
      description="30% 이상 할인 상품입니다!"
    />
  );
};

export default SpecialPricePage;
