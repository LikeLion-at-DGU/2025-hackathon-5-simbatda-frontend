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

const SpecialPriceProducts = ({ products = [], onProductLikeToggle }) => {
  const navigate = useNavigate();

  if (!products || products.length === 0) {
    return null;
  }

  const handleMoreClick = () => {
    navigate("/special-price");
  };

  const handleProductClick = (productId) => {
    navigate(`/registeration/${productId}`);
  };

  const handleLikeToggle = (productId, isLiked) => {
    if (onProductLikeToggle) {
      onProductLikeToggle(productId, isLiked);
    }
  };

  return (
    <Container>
      <div>
        <Header>
          <Title>특가상품</Title>
          <MoreButton onClick={handleMoreClick}>더보기 {">"}</MoreButton>
        </Header>
        <Description>오늘의 특가 상품이에요!</Description>
      </div>

      <ProductsContainer>
        <ProductsWrapper>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              variant="compact"
              storeName={product.storeName}
              productName={product.productName}
              originalPrice={product.originalPrice}
              discountPrice={product.discountPrice}
              discountRate={product.discountRate}
              imageUrl={product.imageUrl}
              isLiked={product.isLiked}
              onLikeToggle={handleLikeToggle}
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </ProductsWrapper>
      </ProductsContainer>
    </Container>
  );
};

export default SpecialPriceProducts;
