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
import { unifiedMockData, mockUtils } from "../../mocks/UnifiedMockData";
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
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // TODO: API 연결 X - mock 데이터 사용
    setUserInfo({ name: "테스트 사용자" });

    // 추천상품 데이터 (통합 목데이터 사용)
    const recommended = mockUtils.getRecommendedProducts();
    setRecommendedProducts(
      recommended.map((product) => ({
        id: product.id,
        storeName: mockUtils.getStoreById(product.storeId)?.name || "상점",
        productName: product.name,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        isLiked: mockUtils.isProductLiked(1, product.id),
      }))
    );

    // 특가상품 데이터 (통합 목데이터 사용)
    const specialPrice = mockUtils.getSpecialPriceProducts();
    setSpecialPriceProducts(
      specialPrice.map((product) => ({
        id: product.id,
        storeName: mockUtils.getStoreById(product.storeId)?.name || "상점",
        productName: product.name,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        isLiked: mockUtils.isProductLiked(1, product.id),
      }))
    );
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const handleSearch = (searchTerm) => {
    // 검색 결과 상품 데이터
    const searchResults = [
      {
        id: 201,
        storeName: "검색결과 상점",
        productName: `${searchTerm} 관련 상품 1`,
        originalPrice: 8000,
        discountPrice: 6000,
        imageUrl: "",
        isLiked: false,
      },
      {
        id: 202,
        storeName: "검색결과 상점",
        productName: `${searchTerm} 관련 상품 2`,
        originalPrice: 5000,
        discountPrice: 4000,
        imageUrl: "",
        isLiked: true,
      },
      {
        id: 203,
        storeName: "검색결과 상점",
        productName: `${searchTerm} 관련 상품 3`,
        originalPrice: 12000,
        discountPrice: 9000,
        imageUrl: "",
        isLiked: false,
      },
    ];

    setLocationProducts(searchResults);
    setSelectedLocationInfo({
      name: "검색상품",
      type: "search",
      query: searchTerm,
    });
    setBottomSheetOpen(true);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    
    // 카테고리별 상품 데이터
    const categoryProducts = [
      {
        id: 301,
        storeName: `${category} 상점`,
        productName: `${category} 상품 1`,
        originalPrice: 10000,
        discountPrice: 7000,
        imageUrl: "",
        isLiked: false,
      },
      {
        id: 302,
        storeName: `${category} 상점`,
        productName: `${category} 상품 2`,
        originalPrice: 8000,
        discountPrice: 6000,
        imageUrl: "",
        isLiked: true,
      },
      {
        id: 303,
        storeName: `${category} 상점`,
        productName: `${category} 상품 3`,
        originalPrice: 15000,
        discountPrice: 12000,
        imageUrl: "",
        isLiked: false,
      },
    ];

    setLocationProducts(categoryProducts);
    setSelectedLocationInfo({ name: category, type: "category" });
    setBottomSheetOpen(true);
  };

  // 지도 클릭 시 바텀시트 열기
  const handleMapClick = (event) => {
    // 구글 맵 클릭 이벤트에서 좌표 추출
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    // 실제로는 지도 핀 클릭 시 호출됨
    setSelectedLocationInfo({
      name: "주변 상품",
      type: "nearby",
      query: `위치: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    });

    // 상품 데이터 설정
    setLocationProducts(getRandomProducts());
    setBottomSheetOpen(true);
  };

  // 마커 클릭 시 바텀시트 열기
  const handleMarkerClick = (markerData) => {
    setSelectedLocationInfo({
      name: markerData.name,
      type: "store",
      query: markerData.title,
    });

    // 상품 데이터 설정
    setLocationProducts(getRandomProducts());
    setBottomSheetOpen(true);
  };

  // 클러스터 클릭 시 해당 영역으로 줌인
  const handleClusterClick = (cluster) => {
    const map = cluster.map;
    const bounds = new window.google.maps.LatLngBounds();

    cluster.markers.forEach((marker) => {
      bounds.extend(marker.getPosition());
    });

    map.fitBounds(bounds);
  };

  // 랜덤 상품 데이터 생성 함수
  const getRandomProducts = () => {
    const productTemplates = [
      { name: "크로아상", price: 4000, originalPrice: 6000 },
      { name: "아메리카노", price: 3000, originalPrice: 4500 },
      { name: "신선 채소 세트", price: 6000, originalPrice: 8000 },
      { name: "도넛 6개 세트", price: 9000, originalPrice: 12000 },
      { name: "치킨 샌드위치", price: 3500, originalPrice: 5000 },
      { name: "딸기 스무디", price: 5000, originalPrice: 7000 },
      { name: "딸기 500g", price: 8000, originalPrice: 12000 },
      { name: "돼지고기 300g", price: 6000, originalPrice: 8000 },
      { name: "고등어 1마리", price: 3500, originalPrice: 5000 },
      { name: "후라이드 치킨", price: 15000, originalPrice: 18000 },
      { name: "페퍼로니 피자", price: 20000, originalPrice: 25000 },
    ];

    return productTemplates
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map((template, index) => ({
        id: 200 + index,
        storeName: "주변 상점",
        productName: template.name,
        originalPrice: template.originalPrice,
        discountPrice: template.price,
        imageUrl: "",
        isLiked: Math.random() > 0.5,
      }));
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

  return (
    <PageContainer>
      <Header userInfo={userInfo} onLogout={handleLogout} />

      <Content>
        <SearchBar onSearch={handleSearch} />
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
