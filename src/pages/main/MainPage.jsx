import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/header/Header";
import SearchBar from "../../components/common/searchbar/SearchBar";
import CategoryChips from "../../components/common/chips/CategoryChips";
import MapPlaceholder from "../../components/common/map/MapPlaceholder";
import RecommendedProducts from "../../components/common/products/RecommendedProducts";
import SpecialPriceProducts from "../../components/common/products/SpecialPriceProducts";
import BottomSheet from "../../components/common/bottomsheet/BottomSheet";
import { apiRequest } from "../../api/client";
import { unifiedMockData, mockUtils } from "../../mocks/UnifiedMockData";
import { PageContainer, Content } from "./MainPage.styles";


function MainPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [specialPriceProducts, setSpecialPriceProducts] = useState([]);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedLocationInfo, setSelectedLocationInfo] = useState(null);
  const [locationProducts, setLocationProducts] = useState([]);
  const navigate = useNavigate();
  


  useEffect(() => {
    // TODO: API 연결 X - mock 데이터 사용
    setUserInfo({ name: "테스트 사용자" });

    // 추천상품 데이터 (통합 목데이터 사용)
    const recommended = mockUtils.getRecommendedProducts();
    setRecommendedProducts(recommended.map(product => ({
      id: product.id,
      storeName: mockUtils.getStoreById(product.storeId)?.name || "상점",
      productName: product.name,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice,
      isLiked: mockUtils.isProductLiked(1, product.id),
    })));

    // 특가상품 데이터 (통합 목데이터 사용)
    const specialPrice = mockUtils.getSpecialPriceProducts();
    setSpecialPriceProducts(specialPrice.map(product => ({
      id: product.id,
      storeName: mockUtils.getStoreById(product.storeId)?.name || "상점",
      productName: product.name,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice,
      isLiked: mockUtils.isProductLiked(1, product.id),
    })));

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
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
        isLiked: false
      },
      {
        id: 202,
        storeName: "검색결과 상점",
        productName: `${searchTerm} 관련 상품 2`,
        originalPrice: 5000,
        discountPrice: 4000,
        imageUrl: "",
        isLiked: true
      },
      {
        id: 203,
        storeName: "검색결과 상점",
        productName: `${searchTerm} 관련 상품 3`,
        originalPrice: 12000,
        discountPrice: 9000,
        imageUrl: "",
        isLiked: false
      }
    ];
    
    setLocationProducts(searchResults);
    setSelectedLocationInfo({ name: "검색상품", type: "search", query: searchTerm });
    setBottomSheetOpen(true);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    
    // 카테고리별 상품 데이터 
    const categoryProducts = [
      {
        id: 101,
        storeName: "강남 베이커리",
        productName: "크로아상 2개",
        originalPrice: 6000,
        discountPrice: 4000,
        imageUrl: "",
        isLiked: true
      },
      {
        id: 102,
        storeName: "강남 커피숍",
        productName: "아메리카노 2잔",
        originalPrice: 8000,
        discountPrice: 6000,
        imageUrl: "",
        isLiked: false
      },
      {
        id: 103,
        storeName: "강남 도넛가게",
        productName: "도넛 6개 세트",
        originalPrice: 12000,
        discountPrice: 9000,
        imageUrl: "",
        isLiked: true
      },
      {
        id: 104,
        storeName: "강남 샌드위치",
        productName: "치킨 샌드위치",
        originalPrice: 5000,
        discountPrice: 3500,
        imageUrl: "",
        isLiked: false
      },
      {
        id: 105,
        storeName: "강남 스무디",
        productName: "딸기 스무디",
        originalPrice: 7000,
        discountPrice: 5000,
        imageUrl: "",
        isLiked: true
      },
      {
        id: 106,
        storeName: "강남 과일가게",
        productName: "딸기 500g",
        originalPrice: 12000,
        discountPrice: 8000,
        imageUrl: "",
        isLiked: false
      },
      {
        id: 107,
        storeName: "강남 정육점",
        productName: "돼지고기 300g",
        originalPrice: 8000,
        discountPrice: 6000,
        imageUrl: "",
        isLiked: false
      },
      {
        id: 108,
        storeName: "강남 생선가게",
        productName: "고등어 1마리",
        originalPrice: 5000,
        discountPrice: 3500,
        imageUrl: "",
        isLiked: true
      },
      {
        id: 109,
        storeName: "강남 치킨집",
        productName: "후라이드 치킨",
        originalPrice: 18000,
        discountPrice: 15000,
        imageUrl: "",
        isLiked: false
      },
      {
        id: 110,
        storeName: "강남 피자집",
        productName: "페퍼로니 피자",
        originalPrice: 25000,
        discountPrice: 20000,
        imageUrl: "",
        isLiked: false
      }
    ];
    
    setLocationProducts(categoryProducts);
    setSelectedLocationInfo({ name: category, type: "category" });
    setBottomSheetOpen(true);
  };

  const handleMapClick = () => {
    // 지도 클릭 시 주변 상품 데이터
    const nearbyProducts = [
      {
        id: 301,
        storeName: "주변 상점 1",
        productName: "주변 상품 1",
        originalPrice: 10000,
        discountPrice: 8000,
        imageUrl: "",
        isLiked: false
      },
      {
        id: 302,
        storeName: "주변 상점 2",
        productName: "주변 상품 2",
        originalPrice: 8000,
        discountPrice: 6000,
        imageUrl: "",
        isLiked: true
      },
      {
        id: 303,
        storeName: "주변 상점 3",
        productName: "주변 상품 3",
        originalPrice: 15000,
        discountPrice: 12000,
        imageUrl: "",
        isLiked: false
      }
    ];
    
    setLocationProducts(nearbyProducts);
    setSelectedLocationInfo({ name: "주변 상품", type: "map" });
    setBottomSheetOpen(true);
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
        <MapPlaceholder onClick={handleMapClick} />
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
