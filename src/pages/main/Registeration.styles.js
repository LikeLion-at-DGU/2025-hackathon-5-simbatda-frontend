import styled from "styled-components";

const Container = styled.div`
  padding: 0;
  margin: 0 auto;
  background-color: #ffffff;
  min-height: 100vh;
  max-width: 100vw;
  overflow-x: hidden;
`;

const ProductImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ProductImageSection = styled.div`
  text-align: center;
  margin: 20px;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  border-radius: 15px;
`;

const ProductImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  object-fit: cover;
  display: block;
  aspect-ratio: 1 / 1;
`;

const StoreName = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #775c4a;
  margin: 0 0 8px 20px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #37ca79;
    text-decoration: underline;
  }
`;

const ProductName = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 20px;
  line-height: 1.3;
`;

const ProductDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 20px 20px;
  line-height: 1.5;
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 0 20px 20px 20px;
`;

const OriginalPrice = styled.span`
  font-size: 14px;
  color: #9ca3af;
  text-decoration: line-through;
`;

const DiscountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DiscountRate = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #37ca79;
`;

const DiscountPrice = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
`;

const RemainingTimeSection = styled.div`
  background-color: #fef3c7;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 0 20px 30px 20px;
  text-align: center;
`;

const RemainingTimeTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #92400e;
`;

const LikeButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    transform: scale(1.1);
  }

  img {
    width: 25px;
    height: 25px;
  }
`;

const RecommendedSection = styled.div`
  margin: 0 20px 100px 20px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  margin: 0 0 16px 0;
`;

const ProductsContainer = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 0 0 15px 0;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ReservationButton = styled.button`
  background-color: #775c4a;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  max-width: 460px;
  margin: 0 auto;
  z-index: 1000;

  &:hover {
    background-color: #37ca79;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ReservationBottomSheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 80vh;
  overflow: hidden;
`;

const BottomSheetOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
`;

const BottomSheetHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
`;

const BottomSheetTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #775c4a;
  margin: 0;
  text-align: center;
`;

const BottomSheetContent = styled.div`
  padding: 20px;
  color: #6b7280;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(80vh - 80px);

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
`;

const CloseButton = styled.button`
  position: absolute;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

// 바텀시트 내부 스타일
const ProductInfoSection = styled.div`
  display: flex;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
  margin: 0;
`;

const ProductDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProductNameSmall = styled.h4`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const StoreNameSmall = styled.p`
  font-size: 16px;
  color: #775c4a;
  margin: 0;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #37ca79;
    text-decoration: underline;
  }
`;

const ProductNameSmallContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const ExpiryInfo = styled.p`
  font-size: 14px;
  color: #be4a31;
  margin: 0;
`;

const QuantitySelector = styled.div`
  display: flex;
  justify-content: space-between;

  gap: 8px;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background: #ddcfc5;
  border-radius: 6px;
  cursor: pointer;
  font-size: 25px;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #775c4a;
    color: #ddcfc5;
    border-color: #9ca3af;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  min-width: 40px;
  text-align: center;
`;

const StockInfo = styled.span`
  font-size: 12px;
  color: #9ca3af;
`;

const AddressSection = styled.div`
  padding-bottom: 20px;
  padding-top: 20px;
  border-bottom: 1px solid #e5e7eb;
`;

const AddressTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
`;

const AddressText = styled.p`
  font-size: 16px;
  margin: 15px 0 0 0;
  text-align: right;
  color: black;
  font-weight: 400;
`;

const AddressCopyButton = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  color: #775c4a;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

const PriceReservationSection = styled.div`
  padding-bottom: 20px;
  padding-top: 20px;
  border-bottom: 1px solid #e5e7eb;
`;

const PriceDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const OriginalPriceDisplay = styled.div`
  font-size: 16px;
  color: #9ca3af;
  text-decoration: line-through;
  text-align: end;
`;

const DiscountInfoDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

