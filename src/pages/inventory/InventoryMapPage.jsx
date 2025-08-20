import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AdvancedGoogleMap from "../../components/common/map/AdvancedGoogleMap";
import Header from "../../components/common/header/Header";
import BottomSheet from "../../components/common/bottomsheet/BottomSheet";
import inventoryPinIcon from "../../assets/icons/inventory-pin.svg";

const PageContainer = styled.div`
  height: 100vh;
  background-color: #f8f9fa;
  overflow: hidden;
`;

const Content = styled.div`
  padding: 0;
  height: 100vh;
  margin-top: 0;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
`;

const PageTitle = styled.h1`
  display: none; /* 제목 숨기기 */
`;

const InventoryMapPage = () => {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [inventoryProducts, setInventoryProducts] = useState([]);

  // 재고 상품 데이터 (예시)
  const inventoryMarkers = [
    {
      id: 1,
      position: { lat: 37.5665, lng: 126.978 },
      title: "서울 중앙시장",
      type: "inventory",
      name: "서울 중앙시장",
      products: [
        { id: 1, name: "신선 채소 세트", quantity: 50, price: 8000 },
        { id: 2, name: "과일 바구니", quantity: 30, price: 12000 },
        { id: 3, name: "정육 세트", quantity: 20, price: 25000 },
      ],
    },
    {
      id: 2,
      position: { lat: 37.5645, lng: 126.976 },
      title: "광화문 상점가",
      type: "inventory",
      name: "광화문 상점가",
      products: [
        { id: 4, name: "베이커리 세트", quantity: 25, price: 15000 },
        { id: 5, name: "음료 세트", quantity: 40, price: 8000 },
      ],
    },
    {
      id: 3,
      position: { lat: 37.5685, lng: 126.98 },
      title: "명동 상점가",
      type: "inventory",
      name: "명동 상점가",
      products: [
        { id: 6, name: "패션 아이템", quantity: 100, price: 50000 },
        { id: 7, name: "화장품 세트", quantity: 60, price: 30000 },
      ],
    },
    {
      id: 4,
      position: { lat: 37.5625, lng: 126.974 },
      title: "시청역 상점가",
      type: "inventory",
      name: "시청역 상점가",
      products: [
        { id: 8, name: "전자제품", quantity: 15, price: 150000 },
        { id: 9, name: "도서 세트", quantity: 80, price: 20000 },
      ],
    },
    {
      id: 5,
      position: { lat: 37.5705, lng: 126.982 },
      title: "종로 상점가",
      type: "inventory",
      name: "종로 상점가",
      products: [
        { id: 10, name: "전통 공예품", quantity: 45, price: 80000 },
        { id: 11, name: "한복 세트", quantity: 25, price: 200000 },
      ],
    },
  ];

  // 재고 핀 클릭 시 바텀시트 열기
  const handleInventoryClick = (markerData) => {
    setSelectedInventory({
      name: markerData.name,
      type: "inventory",
      query: markerData.title,
    });
    setInventoryProducts(markerData.products);
    setBottomSheetOpen(true);
  };

  // 바텀시트 닫기
  const handleBottomSheetClose = () => {
    setBottomSheetOpen(false);
    setSelectedInventory(null);
    setInventoryProducts([]);
  };

  // 상품 클릭 시 처리
  const handleProductClick = (productId) => {
    console.log("재고 상품 클릭:", productId);
    // TODO: 재고 상품 상세 페이지로 이동
  };

  return (
    <PageContainer>
      <Header userInfo={{ name: "재고 관리자" }} onLogout={() => {}} />

      <Content>
        <PageTitle>재고 지도</PageTitle>

        <MapContainer>
          <AdvancedGoogleMap
            center="37.5665,126.9780"
            zoom={13}
            markers={inventoryMarkers}
            onMarkerClick={handleInventoryClick}
            inventoryPinIcon={inventoryPinIcon}
            size="full"
            onClusterClick={(cluster) => {
              const map = cluster.map;
              const bounds = new window.google.maps.LatLngBounds();

              cluster.markers.forEach((marker) => {
                bounds.extend(marker.getPosition());
              });

              map.fitBounds(bounds);
            }}
          />
        </MapContainer>

        <BottomSheet
          isOpen={bottomSheetOpen}
          onClose={handleBottomSheetClose}
          location={selectedInventory}
          products={inventoryProducts}
          onProductClick={handleProductClick}
          onProductLikeToggle={() => {}}
        />
      </Content>
    </PageContainer>
  );
};

export default InventoryMapPage;
