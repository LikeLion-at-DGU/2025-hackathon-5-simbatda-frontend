import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/header/Header";
import SearchBar from "../../components/common/searchbar/SearchBar";
import CategoryChips from "../../components/common/chips/CategoryChips";
import AdvancedGoogleMap from "../../components/common/map/AdvancedGoogleMap";
import RecommendedProducts from "../../components/common/products/RecommendedProducts";
import SpecialPriceProducts from "../../components/common/products/SpecialPriceProducts";
import BottomSheet from "../../components/common/bottomsheet/BottomSheet";
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
import { PageContainer, Content } from "./MainPage.styles";
import { useAuth } from "../../hooks/useAuth";
import { getConsumerMe } from "../../api/auth";

function MainPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [specialPriceProducts, setSpecialPriceProducts] = useState([]);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedLocationInfo, setSelectedLocationInfo] = useState(null);
  const [locationProducts, setLocationProducts] = useState([]);
  const [userLocation, setUserLocation] = useState({
    lat: 37.498095, // 기본값 (강남역 근처)
    lng: 127.02761,
    radius: 5  // 반경을 5로 설정
  });
  const [loading, setLoading] = useState(true);
  const [categoryNameToId, setCategoryNameToId] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [nearbyProducts, setNearbyProducts] = useState([]); // 주변 상품만 (검색/필터용)
  const [allNearbyProducts, setAllNearbyProducts] = useState([]); // 지도용 전체 상품
  const [filteredNearbyProducts, setFilteredNearbyProducts] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

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
            radius: 5  // 반경을 5로 설정
          };
          setUserLocation(newLocation);
        },
        (error) => {
          // 위치 조회 실패 시 기본값 유지
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    }
  }, []);

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
          // 사용자 위치가 설정되지 않았으면 함수 실행하지 않음
      if (!userLocation.lat || !userLocation.lng) {
        return;
      }

    try {
      setLoading(true);
      
      // 현재 위치 정보를 함수 내에서 가져오기 (최신 값 보장)
      const currentLocation = {
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: userLocation.radius,
      };
      
      // 찜 목록 가져오기
      let wishlistProducts = [];
      try {
        wishlistProducts = await getWishlistProducts();
      } catch (error) {
        wishlistProducts = [];
      }
      
      // 찜 상품 ID Set 생성 (빠른 검색용)
      const wishlistProductIds = new Set(wishlistProducts.map(p => p.id));
      
      // 추천상품 데이터: 소비자 추천 API 사용
      const rec = await getRecommendedProducts();
      const mappedRec = await Promise.all(
        (rec || []).map(async (product) => {
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
            };
          } catch (_) {
            const resolvedStoreName =
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
            };
          }
        })
      );
      setRecommendedProducts(mappedRec);

      // 특가상품 데이터 - 현재 위치로 조회
      const specialPrice = await getSpecialPriceProducts(
        currentLocation.lat, 
        currentLocation.lng
      );
      
      const mappedSpecialPrice = await Promise.all(
        (specialPrice || []).map(async (product) => {
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
            };
          } catch (_) {
            const resolvedStoreName =
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
            };
          }
        })
      );
      setSpecialPriceProducts(mappedSpecialPrice);

      // 근처 상품 데이터 가져오기 (검색용) - 현재 위치로 조회
      const nearbyData = await getNearbyProducts(
        currentLocation.lat,
        currentLocation.lng
      );
      
      // 백엔드에서 이미 radius 기반으로 필터링해주므로 추가 필터링 불필요
      const filteredNearbyData = nearbyData || [];

      const mappedNearby = await Promise.all(
        (filteredNearbyData || []).map(async (product) => {
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
              categoryName: product.category_name,
              // 상점 위치 정보 추가
              store: {
                lat: product.store?.lat || product.lat,
                lng: product.store?.lng || product.lng,
                name: resolvedStoreName,
              },
              // 위도/경도 params로 조회된 상품 (가까운 상품)
              source: "nearby",
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
              categoryName: product.category_name,
              // 상점 위치 정보 추가
              store: {
                lat: product.store?.lat || product.lat,
                lng: product.store?.lng || product.lng,
                name: resolvedStoreName,
              },
              // 위도/경도 params로 조회된 상품 (가까운 상품)
              source: "nearby",
            };
          }
        })
      );

      // 주변 상품 저장 (검색/필터용)
      setNearbyProducts(mappedNearby);
      setFilteredNearbyProducts(mappedNearby);

      // 전체 상품 데이터 가져오기 (위도/경도 파라미터 없음) - "farther" 상품용
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
            
            // 상품의 위치 정보
            const productLat = product.store?.lat || product.lat;
            const productLng = product.store?.lng || product.lng;
            
            return {
              id: product.id,
              storeName: resolvedStoreName,
              productName: product.name,
              originalPrice: product.price,
              discountPrice: product.discount_price,
              imageUrl: product.image || "",
              isLiked: false,
              categoryName: product.category_name,
              // 상점 위치 정보 추가
              store: {
                lat: productLat,
                lng: productLng,
                name: resolvedStoreName,
              },

              // 위도/경도 params 없이 조회된 상품 (전체 상품)
              source: "all",
            };
          } catch (_) {
            const resolvedStoreName =
              (product.store_name && String(product.store_name).trim()) ||
              (product.store?.name && String(product.store.name).trim()) ||
              "상점";
            
            // 상품의 위치 정보
            const productLat = product.store?.lat || product.lat;
            const productLng = product.store?.lng || product.lng;
            
            return {
              id: product.id,
              storeName: resolvedStoreName,
              productName: product.name,
              originalPrice: product.price,
              discountPrice: product.discount_price,
              imageUrl: product.image || "",
              isLiked: false,
              categoryName: product.category_name,
              // 상점 위치 정보 추가
              store: {
                lat: productLat,
                lng: productLng,
                name: resolvedStoreName,
              },

              // 위도/경도 params 없이 조회된 상품 (전체 상품)
              source: "all",
            };
          }
        })
      );

      // 근처 상품과 전체 상품을 합쳐서 지도에 표시
      const allProductsForMap = [...mappedNearby, ...mappedAllProducts];
      
      // 중복 제거 (같은 ID를 가진 상품이 있으면 제거)
      const uniqueProducts = allProductsForMap.filter((product, index, self) => 
        index === self.findIndex(p => p.id === product.id)
      );
      
      setAllNearbyProducts(uniqueProducts);
      setFilteredNearbyProducts(uniqueProducts);
      
    } catch (error) {
      console.error("상품 데이터 로드 실패:", error);
      setRecommendedProducts([]);
      setSpecialPriceProducts([]);
      setAllNearbyProducts([]);
      setFilteredNearbyProducts([]);
    } finally {
      setLoading(false);
    }
  }, [userLocation]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    
    if (!searchTerm.trim()) {
      setFilteredNearbyProducts(nearbyProducts);
      return;
    }

    // 주변 상품에서만 검색
    const filtered = nearbyProducts.filter(
      (product) =>
        (product.productName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (product.storeName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (product.categoryName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    setFilteredNearbyProducts(filtered);
    
    // 검색 결과를 BottomSheet에 표시
    setLocationProducts(filtered);
    setSelectedLocationInfo({
      name: "검색상품",
      type: "search",
      query: searchTerm,
    });
    setBottomSheetOpen(true);
  };

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    
    let filtered;
    if (categoryName === "전체") {
      filtered = nearbyProducts;
    } else {
      // 주변 상품에서만 카테고리 필터링
      filtered = nearbyProducts.filter(
        (product) => product.categoryName === categoryName
      );
    }

    setFilteredNearbyProducts(filtered);
    
    // 카테고리 결과를 BottomSheet에 표시
    setLocationProducts(filtered);
    setSelectedLocationInfo({ name: categoryName, type: "category" });
    setBottomSheetOpen(true);
  };

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
      setSelectedLocationInfo({ name: "주변 상품", type: "nearby", query: "오류" });
      setBottomSheetOpen(true);
    }
  };

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
      setBottomSheetOpen(true);
    }
  };

  const handleClusterClick = (cluster) => {
    const map = cluster.map;
    const bounds = new window.google.maps.LatLngBounds();

    cluster.markers.forEach((marker) => {
      bounds.extend(marker.getPosition());
    });

    map.fitBounds(bounds);
  };

  const handleBottomSheetClose = () => {
    setBottomSheetOpen(false);
    setSelectedLocationInfo(null);
    setLocationProducts([]);
  };

  const handleProductClick = (productId) => {
    navigate(`/registeration/${productId}`);
  };

  const handleProductLikeToggle = async (productId, isLiked) => {
    try {
      await toggleWishlist(productId, isLiked);
      
      // 주변 상품 데이터 업데이트
      const updatedNearbyProducts = nearbyProducts.map(product => {
        if (product.id === productId) {
          return { ...product, isLiked: !isLiked };
        }
        return product;
      });
      
      // 전체 상품 데이터도 업데이트
      const updatedAllProducts = allNearbyProducts.map(product => {
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

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  if (loading) {
    return (
      <PageContainer>
        <Header userInfo={userInfo} onLogout={handleLogout} />
        <Content>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            fontSize: '18px',
            color: '#666'
          }}>
            상품을 불러오는 중...
          </div>
        </Content>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header userInfo={userInfo} onLogout={handleLogout} />

      <Content>
        <SearchBar 
          onSearch={handleSearch} 
          onChange={setSearchTerm}
          value={searchTerm}
        />
        <CategoryChips
          onCategoryChange={handleCategoryChange}
          initialCategory={selectedCategory}
        />
        <AdvancedGoogleMap
          onClick={handleMapClick}
          onMarkerClick={handleMarkerClick}
          onClusterClick={handleClusterClick}
          products={allNearbyProducts}
          userLocation={userLocation}
          markers={[]}
          showUserLocation={true}
        />
        <RecommendedProducts
          products={recommendedProducts}
          name={userInfo?.name || "사용자"}
          onProductLikeToggle={handleProductLikeToggle}
        />
        <SpecialPriceProducts 
          products={specialPriceProducts} 
          onProductLikeToggle={handleProductLikeToggle}
        />
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
}

export default MainPage;