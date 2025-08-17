import styled from "styled-components";

export const BottomSheetOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease;
`;

export const BottomSheetContainer = styled.div`
  position: fixed;
  bottom: ${({ $isOpen, $currentY }) => {
    if (!$isOpen) return "-100%";
    return $currentY > 0 ? `-${$currentY}px` : "0";
  }};
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  z-index: 2001;
  transition: ${({ $isDragging }) =>
    $isDragging ? "none" : "bottom 0.3s ease"};
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  cursor: grab;
  touch-action: pan-y;

  &:active {
    cursor: grabbing;
  }
`;

export const BottomSheetHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 20px 16px 20px;
  background: #ffffff;
`;

export const HeaderTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #775c4a;
  margin: 0;
`;

export const BottomSheetContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  max-height: calc(80vh - 80px);
`;

export const LocationTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
`;

export const LocationAddress = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

export const ProductsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* 바텀시트 전용 상품 카드 크기 조정 */
  & > div {
    width: 100% !important;
    max-width: none !important;
  }
`;

export const NoProductsMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
`;

export const NoProductsIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

export const NoProductsText = styled.p`
  font-size: 16px;
  margin: 0;
`;
