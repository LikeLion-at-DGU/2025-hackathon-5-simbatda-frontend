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

    // 추천상품 데이터
    setRecommendedProducts([
      {
        id: 1,
        storeName: "신선마트",
        productName: "신선 사과 1kg",
        originalPrice: 8000,
        discountPrice: 6000,
        isLiked: false,
      },
      {
        id: 2,
        storeName: "편의점24",
        productName: "유기농 당근 500g",
        originalPrice: 4000,
        discountPrice: 3000,
        isLiked: true,
      },
      {
        id: 3,
        storeName: "농장직송",
        productName: "방울토마토 250g",
        originalPrice: 5000,
        discountPrice: 5000,
        isLiked: false,
      },
      {
        id: 4,
        storeName: "직송농장",
        productName: "신선 오이 1kg",
        originalPrice: 6000,
        discountPrice: 4500,
        isLiked: false,
      },
      {
        id: 5,
        storeName: "신선마트",
        productName: "바나나 1kg",
        originalPrice: 3000,
        discountPrice: 2000,
        isLiked: true,
      },
    ]);

    // 특가상품 데이터
    setSpecialPriceProducts([
      {
        id: 6,
        storeName: "신선마트",
        productName: "바나나 1kg",
        originalPrice: 3000,
        discountPrice: 2000,
        isLiked: false,
      },
      {
        id: 7,
        storeName: "직송농장",
        productName: "신선 오이 1kg",
        originalPrice: 6000,
        discountPrice: 4500,
        isLiked: false,
      },
      {
        id: 8,
        storeName: "농장직송",
        productName: "방울토마토 250g",
        originalPrice: 5000,
        discountPrice: 5000,
        isLiked: false,
      },
      {
        id: 9,
        storeName: "편의점24",
        productName: "유기농 당근 500g",
        originalPrice: 4000,
        discountPrice: 3000,
        isLiked: true,
      },
      {
        id: 10,
        storeName: "신선마트",
        productName: "신선 사과 1kg",
        originalPrice: 8000,
        discountPrice: 6000,
        isLiked: false,
      },
    ]);
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
        id: 301,
        storeName: `${category} 전문점`,
        productName: `${category} 상품 1`,
        originalPrice: 7000,
        discountPrice: 5500,
        imageUrl: "",
        isLiked: false
      },
      {
        id: 302,
        storeName: `${category} 전문점`,
        productName: `${category} 상품 2`,
        originalPrice: 9000,
        discountPrice: 7200,
        imageUrl: "",
        isLiked: true
      },
      {
        id: 303,
        storeName: `${category} 전문점`,
        productName: `${category} 상품 3`,
        originalPrice: 6000,
        discountPrice: 4500,
        imageUrl: "",
        isLiked: false
      },
      {
        id: 304,
        storeName: `${category} 전문점`,
        productName: `${category} 상품 4`,
        originalPrice: 11000,
        discountPrice: 8800,
        imageUrl: "",
        isLiked: false
      }
    ];
    
    setLocationProducts(categoryProducts);
    setSelectedLocationInfo({ name: "카테고리 상품", type: "category", query: category });
    setBottomSheetOpen(true);
  };

  // 지도 플레이스홀더 클릭 시 바텀시트 열기 
  const handleMapClick = () => {
    // 실제로는 지도 핀 클릭 시 호출됨
    setSelectedLocationInfo({
      name: "주변 상품",
      type: "nearby",
      query: "강남역 상점가"
    });
    
    // 상품 데이터
    setLocationProducts([
      {
        id: 101,
        storeName: "강남 베이커리",
        productName: "크로아상",
        originalPrice: 5000,
        discountPrice: 3500,
        imageUrl: "",
        isLiked: false
      },
      {
        id: 102,
        storeName: "강남 카페",
        productName: "아메리카노",
        originalPrice: 4500,
        discountPrice: 3000,
        imageUrl: "",
        isLiked: true
      },
      {
        id: 103,
        storeName: "강남 식자재점",
        productName: "신선 채소 세트",
        originalPrice: 8000,
        discountPrice: 6000,
        imageUrl: "",
        isLiked: false
      },
      {
        id: 104,
        storeName: "강남 편의점",
        productName: "삼각김밥",
        originalPrice: 3000,
        discountPrice: 2000,
        imageUrl: "",
        isLiked: false
      },
      {
        id: 105,
        storeName: "강남 마트",
        productName: "신선 우유 1L",
        originalPrice: 4000,
        discountPrice: 3200,
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
    ]);
    
    setBottomSheetOpen(true);
  };

  const handleBottomSheetClose = () => {
    setBottomSheetOpen(false);
    setSelectedLocationInfo(null);
    setLocationProducts([]);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
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
