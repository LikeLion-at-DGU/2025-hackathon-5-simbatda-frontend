import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
`;

export const Content = styled.div`
  padding: 20px;
  padding-top: 100px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const StoreHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  gap: 10px;
`;

export const StoreInfo = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  margin-bottom: 10px;
  align-items: center;
`;

export const StoreName = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

export const StoreStatus = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #059669;
  padding: 8px 16px;
  background: #ecfdf5;
  border-radius: 8px;
  display: inline-block;
  width: fit-content;
`;

export const StoreDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

export const StoreDetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StoreDetailLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

export const StoreDetailValue = styled.span`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
`;

export const StoreProducts = styled.div`
  background: #f9fafb;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

export const StoreProductsTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: black;
  margin: 0 0 10px 10px;
`;

export const ProductGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

export const EmptyText = styled.p`
  color: #6b7280;
  font-size: 16px;
  margin: 0;
`;
