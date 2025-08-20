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

// List variant용 스타일
const ListCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  gap: 15px;
  position: relative;
  width: 100%;
  border: 1px solid #f0f0f0;
`;

const ListCardContainer2 = styled.div`
  display: flex;
  gap: 15px;
  border-radius: 12px;
`;

const ListCardImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
`;

const ListCardContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`;

const ListCardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ListCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const ListCardPriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
`;

const ListCardDiscountPrice = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: black;
  margin: 0;
`;

const ListCardOriginalPrice = styled.p`
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin: 0;
`;

const ListCardDiscountRate = styled.span`
  font-size: 12px;
  color: #37ca79;
  font-weight: 600;
`;

const ListCardCategory = styled.span`
  font-size: 12px;
  color: #8a8a8a;
`;

const ListCardStock = styled.span`
  font-size: 12px;
  color: #8a8a8a;
  font-weight: 500;
  margin-top: 10px;
`;

const ListCardExpiry = styled.div`
  font-size: 11px;
  color: #ff6b6b;
  font-weight: 600;
`;

const ProductName2 = styled.p`
  font-size: 16px;
  color: black;
  font-weight: 700;
  margin: 0;
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
  ListCardContainer,
  ListCardImage,
  ListCardContent,
  ListCardHeader,
  ListCardFooter,
  ListCardPriceSection,
  ListCardDiscountPrice,
  ListCardOriginalPrice,
  ListCardDiscountRate,
  ListCardCategory,
  ListCardStock,
  ListCardExpiry,
  ListCardContainer2,
  ProductName2,
};
