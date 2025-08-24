import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductDetail,
  getStoreInfo,
  getRecommendedProducts,
  createReservation,
  toggleWishlist,
  getWishlistProducts,
} from "../../api/products";
import ProductCard from "../../components/common/card/ProductCard";
import BackHeader from "../../components/common/header/BackHeader";
import like from "../../assets/icons/like/like.svg";
import unlike from "../../assets/icons/like/unlike.svg";
import character from "../../assets/images/logo3.svg";
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
  NoRecommendationContainer,
  NoRecommendationImageContainer,
} from "./Registeration.styles";

const Registeration = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

  const requestUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error);
        }
      );
    }
  }, []);

  const [reservationBottomSheetOpen, setReservationBottomSheetOpen] =
    useState(false);
  const [userInfo, setUserInfo] = useState({ name: "테스트 사용자" });
  const [isLiked, setIsLiked] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isReserving, setIsReserving] = useState(false);

  // 찜 토글 함수
  const handleLikeToggle = async () => {
    try {
      const newLikedState = !isLiked;

      await toggleWishlist(productId, newLikedState);

      setIsLiked(newLikedState);
    } catch (error) {
      console.error("찜 토글 실패:", error);
    }
  };

  // 사용자 위치 요청
  useEffect(() => {
    requestUserLocation();
  }, [requestUserLocation]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if (!productId) return;
        const detail = await getProductDetail(productId);
        if (!mounted || !detail) return;

        const storeId =
          typeof detail.store === "number" ? detail.store : detail.store?.id;
        const storeInfo = storeId ? await getStoreInfo(storeId) : null;

        // 찜 상태 확인
        let productIsLiked = false;
        try {
          const wishlistProducts = await getWishlistProducts();
          productIsLiked = wishlistProducts.some((p) => p.id === detail.id);
        } catch (error) {
          // 찜 목록 조회 실패 시 기본값 사용
        }

        const expiry = detail.expiration_date
          ? new Date(detail.expiration_date)
          : null;
        const now = new Date();
        const diffMs = expiry
          ? Math.max(0, expiry.getTime() - now.getTime())
          : 0;
        const remainingTime = {
          days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diffMs / 60) % 60),
          seconds: Math.floor((diffMs / 1000) % 60),
        };

        setProduct({
          id: detail.id,
          name: detail.name,
          description: detail.description || "",
          originalPrice: detail.price,
          discountPrice: detail.discount_price,
          discountRate: detail.discount_rate ?? 0,
          stock: detail.stock,
          imageUrl: detail.image || "",
          expiryDate: expiry ? expiry.toLocaleString() : "",
          remainingTime,
        });

        const resolvedStoreName =
          (storeInfo?.name && storeInfo.name.trim()) ||
          (detail.store_name && String(detail.store_name).trim()) ||
          (detail.store?.name && String(detail.store.name).trim()) ||
          "상점";

        setStore({
          id: storeInfo?.id || storeId || 0,
          name: resolvedStoreName,
          address: storeInfo?.address || "",
        });

        setIsLiked(productIsLiked);
      } catch (e) {
        if (!mounted) return;
        setProduct(null);
        setStore(null);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [productId]);

  useEffect(() => {
    let mounted = true;
    const loadRecommended = async () => {
      try {
        // 찜 목록 가져오기
        let wishlistProducts = [];
        try {
          wishlistProducts = await getWishlistProducts();
        } catch (error) {
          wishlistProducts = [];
        }
        const wishlistProductIds = new Set(wishlistProducts.map((p) => p.id));

        // 위치 정보가 있을 때만 추천상품 API 호출
        const list =
          userLocation.lat && userLocation.lng
            ? await getRecommendedProducts(userLocation.lat, userLocation.lng)
            : await getRecommendedProducts();
        if (!mounted) return;
        const mapped = (Array.isArray(list) ? list : [])
          .filter((p) => p?.id !== Number(productId))
          .slice(0, 5)
          .map((p) => ({
            id: p.id,
            storeName: p.store_name || p.store?.name || "상점",
            productName: p.name,
            originalPrice: p.price,
            discountPrice: p.discount_price,
            imageUrl: p.image || "",
            isLiked: wishlistProductIds.has(p.id),
          }));
        setRecommended(mapped);
      } catch (_) {
        if (!mounted) return;
        setRecommended([]);
      }
    };

    loadRecommended();
    return () => {
      mounted = false;
    };
  }, [productId, userLocation.lat, userLocation.lng]);

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

  const handleConfirmReservation = async () => {
    if (!product?.id) return;
    try {
      setIsReserving(true);
      const result = await createReservation({
        productId: product.id,
        quantity: selectedQuantity,
      });
      alert("예약이 완료되었습니다.");
      setShowConfirmModal(false);
      setReservationBottomSheetOpen(false);
      document.body.style.overflow = "unset";

      // 예약 완료 후 페이지 새로고침하여 재고 상태 업데이트
      window.location.reload();
    } catch (e) {
      alert("예약에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsReserving(false);
    }
  };

  const handleCancelReservation = () => {
    setShowConfirmModal(false);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setSelectedQuantity(newQuantity);
    }
  };

  const handleStoreClick = () => {
    if (store?.id) navigate(`/store/${store.id}`);
  };

  // 추천상품 찜 토글 처리
  const handleRecommendedProductLikeToggle = async (productId, isLiked) => {
    try {
      await toggleWishlist(productId, isLiked);

      // 찜 목록 다시 가져오기
      let wishlistProducts = [];
      try {
        wishlistProducts = await getWishlistProducts();
      } catch (error) {
        wishlistProducts = [];
      }
      const wishlistProductIds = new Set(wishlistProducts.map((p) => p.id));

      // 추천상품 목록 업데이트
      const updatedRecommended = recommended.map((product) => {
        if (product.id === productId) {
          return { ...product, isLiked: wishlistProductIds.has(product.id) };
        }
        return product;
      });

      setRecommended(updatedRecommended);
    } catch (error) {
      console.error("추천상품 찜 토글 실패:", error);
    }
  };

  if (!product || !store) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <Container>
      <BackHeader title="상품 상세" />

      <ProductImageContainer>
        <ProductImageSection>
          <ProductImage
            src={product.imageUrl || "/src/assets/images/defaultImage.svg"}
            alt={product.name}
          />
          <LikeButton onClick={handleLikeToggle}>
            <img src={isLiked ? like : unlike} alt="좋아요" />
          </LikeButton>
        </ProductImageSection>
      </ProductImageContainer>

      <StoreName onClick={handleStoreClick}>
        {store.name} {" >"}
      </StoreName>

      <ProductName>{product.name}</ProductName>

      <ProductDescription>{product.description}</ProductDescription>

      <PriceSection>
        <OriginalPrice>
          {Number(product.originalPrice || 0).toLocaleString()}원
        </OriginalPrice>
        <DiscountInfo>
          <DiscountRate>{Number(product.discountRate || 0)}%</DiscountRate>
          <DiscountPrice>
            {Number(product.discountPrice || 0).toLocaleString()}원
          </DiscountPrice>
        </DiscountInfo>
      </PriceSection>

      <RemainingTimeSection>
        <RemainingTimeTitle>
          D-{product.remainingTime.days},{" "}
          {String(product.remainingTime.hours).padStart(2, "0")}:
          {String(product.remainingTime.minutes).padStart(2, "0")}:
          {String(product.remainingTime.seconds).padStart(2, "0")} 남음
        </RemainingTimeTitle>
      </RemainingTimeSection>

      {recommended.length > 0 ? (
        <RecommendedSection>
          <SectionTitle>
            {userInfo?.name || "사용자"}님 취향과 비슷한 상품이에요!
          </SectionTitle>
          <ProductsContainer>
            {recommended.map((recommendedProduct) => (
              <ProductCard
                key={recommendedProduct.id}
                variant="compact"
                storeName={recommendedProduct.storeName}
                productName={recommendedProduct.productName}
                originalPrice={recommendedProduct.originalPrice}
                discountPrice={recommendedProduct.discountPrice}
                imageUrl={recommendedProduct.imageUrl}
                isLiked={recommendedProduct.isLiked}
                onLikeToggle={(isLiked) =>
                  handleRecommendedProductLikeToggle(
                    recommendedProduct.id,
                    isLiked
                  )
                }
                onClick={() =>
                  navigate(`/registeration/${recommendedProduct.id}`)
                }
              />
            ))}
          </ProductsContainer>
        </RecommendedSection>
      ) : (
        <NoRecommendationContainer>
          <NoRecommendationText>
            원하는 상품 찜하시면 재고를 추천해드려요!
          </NoRecommendationText>
          <NoRecommendationImageContainer>
            <NoRecommendationImage src={character} alt="character" />
          </NoRecommendationImageContainer>
        </NoRecommendationContainer>
      )}

      <ReservationButton onClick={handleReservationClick}>
        예약하기
      </ReservationButton>

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
                          disabled={selectedQuantity >= (product.stock || 0)}
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

              <AddressSection>
                <AddressContainer>
                  <AddressTitle>매장 주소</AddressTitle>
                  <AddressCopyButton>주소 복사</AddressCopyButton>
                </AddressContainer>
                <AddressText>{store.address}</AddressText>
              </AddressSection>

              <PriceReservationSection>
                <AddressTitle>주문 금액</AddressTitle>
                <PriceDisplay>
                  <OriginalPriceDisplay>
                    {Number(product.originalPrice || 0).toLocaleString()}원
                  </OriginalPriceDisplay>
                  <DiscountInfoDisplay>
                    <DiscountRateDisplay>
                      {Number(product.discountRate || 0)}% 할인
                    </DiscountRateDisplay>
                    <DiscountPriceDisplay>
                      {Number(product.discountPrice || 0).toLocaleString()}원
                    </DiscountPriceDisplay>
                  </DiscountInfoDisplay>
                </PriceDisplay>
                <TotalPriceRow>
                  <AddressTitle>총 결제 금액</AddressTitle>
                  <TotalPriceValue>
                    {(
                      Number(product.discountPrice || 0) * selectedQuantity
                    ).toLocaleString()}
                    원
                  </TotalPriceValue>
                </TotalPriceRow>
              </PriceReservationSection>

              <ReservationNotice>
                <NoticeText>
                  상품 예약이 수락되면, 30분 이내에 꼭 픽업해주세요!
                </NoticeText>
              </ReservationNotice>

              <ConfirmationSection>
                <Checkbox
                  type="checkbox"
                  id="confirmReservation"
                  checked={confirmChecked}
                  onChange={(e) => setConfirmChecked(e.target.checked)}
                />
                <CheckboxLabel htmlFor="confirmReservation">
                  위 예약 안내를 확인하였습니다.
                </CheckboxLabel>
              </ConfirmationSection>

              <ReserveButton
                onClick={handleReserve}
                disabled={!confirmChecked || isReserving}
              >
                예약하기
              </ReserveButton>
            </BottomSheetContent>
          </ReservationBottomSheet>
        </>
      )}

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
                총 결제 금액: {""}
                <strong>
                  {(
                    Number(product?.discountPrice || 0) * selectedQuantity
                  ).toLocaleString()}
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
              <ConfirmButton
                onClick={handleConfirmReservation}
                disabled={isReserving}
              >
                {isReserving ? "처리 중..." : "예약하기"}
              </ConfirmButton>
            </ModalActions>
          </ConfirmModal>
        </>
      )}
    </Container>
  );
};

export default Registeration;
