import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";
import SearchBar from "../searchbar/SearchBar";
import CategoryChips from "../chips/CategoryChips";
import ProductCard from "../card/ProductCard";
import {
  PageContainer,
  Content,
  SortSection,
  SortDropdown,
  SortButton,
  DropdownContent,
  DropdownItem,
  ProductGrid,
  EmptyState,
  EmptyText,
  DescriptionText,
} from "./ProductListPage.styles";

const ProductListPage = ({
  title,
  getProducts,
  showExpiry = true,
  showCategory = true,
  description,
}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 초기 데이터 로딩
  useEffect(() => {
    setUserInfo({ name: "테스트 사용자" });

    // 상품 데이터 가져오기
    if (getProducts && typeof getProducts === "function") {
      const productData = getProducts();
      setProducts(productData);
      setFilteredProducts(productData);
    }
  }, [getProducts]); // getProducts만 의존성으로 설정

  // 검색어나 카테고리가 변경될 때만 필터링 재실행
  useEffect(() => {
    // products가 비어있으면 필터링하지 않음
    if (!products || products.length === 0) {
      return;
    }

    let filtered = products;

    // 검색어 필터링
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.productName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 카테고리 필터링
    if (selectedCategory !== "전체") {
      filtered = filtered.filter(
        (product) => product.categoryName === selectedCategory
      );
    }

    // 정렬 적용
    let sorted = [...filtered]; 
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case "expiry-close":
        sorted.sort((a, b) => a.expiryTime - b.expiryTime);
        break;
      default:
        break;
    }

    setFilteredProducts(sorted);
  }, [searchTerm, selectedCategory, products, sortBy]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/signin");
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleProductClick = (productId) => {
    navigate(`/registeration/${productId}`);
  };

  const handleProductLikeToggle = (productId, isLiked) => {
    // TODO: 좋아요 API 연동
  };

  const getSortButtonText = (sortType) => {
    switch (sortType) {
      case "price-low":
        return "가격 낮은순";
      case "expiry-close":
        return "유통기한 임박순";
      default:
        return "최신순";
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (products.length === 0) {
    return (
      <PageContainer>
        <Header userInfo={userInfo} onLogout={handleLogout} title={title} />
        <EmptyState>
          <EmptyText>상품이 없습니다.</EmptyText>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header userInfo={userInfo} onLogout={handleLogout} title={title} />

      <Content>
        <SearchBar onSearch={handleSearch} onChange={handleSearch} />

        <CategoryChips
          onCategoryChange={handleCategoryChange}
          initialCategory={selectedCategory}
        />

        <SortSection>
          {description && <DescriptionText>{description}</DescriptionText>}
          <SortDropdown ref={dropdownRef}>
            <SortButton onClick={toggleDropdown}>
              {getSortButtonText(sortBy)}
              <span>▼</span>
            </SortButton>
            {isDropdownOpen && (
              <DropdownContent>
                <DropdownItem onClick={() => handleSortChange("default")}>
                  최신순
                </DropdownItem>
                <DropdownItem onClick={() => handleSortChange("price-low")}>
                  가격 낮은순
                </DropdownItem>
                <DropdownItem onClick={() => handleSortChange("expiry-close")}>
                  유통기한 임박순
                </DropdownItem>
              </DropdownContent>
            )}
          </SortDropdown>
        </SortSection>

        {filteredProducts.length > 0 ? (
          <ProductGrid>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                variant="list"
                storeName={product.storeName}
                productName={product.productName}
                categoryName={showCategory ? product.categoryName : undefined}
                originalPrice={product.originalPrice}
                discountPrice={product.discountPrice}
                imageUrl={product.imageUrl}
                isLiked={product.isLiked}
                expiryTime={showExpiry ? product.expiryTime : undefined}
                onClick={() => handleProductClick(product.id)}
                onLikeToggle={() =>
                  handleProductLikeToggle(product.id, product.isLiked)
                }
              />
            ))}
          </ProductGrid>
        ) : (
          <EmptyState>
            <EmptyText>
              {searchTerm.trim()
                ? `"${searchTerm}"에 대한 검색 결과가 없습니다.`
                : "상품이 없습니다."}
            </EmptyText>
          </EmptyState>
        )}
      </Content>
    </PageContainer>
  );
};

export default ProductListPage;
