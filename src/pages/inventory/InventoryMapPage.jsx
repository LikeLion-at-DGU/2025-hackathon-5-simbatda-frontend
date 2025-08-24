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
    lat: null,
    lng: null,
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

  // 사용자 위치 요청 함수
  const requestUserLocation = useCallback(() => {
    // 이미 userLocation이 설정되어 있으면 다시 요청하지 않음
    if (userLocation.lat && userLocation.lng) {
      return;
    }

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
          // 위치 권한이 거부된 경우
          if (error.code === error.PERMISSION_DENIED) {
            // 권한이 거부된 경우 자동으로 다시 요청
            setTimeout(() => {
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
                  (retryError) => {
                    // 두 번째 시도도 실패하면 아무것도 하지 않음
                    console.log("위치 권한 재요청 실패");
                  },
                  {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000,
                  }
                );
              }
            }, 1000); // 1초 후 다시 시도
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    }
  }, [userLocation.lat, userLocation.lng]);

  // 컴포넌트 마운트 시 위치 요청
  useEffect(() => {
    // 이미 userLocation이 설정되어 있으면 다시 요청하지 않음
    if (userLocation.lat && userLocation.lng) {
      return;
    }

    // 약간의 지연을 두어 사용자 제스처로 인식되도록 함
    const timer = setTimeout(() => {
      requestUserLocation();
    }, 100);

    return () => clearTimeout(timer);
  }, [requestUserLocation, userLocation.lat, userLocation.lng]);

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

  // 위치가 변경되면 상품 데이터 다시 가져오기
  useEffect(() => {
    // userLocation이 설정되지 않았어도 fetchProductsData 호출
    fetchProductsData();
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

      // 모든 상품 데이터를 가져오기 (위치 기반 필터링 없음)
      const allProducts = await getAllProducts();

      const mappedAllProducts = await Promise.all(
        (allProducts || []).map(async (product) => {
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
              // 모든 상품 (source는 나중에 거리 계산으로 결정)
              source: "temp",
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
              // 모든 상품 (source는 나중에 거리 계산으로 결정)
              source: "temp",
            };
          }
        })
      );

      // 모든 상품을 지도에 표시
      const allProductsForMap = [...mappedAllProducts];

      // 중복 제거하면서 정확한 source 정보 설정
      const uniqueProducts = [];
      const seenIds = new Set();

      // 모든 상품을 순회하면서 거리 계산
      const productsWithDistance = [];
      allProductsForMap.forEach((product) => {
        if (!seenIds.has(product.id)) {
          seenIds.add(product.id);

          // 사용자 위치와 상품 위치의 실제 거리 계산
          // userLocation이 없으면 기본 좌표 사용
          const currentLat = userLocation.lat || 37.5665;
          const currentLng = userLocation.lng || 126.978;

          if (product.store && product.store.lat && product.store.lng) {
            const distance = Math.sqrt(
              Math.pow(product.store.lat - currentLat, 2) +
                Math.pow(product.store.lng - currentLng, 2)
            );

            productsWithDistance.push({
              ...product,
              distance: distance,
            });
          } else {
            // 위치 정보가 없는 경우 기본값
            productsWithDistance.push({
              ...product,
              distance: Infinity,
            });
          }
        }
      });

      // 거리순으로 정렬
      productsWithDistance.sort((a, b) => a.distance - b.distance);

      productsWithDistance.forEach((product) => {
        // 실제 거리가 0.05 이하인 상품만 nearby로 설정
        const isNearby = product.distance <= 0.05;

        uniqueProducts.push({
          ...product,
          source: isNearby ? "nearby" : "all",
        });
      });

      // 주변 상품과 전체 상품 분리
      const nearbyProducts = uniqueProducts.filter(
        (p) => p.source === "nearby"
      );

      // 주변 상품 저장 (검색/필터용)
      setNearbyProducts(nearbyProducts);
      setAllNearbyProducts(uniqueProducts);
      setFilteredNearbyProducts(nearbyProducts);
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

      // 찜 목록 다시 가져오기
      let wishlistProducts = [];
      try {
        wishlistProducts = await getWishlistProducts();
      } catch (error) {
        wishlistProducts = [];
      }
      const wishlistProductIds = new Set(wishlistProducts.map((p) => p.id));

      // 주변 상품 데이터 업데이트 (실제 찜 상태 반영)
      const updatedNearbyProducts = nearbyProducts.map((product) => {
        if (product.id === productId) {
          return { ...product, isLiked: wishlistProductIds.has(product.id) };
        }
        return product;
      });

      // 전체 상품 데이터도 업데이트
      const updatedAllProducts = allNearbyProducts.map((product) => {
        if (product.id === productId) {
          return { ...product, isLiked: wishlistProductIds.has(product.id) };
        }
        return product;
      });

      // locationProducts도 업데이트 (BottomSheet에 표시되는 상품들)
      const updatedLocationProducts = locationProducts.map((product) => {
        if (product.id === productId) {
          return { ...product, isLiked: wishlistProductIds.has(product.id) };
        }
        return product;
      });

      setNearbyProducts(updatedNearbyProducts);
      setAllNearbyProducts(updatedAllProducts);
      setFilteredNearbyProducts(updatedNearbyProducts);
      setLocationProducts(updatedLocationProducts);
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
    try {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      // 클릭한 위치 근처의 상품들을 allNearbyProducts에서 찾기
      const clickedProducts = allNearbyProducts.filter((product) => {
        if (!product.store || !product.store.lat || !product.store.lng) {
          return false;
        }

        // 클릭한 위치와 상품 위치 간의 거리 계산
        const distance = Math.sqrt(
          Math.pow(product.store.lat - lat, 2) +
            Math.pow(product.store.lng - lng, 2)
        );

        // 0.001도 이내의 상품만 선택 (약 100m)
        return distance <= 0.001;
      });

      // 해당 위치에 상품이 없으면 바텀시트를 열지 않음
      if (clickedProducts.length === 0) {
        return;
      }

      setLocationProducts(clickedProducts);
      setSelectedLocationInfo({
        name: "주변 상품",
        type: "nearby",
        query: `위치: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      });
      setBottomSheetOpen(true);
    } catch (error) {
      console.error("지도 클릭 처리 오류:", error);
      // 오류가 발생해도 바텀시트를 열지 않음
    }
  };

  // 마커 클릭 핸들러
  const handleMarkerClick = async (markerData) => {
    try {
      setSelectedLocationInfo({
        name: markerData.name,
        type: "store",
        query: markerData.title,
      });

      // 찜 목록 가져오기
      let wishlistProducts = [];
      try {
        wishlistProducts = await getWishlistProducts();
      } catch (error) {
        wishlistProducts = [];
      }
      const wishlistProductIds = new Set(wishlistProducts.map((p) => p.id));

      // 마커 위치 근처의 상품들을 allNearbyProducts에서 찾기
      const clickedProducts = allNearbyProducts.filter((product) => {
        if (!product.store || !product.store.lat || !product.store.lng) {
          return false;
        }

        // 마커 위치와 상품 위치 간의 거리 계산
        const distance = Math.sqrt(
          Math.pow(product.store.lat - markerData.position.lat, 2) +
            Math.pow(product.store.lng - markerData.position.lng, 2)
        );

        // 0.001도 이내의 상품만 선택 (약 100m)
        return distance <= 0.001;
      });

      setLocationProducts(clickedProducts);
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
  const handleClusterClick = async (cluster) => {
    try {
      const map = cluster.map;
      const bounds = new window.google.maps.LatLngBounds();

      // 클러스터에 포함된 모든 마커의 위치를 수집
      const clusterPositions = [];
      cluster.markers.forEach((marker) => {
        const position = marker.getPosition();
        bounds.extend(position);
        clusterPositions.push({
          lat: position.lat(),
          lng: position.lng(),
        });
      });

      // 지도를 클러스터 영역으로 확대
      map.fitBounds(bounds);

      // 클러스터에 포함된 모든 상품 데이터 수집
      let allClusterProducts = [];

      for (const position of clusterPositions) {
        // 클러스터 위치 근처의 상품들을 allNearbyProducts에서 찾기
        const clusterProducts = allNearbyProducts.filter((product) => {
          if (!product.store || !product.store.lat || !product.store.lng) {
            return false;
          }

          // 클러스터 위치와 상품 위치 간의 거리 계산
          const distance = Math.sqrt(
            Math.pow(product.store.lat - position.lat, 2) +
              Math.pow(product.store.lng - position.lng, 2)
          );

          // 0.001도 이내의 상품만 선택 (약 100m)
          return distance <= 0.001;
        });

        if (clusterProducts.length > 0) {
          allClusterProducts.push(...clusterProducts);
        }
      }

      // 중복 제거 (같은 ID를 가진 상품이 있으면 제거)
      const uniqueProducts = allClusterProducts.filter(
        (product, index, self) =>
          index === self.findIndex((p) => p.id === product.id)
      );

      if (uniqueProducts.length > 0) {
        setLocationProducts(uniqueProducts);
        setSelectedLocationInfo({
          name: "클러스터 상품",
          type: "cluster",
          query: `${uniqueProducts.length}개 상품`,
        });
        setBottomSheetOpen(true);
      }
    } catch (error) {
      console.error("클러스터 클릭 처리 오류:", error);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Header userInfo={userInfo || { name: "사용자" }} title={"재고 지도"} />
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
      <Header userInfo={userInfo || { name: "사용자" }} title={"재고 지도"} />

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
