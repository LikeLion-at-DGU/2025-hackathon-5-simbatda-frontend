import styled from "styled-components";

const CardContainer = styled.div`
  display: flex;
  padding: 10px 15px;
  border-radius: 10px;
  background-color: #f5f5f5cc;
  gap: 13px;
  position: relative;
  width: 253px;
`;

const CardImage = styled.img`
  width: 60px;
  height: 60px;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
`;

const StoreName = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #775c4a;
  margin: 0;
`;

const ProductName = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: #775c4a;
  margin: 0;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  p {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
  }
`;

const DiscountRate = styled.p`
  color: #37ca79;
  margin: 0;
`;

const LikeButton = styled.button`
  position: absolute;
  top: 12.5px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const LikeIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const ProductCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
  padding: 0;
  margin: 0;
  width: 130px;
  height: 185px;
`;

const ProductCardImage = styled.img`
  width: 130px;
  height: 130px;
`;

const ProductCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px;
`;

const ProductCardPrice = styled.p`
  font-size: 14px;
  margin: 0;
  font-weight: 600;
`;

const ProductCardDiscountRate = styled.p`
  font-size: 14px;
  margin: 0;
  font-weight: 600;
  color: #37ca79;
`;

const ProductCardPriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
`;

export {
  CardContainer,
  CardImage,
  CardContent,
  StoreName,
  ProductName,
  PriceSection,
  DiscountRate,
  LikeButton,
  LikeIcon,
  ProductCardContainer,
  ProductCardImage,
  ProductCardContent,
  ProductCardPrice,
  ProductCardDiscountRate,
  ProductCardPriceSection,
};
