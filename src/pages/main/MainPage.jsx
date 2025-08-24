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
    lat: null,
    lng: null,
    radius: 5
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
            radius: 5
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
  }, [userLocation.lat, userLocation.lng]);

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
      
      // 추천상품 데이터: 소비자 추천 API 사용 (위치 기반)
      const rec = await getRecommendedProducts(userLocation.lat, userLocation.lng);
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



      // 모든 상품을 지도에 표시
      const allProductsForMap = [...mappedAllProducts];
      
      // 디버깅: userLocation 정보 확인

      
      // 중복 제거하면서 정확한 source 정보 설정
      const uniqueProducts = [];
      const seenIds = new Set();
      
      // 모든 상품을 순회하면서 거리 계산
      const productsWithDistance = [];
      allProductsForMap.forEach(product => {
        if (!seenIds.has(product.id)) {
          seenIds.add(product.id);
          
          // 사용자 위치와 상품 위치의 실제 거리 계산
          if (product.store && product.store.lat && product.store.lng && userLocation.lat && userLocation.lng) {
            const distance = Math.sqrt(
              Math.pow(product.store.lat - userLocation.lat, 2) + 
              Math.pow(product.store.lng - userLocation.lng, 2)
            );
            
            productsWithDistance.push({
              ...product,
              distance: distance
            });
          } else {
            // 위치 정보가 없는 경우 기본값
            productsWithDistance.push({
              ...product,
              distance: Infinity
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
          source: isNearby ? "nearby" : "all"
        });
      });
      

      
      // 주변 상품과 전체 상품 분리
      const nearbyProducts = uniqueProducts.filter(p => p.source === "nearby");
      
      // 주변 상품 저장 (검색/필터용)
      setNearbyProducts(nearbyProducts);
      setAllNearbyProducts(uniqueProducts);
      setFilteredNearbyProducts(nearbyProducts);
      
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
    
    // 검색 결과를 BottomSheet에 표시 (찜 상태 포함)
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
    
    // 카테고리 결과를 BottomSheet에 표시 (찜 상태 포함)
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

      // 클릭한 위치에 실제 상품이 있는지 확인 (매우 정확한 위치 매칭)
      const clickedProducts = allNearbyProducts.filter(product => {
        if (!product.store) return false;
        
        // 상품의 위치와 클릭한 위치의 거리 계산 (매우 작은 반경)
        const distance = Math.sqrt(
          Math.pow(product.store.lat - lat, 2) + 
          Math.pow(product.store.lng - lng, 2)
        );
        
        // 0.0001도는 약 10m에 해당 (매우 정확한 위치 매칭)
        return distance < 0.0001;
      });

      // 클릭한 위치에 상품이 없으면 아무것도 하지 않음
      if (clickedProducts.length === 0) {
        return;
      }

      // 찜 목록 가져오기
      let wishlistProducts = [];
      try {
        wishlistProducts = await getWishlistProducts();
      } catch (error) {
        wishlistProducts = [];
      }
      const wishlistProductIds = new Set(wishlistProducts.map((p) => p.id));

      // 클릭한 위치의 상품들을 매핑
      const mappedProducts = clickedProducts.map(product => ({
        id: product.id,
        storeName: product.storeName,
        productName: product.productName,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        imageUrl: product.imageUrl || "",
        isLiked: wishlistProductIds.has(product.id),
        // 원래 상품의 source 정보 유지
        source: product.source,
      }));

      setLocationProducts(mappedProducts);
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

      // 찜 목록 가져오기
      let wishlistProducts = [];
      try {
        wishlistProducts = await getWishlistProducts();
      } catch (error) {
        wishlistProducts = [];
      }
      const wishlistProductIds = new Set(wishlistProducts.map((p) => p.id));

      // 마커 위치에 정확히 맞는 상품들만 필터링
      const markerProducts = allNearbyProducts.filter(product => {
        if (!product.store) return false;
        
        // 상품의 위치와 마커 위치의 거리 계산 (매우 정확한 위치 매칭)
        const distance = Math.sqrt(
          Math.pow(product.store.lat - markerData.position.lat, 2) + 
          Math.pow(product.store.lng - markerData.position.lng, 2)
        );
        
        // 0.0001도는 약 10m에 해당 (매우 정확한 위치 매칭)
        return distance < 0.0001;
      });

      if (markerProducts.length === 0) {
        return;
      }

      // 마커 위치의 상품들을 매핑
      const mappedProducts = markerProducts.map(product => ({
        id: product.id,
        storeName: product.storeName,
        productName: product.productName,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        imageUrl: product.imageUrl || "",
        isLiked: wishlistProductIds.has(product.id),
        // 원래 상품의 source 정보 유지
        source: product.source,
      }));

      setLocationProducts(mappedProducts);
      setBottomSheetOpen(true);
    } catch (error) {
      console.error("마커 클릭 처리 오류:", error);
    }
  };

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
          lng: position.lng()
        });
      });

      // 지도를 클러스터 영역으로 확대
      map.fitBounds(bounds);

      // 찜 목록 가져오기
      let wishlistProducts = [];
      try {
        wishlistProducts = await getWishlistProducts();
      } catch (error) {
        wishlistProducts = [];
      }
      const wishlistProductIds = new Set(wishlistProducts.map((p) => p.id));

      // 클러스터에 포함된 모든 상품 데이터 수집 (이미 로드된 데이터에서 필터링)
      let allClusterProducts = [];
      
      for (const position of clusterPositions) {
        // 클러스터 위치에 정확히 맞는 상품들만 필터링
        const clusterProducts = allNearbyProducts.filter(product => {
          if (!product.store) return false;
          
          // 상품의 위치와 클러스터 위치의 거리 계산 (매우 정확한 위치 매칭)
          const distance = Math.sqrt(
            Math.pow(product.store.lat - position.lat, 2) + 
            Math.pow(product.store.lng - position.lng, 2)
          );
          
          // 0.0001도는 약 10m에 해당 (매우 정확한 위치 매칭)
          return distance < 0.0001;
        });
        
        if (clusterProducts.length > 0) {
          allClusterProducts.push(...clusterProducts);
        }
      }

      // 중복 제거 (같은 ID를 가진 상품이 있으면 제거)
      const uniqueProducts = allClusterProducts.filter((product, index, self) => 
        index === self.findIndex(p => p.id === product.id)
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

  const handleBottomSheetClose = () => {
    setBottomSheetOpen(false);
    setSelectedLocationInfo(null);
    setLocationProducts([]);
    
    // 바텀시트가 닫힐 때 검색어와 필터링된 결과 초기화
    setSearchTerm("");
    setFilteredNearbyProducts(nearbyProducts);
  };

  const handleProductClick = (productId) => {
    navigate(`/registeration/${productId}`);
  };

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
      const updatedNearbyProducts = nearbyProducts.map(product => {
        if (product.id === productId) {
          return { ...product, isLiked: wishlistProductIds.has(product.id) };
        }
        return product;
      });
      
      // 전체 상품 데이터도 업데이트
      const updatedAllProducts = allNearbyProducts.map(product => {
        if (product.id === productId) {
          return { ...product, isLiked: wishlistProductIds.has(product.id) };
        }
        return product;
      });
      
      // locationProducts도 업데이트 (BottomSheet에 표시되는 상품들)
      const updatedLocationProducts = locationProducts.map(product => {
        if (product.id === productId) {
          return { ...product, isLiked: wishlistProductIds.has(product.id) };
        }
        return product;
      });
      
      // filteredNearbyProducts도 업데이트 (검색/카테고리 필터 결과)
      const updatedFilteredNearbyProducts = filteredNearbyProducts.map(product => {
        if (product.id === productId) {
          return { ...product, isLiked: wishlistProductIds.has(product.id) };
        }
        return product;
      });
      
      setNearbyProducts(updatedNearbyProducts);
      setAllNearbyProducts(updatedAllProducts);
      setFilteredNearbyProducts(updatedFilteredNearbyProducts);
      setLocationProducts(updatedLocationProducts);
      
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