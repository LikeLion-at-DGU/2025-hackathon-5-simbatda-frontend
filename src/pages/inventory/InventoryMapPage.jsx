import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AdvancedGoogleMap from "../../components/common/map/AdvancedGoogleMap";
import Header from "../../components/common/header/Header";
import BottomSheet from "../../components/common/bottomsheet/BottomSheet";
import inventoryPinIcon from "../../assets/icons/inventory-pin.svg";
import {
  getRecommendedProducts,
  getSpecialPriceProducts,
  getNearbyProducts,
  getProductsByCategory,
  getStoreInfo,
  getCategories,
  getAllProducts,
  toggleWishlist,
  getWishlistProducts,
} from "../../api/products";
import { getConsumerMe } from "../../api/auth";

const PageContainer = styled.div`
  height: 100vh;
  background-color: #f8f9fa;
  overflow: hidden;
`;

const Content = styled.div`
  padding: 0;
  height: 100vh;
  margin-top: 0;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
`;

const PageTitle = styled.h1`
  display: none; /* 제목 숨기기 */
`;

const InventoryMapPage = () => {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedLocationInfo, setSelectedLocationInfo] = useState(null);
  const [locationProducts, setLocationProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({
    lat: 37.498095, // 기본값 (강남역 근처)
    lng: 127.02761,
    radius: 5,
  });
  const [categoryNameToId, setCategoryNameToId] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [nearbyProducts, setNearbyProducts] = useState([]); // 주변 상품만 (검색/필터용)
  const [allNearbyProducts, setAllNearbyProducts] = useState([]); // 지도용 전체 상품
  const [filteredNearbyProducts, setFilteredNearbyProducts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // 사용자 정보 가져오기
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

  // 카테고리 이름 → ID 매핑 로드
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getCategories();
        if (!mounted) return;
        const map = {};
        (list || []).forEach((c) => {
          if (c?.name && c?.id != null) map[c.name] = c.id;
        });
        setCategoryNameToId(map);
      } catch (_) {}
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 사용자 위치 요청 함수
  const requestUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            radius: 5,
          };
          setUserLocation(newLocation);
        },
        (error) => {
          // 위치 조회 실패 시 기본값 유지
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    }
  }, []);

  // 컴포넌트 마운트 시 위치 요청 (사용자 제스처로 간주)
  useEffect(() => {
    // 약간의 지연을 두어 사용자 제스처로 인식되도록 함
    const timer = setTimeout(() => {
      requestUserLocation();
    }, 100);

    return () => clearTimeout(timer);
  }, [requestUserLocation]);

  // 위치가 변경되면 상품 데이터 다시 가져오기
  useEffect(() => {
    if (userLocation.lat && userLocation.lng) {
      fetchProductsData();
    }
  }, [userLocation]);

  // 상품 데이터 가져오기
  const fetchProductsData = useCallback(async () => {
    try {
      setLoading(true);

      // 찜 목록 가져오기
      let wishlistProducts = [];
      try {
        wishlistProducts = await getWishlistProducts();
      } catch (error) {
        wishlistProducts = [];
      }

      // 찜 상품 ID Set 생성
      const wishlistProductIds = new Set(wishlistProducts.map((p) => p.id));

      // 근처 상품 데이터 가져오기
      const nearbyData = await getNearbyProducts(
        userLocation.lat,
        userLocation.lng
      );

      // 전체 상품 데이터 가져오기
      const allProductsData = await getAllProducts();

      // 데이터 매핑
      const mapProductData = async (products, source) => {
        return await Promise.all(
          (products || []).map(async (product) => {
            try {
              const storeId = product.store_id ?? product.store?.id;
              const storeInfo = storeId ? await getStoreInfo(storeId) : null;
              const resolvedStoreName =
                (storeInfo?.name && storeInfo.name.trim()) ||
                (product.store_name && String(product.store_name).trim()) ||
                (product.store?.name && String(product.store.name).trim()) ||
                "상점";

              // 찜 상태 확인
              const isLiked = wishlistProductIds.has(product.id);

              return {
                id: product.id,
                storeName: resolvedStoreName,
                productName: product.name,
                originalPrice: product.price,
                discountPrice: product.discount_price,
                imageUrl: product.image || "",
                isLiked: isLiked,
                categoryName: product.category_name,
                stock: product.stock || 0,
                // 상점 위치 정보 추가
                store: {
                  lat: product.store?.lat || product.lat,
                  lng: product.store?.lng || product.lng,
                  name: resolvedStoreName,
                },
                source: source,
              };
            } catch (_) {
              const resolvedStoreName =
                (product.store_name && String(product.store_name).trim()) ||
                (product.store?.name && String(product.store.name).trim()) ||
                "상점";

              const isLiked = wishlistProductIds.has(product.id);

              return {
                id: product.id,
                storeName: resolvedStoreName,
                productName: product.name,
                originalPrice: product.price,
                discountPrice: product.discount_price,
                imageUrl: product.image || "",
                isLiked: isLiked,
                categoryName: product.category_name,
                stock: product.stock || 0,
                store: {
                  lat: product.store?.lat || product.lat,
                  lng: product.store?.lng || product.lng,
                  name: resolvedStoreName,
                },
                source: source,
              };
            }
          })
        );
      };

      const mappedNearby = await mapProductData(nearbyData, "nearby");
      const mappedAll = await mapProductData(allProductsData, "all");

      // 근처 상품과 전체 상품을 합쳐서 지도에 표시
      const allProductsForMap = [...mappedNearby, ...mappedAll];

      // 중복 제거
      const uniqueProducts = allProductsForMap.filter(
        (product, index, self) =>
          index === self.findIndex((p) => p.id === product.id)
      );

      setNearbyProducts(mappedNearby);
      setAllNearbyProducts(uniqueProducts);
      setFilteredNearbyProducts(mappedNearby);
    } catch (error) {
      console.error("상품 데이터 로드 실패:", error);
      setAllNearbyProducts([]);
    } finally {
      setLoading(false);
    }
  }, [userLocation]);

  // 바텀시트 닫기
  const handleBottomSheetClose = () => {
    setBottomSheetOpen(false);
    setSelectedLocationInfo(null);
    setLocationProducts([]);
  };

  // 상품 클릭 시 처리
  const handleProductClick = (productId) => {
    navigate(`/registeration/${productId}`);
  };

  // 찜 토글 처리
  const handleProductLikeToggle = async (productId, isLiked) => {
    try {
      await toggleWishlist(productId, isLiked);

      // 주변 상품 데이터 업데이트
      const updatedNearbyProducts = nearbyProducts.map((product) => {
        if (product.id === productId) {
          return { ...product, isLiked: !isLiked };
        }
        return product;
      });

      // 전체 상품 데이터도 업데이트
      const updatedAllProducts = allNearbyProducts.map((product) => {
        if (product.id === productId) {
          return { ...product, isLiked: !isLiked };
        }
        return product;
      });

      setNearbyProducts(updatedNearbyProducts);
      setAllNearbyProducts(updatedAllProducts);
      setFilteredNearbyProducts(updatedNearbyProducts);
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
    }
  };

  // 현재위치 업데이트 핸들러
  const handleLocationUpdate = useCallback((newLocation) => {
    setUserLocation({
      lat: newLocation.lat,
      lng: newLocation.lng,
      radius: 5,
    });
  }, []);

  // 지도 클릭 핸들러
  const handleMapClick = async (event) => {
    // 사용자 위치가 설정되지 않았으면 함수 실행하지 않음
    if (!userLocation.lat || !userLocation.lng) {
      return;
    }

    try {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      const nearbyProducts = await getNearbyProducts(lat, lng);

      const mappedNearbyProducts = await Promise.all(
        (nearbyProducts || []).map(async (product) => {
          try {
            const storeId = product.store_id ?? product.store?.id;
            const storeInfo = storeId ? await getStoreInfo(storeId) : null;
            const resolvedStoreName =
              (storeInfo?.name && storeInfo.name.trim()) ||
              (product.store_name && String(product.store_name).trim()) ||
              (product.store?.name && String(product.store.name).trim()) ||
              "상점";
            return {
              id: product.id,
              storeName: resolvedStoreName,
              productName: product.name,
              originalPrice: product.price,
              discountPrice: product.discount_price,
              imageUrl: product.image || "",
              isLiked: false,
            };
          } catch (_) {
            const resolvedStoreName =
              (product.store_name && String(product.store_name).trim()) ||
              (product.store?.name && String(product.store.name).trim()) ||
              "상점";
            return {
              id: product.id,
              storeName: resolvedStoreName,
              productName: product.name,
              originalPrice: product.price,
              discountPrice: product.discount_price,
              imageUrl: product.image || "",
              isLiked: false,
            };
          }
        })
      );

      setLocationProducts(mappedNearbyProducts);
      setSelectedLocationInfo({
        name: "주변 상품",
        type: "nearby",
        query: `위치: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      });
      setBottomSheetOpen(true);
    } catch (_) {
      setLocationProducts([]);
      setSelectedLocationInfo({
        name: "주변 상품",
        type: "nearby",
        query: "오류",
      });
      setBottomSheetOpen(true);
    }
  };

  // 마커 클릭 핸들러
  const handleMarkerClick = async (markerData) => {
    // 사용자 위치가 설정되지 않았으면 함수 실행하지 않음
    if (!userLocation.lat || !userLocation.lng) {
      return;
    }

    try {
      setSelectedLocationInfo({
        name: markerData.name,
        type: "store",
        query: markerData.title,
      });

      const nearbyProducts = await getNearbyProducts(
        markerData.position.lat,
        markerData.position.lng
      );

      const mappedNearbyProducts = await Promise.all(
        (nearbyProducts || []).map(async (product) => {
          try {
            const storeId = product.store_id ?? product.store?.id;
            const storeInfo = storeId ? await getStoreInfo(storeId) : null;
            const resolvedStoreName =
              (storeInfo?.name && storeInfo.name.trim()) ||
              (product.store_name && String(product.store_name).trim()) ||
              (product.store?.name && String(product.store.name).trim()) ||
              "상점";
            return {
              id: product.id,
              storeName: resolvedStoreName,
              productName: product.name,
              originalPrice: product.price,
              discountPrice: product.discount_price,
              imageUrl: product.image || "",
              isLiked: false,
            };
          } catch (_) {
            const resolvedStoreName =
              (product.store_name && String(product.store_name).trim()) ||
              (product.store?.name && String(product.store.name).trim()) ||
              "상점";
            return {
              id: product.id,
              storeName: resolvedStoreName,
              productName: product.name,
              originalPrice: product.price,
              discountPrice: product.discount_price,
              imageUrl: product.image || "",
              isLiked: false,
            };
          }
        })
      );

      setLocationProducts(mappedNearbyProducts);
      setBottomSheetOpen(true);
    } catch (_) {
      setLocationProducts([]);
      setSelectedLocationInfo({
        name: "주변 상품",
        type: "nearby",
        query: "오류",
      });
      setBottomSheetOpen(true);
    }
  };

  // 클러스터 클릭 핸들러
  const handleClusterClick = (cluster) => {
    const map = cluster.map;
    const bounds = new window.google.maps.LatLngBounds();

    cluster.markers.forEach((marker) => {
      bounds.extend(marker.getPosition());
    });

    map.fitBounds(bounds);
  };

  if (loading) {
    return (
      <PageContainer>
        <Header
          userInfo={userInfo || { name: "사용자" }}
          title={"재고 지도"}
          onLogout={() => {}}
        />
        <Content>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              fontSize: "18px",
              color: "#666",
            }}
          >
            재고 데이터를 불러오는 중...
          </div>
        </Content>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header
        userInfo={userInfo || { name: "사용자" }}
        title={"재고 지도"}
        onLogout={() => {}}
      />

      <Content>
        <PageTitle>재고 지도</PageTitle>

        <MapContainer>
          <AdvancedGoogleMap
            onClick={handleMapClick}
            onMarkerClick={handleMarkerClick}
            onClusterClick={handleClusterClick}
            products={allNearbyProducts}
            userLocation={userLocation}
            markers={[]}
            showUserLocation={true}
            size="full"
          />
        </MapContainer>

        <BottomSheet
          isOpen={bottomSheetOpen}
          onClose={handleBottomSheetClose}
          location={selectedLocationInfo}
          products={locationProducts}
          onProductClick={handleProductClick}
          onProductLikeToggle={handleProductLikeToggle}
        />
      </Content>
    </PageContainer>
  );
};

export default InventoryMapPage;