const DiscountRateDisplay = styled.div`
  font-size: 14px;
  color: #37ca79;
  font-weight: 600;
`;

const DiscountPriceDisplay = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
`;

const TotalPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const TotalPriceValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #775c4a;
`;

const ReservationNotice = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  background: #fef3c7;
  border-radius: 8px;
  margin-top: 20px;
`;

const NoticeText = styled.p`
  font-size: 14px;
  color: #775c4a;
  font-weight: 500;
  margin: 0;
  line-height: 1.5;
`;

const ConfirmationSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  padding-top: 20px;
  border-bottom: 1px solid #e5e7eb;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: #775c4a;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  cursor: pointer;
`;

const ReserveButton = styled.button`
  width: 100%;
  background-color: ${(props) => (props.disabled ? "#d1d5db" : "#775c4a")};
  color: white;
  border: none;
  padding: 16px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  margin-top: 20px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #37ca79;
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const AddressContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

// 확인 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
`;

const ConfirmModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  z-index: 2001;
  width: 90%;
  max-width: 400px;
  overflow: hidden;
`;

const ModalContent = styled.div`
  padding: 24px 24px 0px 24px;
  text-align: center;
`;

const ModalText = styled.p`
  font-size: 16px;
  color: #374151;
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const ModalPriceInfo = styled.div`
  font-size: 18px;
  color: #775c4a;
  font-weight: 600;
  margin: 0;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  padding: 10px 24px 24px 24px;
`;

const CancelButton = styled.button`
  flex: 1;
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
  }
`;

const ConfirmButton = styled.button`
  flex: 1;
  background: #775c4a;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #37ca79;
  }
`;

const ModalNotice = styled.p`
  font-size: 14px;
  color: #be4a31;
  font-weight: 400;
  margin: 20px 0 0 0;
  line-height: 1.5;
`;

const NoRecommendationText = styled.p`
  font-size: 14px;
  color: #775c4a;
  font-weight: 500;
  opacity: 0.5;
  margin: 0;
  margin-left: 20px;
  line-height: 1.5;
`;

const NoRecommendationImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  opacity: 0.5;
`;

const NoRecommendationImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NoRecommendationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 100px;
`;

export {
  Container,
  ProductImageSection,
  ProductImage,
  StoreName,
  ProductName,
  ProductDescription,
  RemainingTimeSection,
  RemainingTimeTitle,
  RecommendedSection,
  SectionTitle,
  ProductsContainer,
  NoRecommendationContainer,
  ReservationButton,
  ReservationBottomSheet,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetContent,
  LikeButton,
  CloseButton,
  BottomSheetOverlay,
  ProductImageContainer,
  ProductInfoSection,
  ProductDetails,
  ProductNameSmall,
  ExpiryInfo,
  QuantitySelector,
  QuantityControls,
  QuantityButton,
  QuantityValue,
  StockInfo,
  AddressSection,
  AddressTitle,
  AddressText,
  AddressCopyButton,
  PriceReservationSection,
  PriceDisplay,
  OriginalPriceDisplay,
  DiscountInfoDisplay,
  DiscountRateDisplay,
  DiscountPriceDisplay,
  TotalPriceRow,
  TotalPriceValue,
  ReservationNotice,
  StoreNameSmall,
  NoticeText,
  ConfirmationSection,
  Checkbox,
  CheckboxLabel,
  ReserveButton,
  ProductNameSmallContainer,
  AddressContainer,
  PriceSection,
  OriginalPrice,
  DiscountInfo,
  DiscountRate,
  DiscountPrice,
  // 모달 컴포넌트들
  ModalOverlay,
  ConfirmModal,
  ModalContent,
  ModalText,
  ModalPriceInfo,
  ModalActions,
  CancelButton,
  ConfirmButton,
  ModalNotice,
  NoRecommendationText,
  NoRecommendationImage,
  NoRecommendationImageContainer,
};
