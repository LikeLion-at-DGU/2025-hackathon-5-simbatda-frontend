import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
`;

export const Content = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

export const PickupStatus = styled.div`
  background: linear-gradient(135deg, #37ca79 0%, #2dd4bf 100%);
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  text-align: center;
`;

export const PickupStatusText = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0;
`;

export const OrderNumber = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const OrderNumberLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
`;

export const OrderNumberValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #37ca79;
  padding: 8px 16px;
  background: #ecfdf5;
  border-radius: 8px;
`;

export const OrderInfoSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

export const OrderInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

export const OrderInfoLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
`;

export const OrderInfoValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
`;

export const ProductSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
`;

export const ProductItem = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

export const ProductInfo = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
  align-items: center;
  margin-bottom: 8px;
`;

export const ProductName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
`;

export const ProductQuantity = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
`;

export const ProductPrice = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  text-align: right;
`;

export const ProductExpiry = styled.div`
  font-size: 14px;
  color: #be4a31;
  font-weight: 500;
`;

export const StoreSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

export const StoreInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
`;

export const StoreInfoLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  flex-shrink: 0;
  width: 80px;
`;

export const StoreInfoValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  flex: 1;
  margin-right: 16px;
`;

export const CopyButton = styled.button`
  background: none;
  border: 1px solid #37ca79;
  color: #37ca79;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #37ca79;
    color: white;
  }
`;

export const CopyButtonText = styled.span`
  font-size: 12px;
  font-weight: 600;
`;

// 기존 스타일들도 유지 (하위 호환성을 위해)
export const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  margin-right: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }

  img {
    width: 20px;
    height: 20px;
    transform: rotate(180deg);
  }
`;

export const Section = styled.div`
  background: white;
  margin: 20px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
`;

export const MetaList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const MetaLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
`;

export const MetaValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  text-align: right;
`;

export const SectionHeader = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
`;

export const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

export const ProductNote = styled.div`
  grid-column: 1 / -1;
  font-size: 14px;
  color: #be4a31;
  font-weight: 500;
  margin-top: 8px;
`;
