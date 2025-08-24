import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";
import SearchBar from "../searchbar/SearchBar";
import CategoryChips from "../chips/CategoryChips";
import ProductCard from "../card/ProductCard";
import { toggleWishlist } from "../../../api/products";
import { getConsumerMe } from "../../../api/auth";
import empty from "../../../assets/images/crying-character.svg";
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

  useEffect(() => {
    if (!getProducts || typeof getProducts !== "function") {
      setProducts([]);
      setFilteredProducts([]);
      return;
    }

    let isMounted = true;
    const load = async () => {
      try {
        const result = await getProducts();
        if (!isMounted) return;
        const normalized = Array.isArray(result) ? result : [];
        setProducts(normalized);
        setFilteredProducts(normalized);
      } catch (_) {
        if (!isMounted) return;
        setProducts([]);
        setFilteredProducts([]);
      }
    };

    const maybe = getProducts();
    if (maybe && typeof maybe.then === "function") {
      load();
    } else {
      const normalized = Array.isArray(maybe) ? maybe : [];
      setProducts(normalized);
      setFilteredProducts(normalized);
    }

    return () => {
      isMounted = false;
    };
  }, [getProducts]);

  useEffect(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return;
    }

    let filtered = Array.isArray(products) ? products : [];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
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
    }

    if (selectedCategory !== "전체") {
      filtered = filtered.filter(
        (product) => product.categoryName === selectedCategory
      );
    }

    let sorted = [...filtered];
    switch (sortBy) {
      case "price-low":
        sorted.sort(
          (a, b) =>
            (a.discountPrice ?? Infinity) - (b.discountPrice ?? Infinity)
        );
        break;
      case "expiry-close":
        sorted.sort((a, b) => (a.expiryTime || 0) - (b.expiryTime || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(sorted);
  }, [searchTerm, selectedCategory, products, sortBy]);

  const handleProductClick = (productId) => {
    navigate(`/registeration/${productId}`);
  };

  const handleProductLikeToggle = async (productId, isLiked) => {
    try {
      await toggleWishlist(productId, isLiked);

      const updatedProducts = products.map((product) => {
        if (product.id === productId) {
          return { ...product, isLiked: !isLiked };
        }
        return product;
      });

      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error("ProductListPage 찜 토글 실패:", error);
    }
  };

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

  const getSortButtonText = (sortType) => {
    switch (sortType) {
      case "price-low":
        return "가격 낮은순";
      case "expiry-close":
        return "마감순";
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

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <PageContainer>
        <Header userInfo={userInfo} onLogout={handleLogout} title={title} />
        <EmptyState>
          <img src={empty} alt="empty" />
          {title === "추천 상품" ? (
            <>
              <EmptyText>주변 추천 상품이 없습니다.</EmptyText>
              <EmptyText>
                원하는 상품 찜을 하시면 재고를 추천해드려요!
              </EmptyText>
            </>
          ) : (
            <EmptyText>주변 특가 상품이 없습니다.</EmptyText>
          )}
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
                  마감순
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
                id={product.id}
                variant="list"
                storeName={product.storeName}
                storeId={product.storeId}
                productName={product.productName}
                categoryName={showCategory ? product.categoryName : undefined}
                originalPrice={product.originalPrice}
                discountPrice={product.discountPrice}
                discountRate={product.discountRate}
                imageUrl={product.imageUrl}
                isLiked={product.isLiked}
                expiryTime={showExpiry ? product.expiryTime : undefined}
                stock={product.stock}
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
