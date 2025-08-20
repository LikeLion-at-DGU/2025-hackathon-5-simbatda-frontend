import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { unifiedMockData, mockUtils } from "../../mocks/UnifiedMockData";
import ProductCard from "../../components/common/card/ProductCard";
import BackHeader from "../../components/common/header/BackHeader";
import like from "../../assets/icons/like/like.svg";
import unlike from "../../assets/icons/like/unlike.svg";
import {
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
} from "./Registeration.styles";

const Registeration = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);

  const [reservationBottomSheetOpen, setReservationBottomSheetOpen] =
    useState(false);
  const [userInfo, setUserInfo] = useState({ name: "테스트 사용자" });
  const [isLiked, setIsLiked] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (productId) {
      const productData = mockUtils.getProductById(parseInt(productId));
      if (productData) {
        setProduct(productData);
        const storeData = mockUtils.getStoreById(productData.storeId);
        setStore(storeData);

        // 좋아요 상태 초기화
        setIsLiked(mockUtils.isProductLiked(1, productData.id));
      }
    }
  }, [productId]);

  // 바텀시트 열기/닫기 시 body 스크롤 제어
  useEffect(() => {
    if (reservationBottomSheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [reservationBottomSheetOpen]);

  const handleReservationClick = () => {
    setReservationBottomSheetOpen(true);
  };

  const handleBottomSheetClose = () => {
    setReservationBottomSheetOpen(false);
    document.body.style.overflow = "unset";
  };

  const handleReserve = () => {
    if (confirmChecked) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmReservation = () => {
    // TODO: 예약 API 연동
    console.log("상품 예약 완료:", {
      productId: product.id,
      quantity: selectedQuantity,
      totalPrice: product.discountPrice * selectedQuantity,
    });
    setShowConfirmModal(false);
    setReservationBottomSheetOpen(false);
    document.body.style.overflow = "unset";
    // 예약 완료 후 처리 (예: 성공 메시지, 페이지 이동 등)
  };

  const handleCancelReservation = () => {
    setShowConfirmModal(false);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setSelectedQuantity(newQuantity);
    }
  };

  const handleLikeToggle = (productId) => {
    // TODO: 좋아요 API 연동
    setIsLiked(!isLiked);
    console.log(`상품 ${productId} 좋아요 ${!isLiked ? "추가" : "제거"}`);
  };

  const handleStoreClick = () => {
    navigate(`/store/${store.id}`);
  };

  if (!product || !store) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <Container>
      {/* 뒤로가기 헤더 */}
      <BackHeader title="상품 상세" />

      {/* 상품 이미지 */}
      <ProductImageContainer>
        <ProductImageSection>
          <ProductImage
            src="/src/assets/images/defaultImage.svg"
            alt={product.name}
          />
          <LikeButton onClick={() => handleLikeToggle(product.id)}>
            <img src={isLiked ? like : unlike} alt="좋아요" />
          </LikeButton>
        </ProductImageSection>
      </ProductImageContainer>

      {/* 상점명 */}
      <StoreName onClick={handleStoreClick}>{store.name} {" >"}</StoreName>

      {/* 상품명 */}
      <ProductName>{product.name}</ProductName>

      {/* 상품 설명 */}
      <ProductDescription>{product.description}</ProductDescription>

      {/* 가격 정보 */}
      <PriceSection>
        <OriginalPrice>
          {product.originalPrice.toLocaleString()}원
        </OriginalPrice>
        <DiscountInfo>
          <DiscountRate>{product.discountRate}%</DiscountRate>
          <DiscountPrice>
            {product.discountPrice.toLocaleString()}원
          </DiscountPrice>
        </DiscountInfo>
      </PriceSection>

      {/* 남은 시간 */}
      <RemainingTimeSection>
        <RemainingTimeTitle>
          D-{product.remainingTime.days},{" "}
          {String(product.remainingTime.hours).padStart(2, "0")}:
          {String(product.remainingTime.minutes).padStart(2, "0")}:
          {String(product.remainingTime.seconds).padStart(2, "0")} 남음
        </RemainingTimeTitle>
      </RemainingTimeSection>

      {/* 개인 맞춤 추천상품 */}
      <RecommendedSection>
        <SectionTitle>
          {userInfo?.name || "사용자"}님 취향과 비슷한 상품이에요!
        </SectionTitle>
        <ProductsContainer>
          {mockUtils
            .getRecommendedProducts()
            .filter((p) => p.id !== product.id)
            .slice(0, 5)
            .map((recommendedProduct) => (
              <ProductCard
                key={recommendedProduct.id}
                variant="compact"
                storeName={
                  mockUtils.getStoreById(recommendedProduct.storeId)?.name ||
                  "상점"
                }
                productName={recommendedProduct.name}
                originalPrice={recommendedProduct.originalPrice}
                discountPrice={recommendedProduct.discountPrice}
                imageUrl={recommendedProduct.imageUrl}
                isLiked={mockUtils.isProductLiked(1, recommendedProduct.id)}
                onLikeToggle={() => {}}
                onClick={() =>
                  navigate(`/registeration/${recommendedProduct.id}`)
                }
              />
            ))}
        </ProductsContainer>
      </RecommendedSection>

      {/* 예약하기 버튼 */}
      <ReservationButton onClick={handleReservationClick}>
        예약하기
      </ReservationButton>

      {/* 예약 바텀시트 */}
      {reservationBottomSheetOpen && (
        <>
          <BottomSheetOverlay
            onClick={() => {
              handleBottomSheetClose();
              document.body.style.overflow = "unset";
            }}
          />
          <ReservationBottomSheet>
            <BottomSheetHeader>
              <BottomSheetTitle>상품 예약</BottomSheetTitle>
              <CloseButton onClick={handleBottomSheetClose}>×</CloseButton>
            </BottomSheetHeader>
            <BottomSheetContent>
              {/* 상품 정보 */}
              <ProductInfoSection>
                <ProductDetails>
                  <StoreNameSmall onClick={handleStoreClick}>
                    {store.name}
                  </StoreNameSmall>

                  <QuantitySelector>
                    <ProductNameSmall>{product.name}</ProductNameSmall>
                    <ProductNameSmallContainer>
                      <QuantityControls>
                        <QuantityButton
                          onClick={() =>
                            handleQuantityChange(selectedQuantity - 1)
                          }
                          disabled={selectedQuantity <= 1}
                        >
                          -
                        </QuantityButton>
                        <QuantityValue>{selectedQuantity}</QuantityValue>
                        <QuantityButton
                          onClick={() =>
                            handleQuantityChange(selectedQuantity + 1)
                          }
                          disabled={selectedQuantity >= product.stock}
                        >
                          +
                        </QuantityButton>
                      </QuantityControls>

                      <StockInfo>재고: {product.stock}개</StockInfo>
                    </ProductNameSmallContainer>
                  </QuantitySelector>
                  <ExpiryInfo>유통기한: {product.expiryDate}</ExpiryInfo>
                </ProductDetails>
              </ProductInfoSection>

              {/* 매장 주소 */}
              <AddressSection>
                {" "}
                <AddressContainer>
                  <AddressTitle>매장 주소</AddressTitle>
                  <AddressCopyButton>주소 복사</AddressCopyButton>
                </AddressContainer>
                <AddressText>{store.address}</AddressText>
              </AddressSection>

              {/* 주문 금액 */}
              <PriceReservationSection>
                <AddressTitle>주문 금액</AddressTitle>
                <PriceDisplay>
                  <OriginalPriceDisplay>
                    {product.originalPrice.toLocaleString()}원
                  </OriginalPriceDisplay>
                  <DiscountInfoDisplay>
                    <DiscountRateDisplay>
                      {product.discountRate}% 할인
                    </DiscountRateDisplay>
                    <DiscountPriceDisplay>
                      {product.discountPrice.toLocaleString()}원
                    </DiscountPriceDisplay>
                  </DiscountInfoDisplay>
                </PriceDisplay>
                <TotalPriceRow>
                  <AddressTitle>총 결제 금액</AddressTitle>
                  <TotalPriceValue>
                    {(
                      product.discountPrice * selectedQuantity
                    ).toLocaleString()}
                    원
                  </TotalPriceValue>
                </TotalPriceRow>
              </PriceReservationSection>

              {/* 예약 안내 */}
              <ReservationNotice>
                <NoticeText>
                  상품 예약이 수락되면, 30분 이내에 꼭 픽업해주세요!
                </NoticeText>
              </ReservationNotice>

              {/* 확인 체크박스 */}
              <ConfirmationSection>
                <Checkbox
                  type="checkbox"
                  id="confirmReservation"
                  onChange={(e) => setConfirmChecked(e.target.checked)}
                />
                <CheckboxLabel htmlFor="confirmReservation">
                  위 예약 안내를 확인하였습니다.
                </CheckboxLabel>
              </ConfirmationSection>

              {/* 예약하기 버튼 */}
              <ReserveButton onClick={handleReserve} disabled={!confirmChecked}>
                예약하기
              </ReserveButton>
            </BottomSheetContent>
          </ReservationBottomSheet>
        </>
      )}

      {/* 예약 확인 모달 */}
      {showConfirmModal && (
        <>
          <ModalOverlay onClick={handleCancelReservation} />
          <ConfirmModal>
            <ModalContent>
              <ModalText>
                정말로 <strong>{product?.name}</strong>을(를)
                <br />
                <strong>{selectedQuantity}개</strong> 예약하시겠습니까?
              </ModalText>
              <ModalPriceInfo>
                총 결제 금액:{" "}
                <strong>
                  {(product?.discountPrice * selectedQuantity).toLocaleString()}
                  원
                </strong>
              </ModalPriceInfo>
              <ModalNotice>
                예약하신 상품은 예약 취소가 불가능합니다.
              </ModalNotice>
            </ModalContent>
            <ModalActions>
              <CancelButton onClick={handleCancelReservation}>
                취소
              </CancelButton>
              <ConfirmButton onClick={handleConfirmReservation}>
                예약하기
              </ConfirmButton>
            </ModalActions>
          </ConfirmModal>
        </>
      )}
    </Container>
  );
};

export default Registeration;
