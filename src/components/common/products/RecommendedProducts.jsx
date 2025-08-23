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
} from "./RecommendedProducts.styles";

const RecommendedProducts = ({
  products = [],
  name = "사용자",
  onProductLikeToggle,
}) => {
  const navigate = useNavigate();

  if (!products || products.length === 0) {
    return null;
  }

  const handleMoreClick = () => {
    navigate("/recommended");
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
          <Title>나만의 추천상품</Title>
          <MoreButton onClick={handleMoreClick}>더보기 {">"}</MoreButton>
        </Header>
        <Description>{name}님이 좋아할 만한 상품을 매일 추천해줘요!</Description>
      </div>

      <ProductsContainer>
        <ProductsWrapper>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              variant="default"
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

export default RecommendedProducts;
