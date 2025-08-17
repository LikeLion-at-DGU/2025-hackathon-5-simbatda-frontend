import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../card/ProductCard";
import {
  Container,
  Header,
  Title,
  MoreButton,
  ProductsContainer,
  ProductsWrapper,
  Description,
} from "./SpecialPriceProducts.styles";

const SpecialPriceProducts = ({ products = [] }) => {
  const navigate = useNavigate();

  if (!products || products.length === 0) {
    return null;
  }

  const handleMoreClick = () => {
    navigate("/special-price-products");
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleLikeToggle = (productId, isLiked) => {
    console.log(`상품 ${productId} 좋아요 ${isLiked ? "추가" : "제거"}`);
    // TODO: 좋아요 API 연동 (콘솔 제거 예정)
  };

  return (
    <Container>
      <div>
        <Header>
          <Title>특가상품</Title>
          <MoreButton onClick={handleMoreClick}>더보기 {'>'}</MoreButton>
        </Header>
        <Description>오늘의 특가 상품이에요!</Description>
      </div>

      <ProductsContainer>
        <ProductsWrapper>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              variant="compact"
              storeName={product.storeName}
              productName={product.productName}
              originalPrice={product.originalPrice}
              discountPrice={product.discountPrice}
              imageUrl={product.imageUrl}
              isLiked={product.isLiked}
              onLikeToggle={(isLiked) => handleLikeToggle(product.id, isLiked)}
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </ProductsWrapper>
      </ProductsContainer>
    </Container>
  );
};

export default SpecialPriceProducts;
