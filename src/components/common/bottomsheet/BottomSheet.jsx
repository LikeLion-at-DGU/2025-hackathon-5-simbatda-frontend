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
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);

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

  // 터치/마우스 이벤트 핸들러
  const handleTouchStart = (e) => {
    const clientY = e.touches ? e.touches[0]?.clientY : e.clientY;

    if (clientY !== undefined) {
      setStartY(clientY);
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const clientY = e.touches ? e.touches[0]?.clientY : e.clientY;

    if (clientY !== undefined) {
      const deltaY = clientY - startY;

      if (deltaY > 0) {
        setCurrentY(deltaY);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    if (currentY > 100) {
      onClose();
    }

    setCurrentY(0);
  };

  useEffect(() => {
    if (isDragging) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isDragging]);

  if (!isOpen) return null;

  return (
    <>
      <BottomSheetOverlay
        ref={overlayRef}
        $isOpen={isOpen}
        onClick={handleOverlayClick}
      />
      <BottomSheetContainer
        ref={containerRef}
        $isOpen={isOpen}
        $isDragging={isDragging}
        $currentY={currentY}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <BottomSheetHeader>
          <HeaderTitle>재고 목록</HeaderTitle>
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
              <NoProductsIcon>🛍️</NoProductsIcon>
              <NoProductsText>이 지역에 등록된 상품이 없습니다</NoProductsText>
            </NoProductsMessage>
          )}
        </BottomSheetContent>
      </BottomSheetContainer>
    </>
  );
};

export default BottomSheet;
