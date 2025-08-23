import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/common/header/Header";
import SearchBar from "../../components/common/searchbar/SearchBar";
import CategoryChips from "../../components/common/chips/CategoryChips";
import AdvancedGoogleMap from "../../components/common/map/AdvancedGoogleMap";
import RecommendedProducts from "../../components/common/products/RecommendedProducts";
import SpecialPriceProducts from "../../components/common/products/SpecialPriceProducts";
import BottomSheet from "../../components/common/bottomsheet/BottomSheet";
import { apiRequest } from "../../api/client";
import { 
  getRecommendedProducts, 
  getSpecialPriceProducts, 
  getNearbyProducts,
  getProductsByCategory,
  getStoreInfo,
  getCategories,
} from "../../api/products";
import { PageContainer, Content } from "./MainPage.styles";
import { useAuth } from "../../hooks/useAuth";

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
    radius: 5
  });
  const [loading, setLoading] = useState(true);
  const [categoryNameToId, setCategoryNameToId] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [allNearbyProducts, setAllNearbyProducts] = useState([]);
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

  // 사용자 현재 위치 가져오기
  useEffect(() => {
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
        () => {},
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    }
  }, []);

  // 위치가 변경되면 상품 데이터 다시 가져오기
  useEffect(() => {
    if (userLocation.lat && userLocation.lng) {
      fetchProductsData();
    }
  }, [userLocation]);

  // 상품 데이터 가져오기
  const fetchProductsData = async () => {
    try {
      setLoading(true);
      
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
      setRecommendedProducts(mappedRec);

      // 특가상품 데이터
      const specialPrice = await getSpecialPriceProducts(
        userLocation.lat, 
        userLocation.lng, 
        userLocation.radius
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
      setSpecialPriceProducts(mappedSpecialPrice);

      // 근처 상품 데이터 가져오기 (검색용)
      const nearbyData = await getNearbyProducts({
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: userLocation.radius,
      });

      const mappedNearby = await Promise.all(
        (nearbyData || []).map(async (product) => {
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
            };
          }
        })
      );

      setAllNearbyProducts(mappedNearby);
      setFilteredNearbyProducts(mappedNearby);

    } catch (error) {
      setRecommendedProducts([]);
      setSpecialPriceProducts([]);
      setAllNearbyProducts([]);
      setFilteredNearbyProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    
    if (!searchTerm.trim()) {
      setFilteredNearbyProducts(allNearbyProducts);
      return;
    }

    // 클라이언트 사이드 필터링
    const filtered = allNearbyProducts.filter(
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
      filtered = allNearbyProducts;
    } else {
      // 클라이언트 사이드 카테고리 필터링
      filtered = allNearbyProducts.filter(
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
    try {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      const nearbyProducts = await getNearbyProducts({ lat, lng, radius: 2 });

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
    try {
      setSelectedLocationInfo({
        name: markerData.name,
        type: "store",
        query: markerData.title,
      });

      const nearbyProducts = await getNearbyProducts({
        lat: markerData.position.lat,
        lng: markerData.position.lng,
        radius: 1,
      });

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

  const handleProductLikeToggle = (productId, isLiked) => {
    // TODO: 좋아요 API 연동
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
        />
        <RecommendedProducts
          products={recommendedProducts}
          name={userInfo?.name || "사용자"}
        />
        <SpecialPriceProducts products={specialPriceProducts} />
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
