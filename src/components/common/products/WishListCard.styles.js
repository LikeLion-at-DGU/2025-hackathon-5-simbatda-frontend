import styled from "styled-components";

export const CardContainer = styled.div`
  position: relative;

  background: rgba(128, 128, 128, 0.1);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;



export const LikeButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 2;
  padding: 4px;

  &:hover {
    transform: scale(1.1);
  }
`;

export const LikeIcon = styled.img`
  width: 24px;
  height: 24px;
`;

export const CardContent = styled.div`
  margin-bottom: 12px;
`;

export const StoreName = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.2;
  margin-top: 13px;
`;

export const ProductName = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin: 0 0 4px 0;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CategoryTag = styled.span`
  display: inline-block;
  background: #ddcfc5;
  color: #5d5752;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 12px;

  &::before {
    content: "상품 이미지";
  }
`;

export const TimeRemaining = styled.div`
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 12px;
  text-align: center;
  font-weight: 500;
`;

export const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: right;
`;

export const DiscountRate = styled.span`
  color: #37ca79;
  font-size: 20px;
  font-weight: 700;
`;

export const Price = styled.span`
  color: #000;
  font-size: 20px;
  font-weight: 700;
`;
