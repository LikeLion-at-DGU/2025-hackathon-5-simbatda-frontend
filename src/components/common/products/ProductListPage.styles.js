import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

export const Content = styled.div`
  padding: 20px;
  padding-top: 100px; 
  max-width: 1200px;
  margin: 0 auto;
`;

export const SortSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

`;

export const SortDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

export const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 125px;
  justify-content: space-between;

  &:hover {
    border-color: #37ca79;
    color: #37ca79;
  }

  &:focus {
    outline: none;
    border-color: #37ca79;
    box-shadow: 0 0 0 3px rgba(55, 202, 121, 0.1);
  }
`;

export const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 4px;
  overflow: hidden;
`;

export const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: white;
  color: #374151;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

export const ProductGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  margin-top: 200px;
`;

export const EmptyText = styled.p`
  color: #6b7280;
  font-size: 16px;
  margin: 0;
  margin-top: 10px;
`;

export const DescriptionText = styled.p`
  margin: 0 0 0 10px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
`;
