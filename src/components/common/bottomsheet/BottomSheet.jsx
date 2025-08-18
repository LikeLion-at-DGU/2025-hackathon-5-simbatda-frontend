import React, { useEffect, useRef, useState } from "react";
import ProductCard from "../card/ProductCard";
import {
  BottomSheetOverlay,
  BottomSheetContainer,
  BottomSheetHeader,
  HeaderTitle,
  BottomSheetContent,
  ProductsGrid,
  NoProductsMessage,
  NoProductsIcon,
  NoProductsText,
  CloseButton,
} from "./BottomSheet.styles";

const BottomSheet = ({
  isOpen,
  onClose,
  products = [],
  onProductClick,
  onProductLikeToggle,
}) => {
  const overlayRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <BottomSheetOverlay
        ref={overlayRef}
        $isOpen={isOpen}
        onClick={handleOverlayClick}
      />
      <BottomSheetContainer ref={containerRef} $isOpen={isOpen}>
        <BottomSheetHeader>
          <HeaderTitle>재고 목록</HeaderTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </BottomSheetHeader>

        <BottomSheetContent>
          {products.length > 0 ? (
            <ProductsGrid>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  variant="default"
                  storeName={product.storeName}
                  productName={product.productName}
                  originalPrice={product.originalPrice}
                  discountPrice={product.discountPrice}
                  imageUrl={product.imageUrl}
                  isLiked={product.isLiked}
                  onLikeToggle={(isLiked) =>
                    onProductLikeToggle?.(product.id, isLiked)
                  }
                  onClick={() => onProductClick?.(product.id)}
                />
              ))}
            </ProductsGrid>
          ) : (
            <NoProductsMessage>
              <NoProductsIcon></NoProductsIcon>
              <NoProductsText>이 지역에 등록된 상품이 없습니다</NoProductsText>
            </NoProductsMessage>
          )}
        </BottomSheetContent>
      </BottomSheetContainer>
    </>
  );
};

export default BottomSheet;
