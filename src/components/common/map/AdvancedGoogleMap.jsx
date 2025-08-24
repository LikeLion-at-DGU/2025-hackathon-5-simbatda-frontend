import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import mapPinIcon from "../../../assets/icons/active-pin.svg";
import currentLocationPinIcon from "../../../assets/icons/current-pin.svg";
import locationIcon from "../../../assets/icons/Location.svg";
import inventoryPinDefault from "../../../assets/icons/inactive-pin.svg";

const MapContainer = styled.div`
  width: 100%;
  height: ${(props) => (props.$size === "full" ? "100%" : "328px")};
  border-radius: ${(props) => (props.$size === "full" ? "0" : "15px")};
  margin: ${(props) => (props.$size === "full" ? "0" : "20px auto")};
  overflow: hidden;
  box-shadow: ${(props) =>
    props.$size === "full" ? "none" : "0 4px 12px rgba(0, 0, 0, 0.1)"};
  position: relative;
  transition: all 0.3s ease;

  ${(props) =>
    props.$size !== "full" &&
    `
    &:hover {
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
  `}
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 500;
  z-index: 10;
  pointer-events: none;
  border-radius: 15px;
`;

const MapInfo = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: #374151;
  text-align: center;
  z-index: 5;
  pointer-events: none;
`;

const MapControls = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 5;
`;

const ControlButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: white;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// 두 지점 간의 거리 계산 (Haversine 공식)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // 지구의 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const AdvancedGoogleMap = ({
  onClick,
  center = "37.5665,126.9780",
  zoom = 15,
  markers = [], // 사용자 정의 마커 (기본값: 빈 배열)
  onMarkerClick,
  onClusterClick,
  onLocationUpdate, // 현재위치 업데이트 콜백
  inventoryPinIcon,
  size = "default",
  nearbyPin, // 내 주변 상품 핀 커스텀
  otherPin, // 기타 위치 상품 핀 커스텀
  products = [], // 상품 데이터
  userLocation = null, // 사용자 위치
  showUserLocation = false, // 현재 위치 버튼 표시 여부
}) => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMarkers, setCurrentMarkers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);

  // useRef를 사용하여 최신 값 참조
  const currentLocationRef = useRef(currentLocation);
  const mapInstanceRef = useRef(map);
  const currentLocationMarkerRef = useRef(currentLocationMarker);

  // ref 값들을 최신 상태로 업데이트
  useEffect(() => {
    currentLocationRef.current = currentLocation;
  }, [currentLocation]);

  useEffect(() => {
    mapInstanceRef.current = map;
  }, [map]);

  useEffect(() => {
    currentLocationMarkerRef.current = currentLocationMarker;
  }, [currentLocationMarker]);

  // 하드코딩된 마커 제거 - 실제 상품 데이터만 사용

  // 상품 데이터를 기반으로 마커 생성
  const productMarkers = useMemo(() => {
    if (!products || products.length === 0) return [];

    // 상점별로 상품 그룹화
    const storeGroups = {};

    products.forEach((product) => {
      // 상품의 위치 정보 (상점 위치 사용)
      let productLat, productLng;

      // 다양한 위치 정보 소스에서 좌표 추출
      if (product.store && product.store.lat && product.store.lng) {
        // store 객체에 직접 lat, lng가 있는 경우
        productLat = product.store.lat;
        productLng = product.store.lng;
      } else if (product.lat && product.lng) {
        // 상품 자체에 lat, lng가 있는 경우
        productLat = product.lat;
        productLng = product.lng;
      } else {
        return; // 위치 정보가 없는 상품은 제외
      }

      // 상점 위치를 키로 사용 (소수점 4자리까지 반올림하여 그룹화)
      const storeKey = `${productLat.toFixed(4)}_${productLng.toFixed(4)}`;

      if (!storeGroups[storeKey]) {
        storeGroups[storeKey] = {
          position: { lat: productLat, lng: productLng },
          storeName: product.storeName || product.store?.name || "상점",
          products: [],
          distance: Infinity,
        };
      }

      // 상점 그룹에 상품 추가
      storeGroups[storeKey].products.push(product);

      // 사용자 위치와의 거리 계산 (가장 가까운 상품의 거리 사용)
      if (userLocation && userLocation.lat && userLocation.lng) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          productLat,
          productLng
        );
        if (distance < storeGroups[storeKey].distance) {
          storeGroups[storeKey].distance = distance;
        }
      }
    });

    // 상점별 마커 생성
    return Object.values(storeGroups).map((storeGroup) => {
      const radius = userLocation?.radius || 5;

      // 상품들의 source를 확인하여 분류
      const nearbySourceProducts = storeGroup.products.filter(
        (product) => product.source === "nearby"
      );
      const allSourceProducts = storeGroup.products.filter(
        (product) => product.source === "all"
      );

      // 상점에 "nearby" source 상품이 하나라도 있으면 "nearby"로 분류
      const isNearby = nearbySourceProducts.length > 0;

      return {
        id: `store_${storeGroup.position.lat}_${storeGroup.position.lng}`,
        position: storeGroup.position,
        title: `${storeGroup.storeName} (${storeGroup.products.length}개 상품)`,
        type: isNearby ? "nearby" : "other",
        name: storeGroup.storeName,
        storeGroup: storeGroup, // 상점 그룹 정보 저장
        distance: storeGroup.distance,
      };
    });
  }, [products, userLocation]);

  const activeMarkers = useMemo(() => {
    // 상품 마커가 있으면 사용
    if (productMarkers.length > 0) {
      return productMarkers;
    }

    // 상품 마커가 없고 사용자 정의 마커가 있으면 사용
    if (markers.length > 0) {
      return markers;
    }

    // 둘 다 없으면 빈 배열 반환 (마커 없음)
    return [];
  }, [productMarkers, markers]);

  // activeMarkers 변경 감지 (디버깅용)
  useEffect(() => {
    // activeMarkers 변경 시 추가 처리 필요시 여기에 구현
  }, [activeMarkers]);

  // 현재 위치 가져오기
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setCurrentLocation(location);

          // 부모 컴포넌트에 위치 업데이트 알림
          if (onLocationUpdate) {
            onLocationUpdate(location);
          }

          // map이 준비된 후에 마커 추가 및 지도 이동
          if (mapInstanceRef.current) {
            addCurrentLocationMarker(location, mapInstanceRef.current);
            mapInstanceRef.current.setCenter(location);
            mapInstanceRef.current.setZoom(16);
          }
        },
        (error) => {
          // 사용자에게 권한 요청 안내
          if (error.code === 1) {
            alert(
              "위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요."
            );
          } else if (error.code === 2) {
            alert("위치를 가져올 수 없습니다. 인터넷 연결을 확인해주세요.");
          } else if (error.code === 3) {
            alert("위치 요청 시간이 초과되었습니다. 다시 시도해주세요.");
          } else {
            alert(
              "위치 서비스를 사용할 수 없습니다. 브라우저를 새로고침하거나 다시 시도해주세요."
            );
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    }
  }, []); // 의존성 제거

  const addCurrentLocationMarker = useCallback((location, mapInstance) => {
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setMap(null);
    }

    const marker = new window.google.maps.Marker({
      position: location,
      map: mapInstance,
      title: "현재 위치",
      icon: {
        url: currentLocationPinIcon,
        scaledSize: new window.google.maps.Size(30, 30),
        anchor: new window.google.maps.Point(24, 48),
      },
      zIndex: 1000,
    });

    setCurrentLocationMarker(marker);
  }, []);

  const moveToCurrentLocation = useCallback(() => {
    if (currentLocationRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(currentLocationRef.current);
      mapInstanceRef.current.setZoom(16);

      if (!currentLocationMarkerRef.current) {
        addCurrentLocationMarker(
          currentLocationRef.current,
          mapInstanceRef.current
        );
      }
    } else {
      getCurrentLocation();
    }
  }, []); // 의존성 제거

  const initializeMap = () => {
    if (!window.google || !window.google.maps) {
      return;
    }

    try {
      const mapElement = mapRef.current;
      if (!mapElement) return;

      const newMap = new window.google.maps.Map(mapElement, {
        center: {
          lat: parseFloat(center.split(",")[0]),
          lng: parseFloat(center.split(",")[1]),
        },
        zoom: zoom,
        disableDefaultUI: true,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      setMap(newMap);
      setIsLoading(false);

      if (onClick) {
        newMap.addListener("click", (event) => {
          onClick(event);
        });
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleZoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };

  const handleResetView = () => {
    if (map) {
      map.setCenter({
        lat: parseFloat(center.split(",")[0]),
        lng: parseFloat(center.split(",")[1]),
      });
      map.setZoom(zoom);
    }
  };

  useEffect(() => {
    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(interval);
          initializeMap();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        if (!map) {
          setIsLoading(false);
        }
      }, 10000);
    }

    return () => {
      if (map) {
        window.google.maps.event.clearInstanceListeners(map);
      }
    };
  }, []);

  useEffect(() => {
    if (map && currentLocation) {
      addCurrentLocationMarker(currentLocation, map);
      map.setCenter(currentLocation);
      map.setZoom(16);
    }
  }, [map, currentLocation]);

  // 컴포넌트 마운트 시 현재 위치 요청 (showUserLocation이 true인 경우)
  useEffect(() => {
    if (showUserLocation && !currentLocation) {
      // 약간의 지연을 두어 사용자 제스처로 인식되도록 함
      const timer = setTimeout(() => {
        getCurrentLocation();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [showUserLocation, currentLocation]);

  useEffect(() => {
    if (!map || activeMarkers.length === 0) {
      return;
    }

    // 기존 마커들 제거
    currentMarkers.forEach((marker) => marker.setMap(null));

    const newMarkers = [];

    activeMarkers.forEach((markerData, index) => {
      // 거리에 따른 핀 색상 결정
      let chosenIconUrl;
      if (markerData.type === "nearby") {
        // 주변 상품: 주황색 핀
        chosenIconUrl = nearbyPin || inventoryPinIcon || inventoryPinDefault;
      } else {
        // 먼 거리 상품: 초록색 핀
        chosenIconUrl = otherPin || mapPinIcon;
      }

      // 같은 위치에 있는 마커들을 위해 약간의 오프셋 추가
      const offset = index * 0.0001; // 각 마커마다 미세한 위치 차이
      const offsetPosition = {
        lat: markerData.position.lat + offset,
        lng: markerData.position.lng + offset,
      };

      let markerIcon;
      if (markerData.storeGroup) {
        const iconSize = 30; // 아이콘 크기 증가
        if (markerData.type === "nearby") {
          markerIcon = {
            url: mapPinIcon,
            scaledSize: new window.google.maps.Size(iconSize, iconSize),
            anchor: new window.google.maps.Point(20, 40),
          };
        } else {
          markerIcon = {
            url: inventoryPinDefault,
            scaledSize: new window.google.maps.Size(iconSize, iconSize),
            anchor: new window.google.maps.Point(20, 40),
          };
        }
      } else {
        markerIcon = {
          url: chosenIconUrl,
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32),
        };
      }

      const marker = new window.google.maps.Marker({
        position: offsetPosition,
        map: map,
        title: markerData.title,
        icon: markerIcon,
        // 마커 가시성 보장
        visible: true,
        zIndex: 1000 + index, // 각 마커마다 다른 zIndex
      });

      // 마커 클릭 이벤트
      if (onMarkerClick) {
        marker.addListener("click", () => {
          onMarkerClick(markerData);
        });
      } else {
        // 기본 마커 클릭 이벤트 (상점 정보 표시)
        marker.addListener("click", () => {
          if (markerData.storeGroup) {
            // 상점별로 그룹화된 상품들 표시
            const productsList = markerData.storeGroup.products
              .map((product) => {
                const price = product.originalPrice || product.price;
                const discountPrice =
                  product.discountPrice || product.discount_price;
                const priceText = price
                  ? discountPrice && discountPrice < price
                    ? `<del>${price.toLocaleString()}원</del> <strong style="color: #e74c3c;">${discountPrice.toLocaleString()}원</strong>`
                    : `<strong>${price.toLocaleString()}원</strong>`
                  : "가격 정보 없음";

                return `
                  <div style="border-bottom: 1px solid #eee; padding: 8px 0; cursor: pointer;" 
                       data-product-id="${product.id}">
                    <div style="font-weight: bold; margin-bottom: 4px;">${
                      product.productName || product.name
                    }</div>
                    <div style="color: #666; font-size: 12px;">${priceText}</div>
                  </div>
                `;
              })
              .join("");

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 15px; min-width: 250px; max-height: 300px; overflow-y: auto;">
                  <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #333; border-bottom: 2px solid #3498db; padding-bottom: 8px;">
                    🏪 ${markerData.name}
                  </h3>
                  <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
                    <strong>📍 거리:</strong> ${
                      markerData.distance
                        ? markerData.distance.toFixed(1) + "km"
                        : "알 수 없음"
                    }
                  </p>
                  <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
                    <strong>📦 상품 수:</strong> ${
                      markerData.storeGroup.products.length
                    }개
                  </p>
                  <div style="margin-top: 15px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #333;">상품 목록:</h4>
                    ${productsList}
                  </div>
                </div>
              `,
            });

            // InfoWindow가 열린 후 상품 클릭 이벤트 추가
            infoWindow.addListener("domready", () => {
              const productItems =
                document.querySelectorAll("[data-product-id]");
              productItems.forEach((item) => {
                item.addEventListener("click", (e) => {
                  e.preventDefault();
                  const productId = item.getAttribute("data-product-id");
                  navigate(`/product/${productId}`);
                  infoWindow.close();
                });
              });
            });

            infoWindow.open(map, marker);
          } else if (markerData.product) {
            // 개별 상품 정보 표시 (기존 로직)
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 10px; min-width: 200px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #333;">
                    ${markerData.title}
                  </h3>
                  <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;">
                    <strong>상점:</strong> ${markerData.name}
                  </p>
                  <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;">
                    <strong>거리:</strong> ${
                      markerData.distance
                        ? markerData.distance.toFixed(1) + "km"
                        : "알 수 없음"
                    }
                  </p>
                  <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;">
                    <strong>가격:</strong> ${
                      markerData.product.originalPrice
                        ? markerData.product.originalPrice.toLocaleString() +
                          "원"
                        : "가격 정보 없음"
                    }
                  </p>
                </div>
              `,
            });
            infoWindow.open(map, marker);
          }
        });
      }

      newMarkers.push(marker);
    });

    // 지도가 초기화된 후에만 범위 조정 (핀 클릭 시에는 조정하지 않음)
    if (!map.getBounds()) {
      // 모든 마커를 포함하는 지도 범위 설정
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
        bounds.extend(marker.getPosition());
      });

      // 사용자 위치도 범위에 포함
      if (userLocation && userLocation.lat && userLocation.lng) {
        bounds.extend({ lat: userLocation.lat, lng: userLocation.lng });
      }

      // 지도 범위 조정 (패딩 추가)
      map.fitBounds(bounds);

      // 너무 확대되지 않도록 최대 줌 레벨 제한
      const listener = window.google.maps.event.addListenerOnce(
        map,
        "bounds_changed",
        () => {
          if (map.getZoom() > 15) {
            map.setZoom(15);
          }
        }
      );
    }

    // 마커 클러스터링 완전 제거 - 모든 마커를 개별적으로 표시
    setCurrentMarkers(newMarkers);
  }, [
    map,
    activeMarkers,
    nearbyPin,
    otherPin,
    inventoryPinIcon,
    onMarkerClick,
  ]);

  return (
    <MapContainer $size={size}>
      <MapWrapper ref={mapRef} />

      {isLoading && <MapOverlay>지도를 불러오는 중...</MapOverlay>}

      {!isLoading && (
        <>
          <MapInfo>지도를 클릭하여 주변 상품을 확인하세요</MapInfo>
          <MapControls>
            <ControlButton onClick={handleZoomIn} title="확대">
              +
            </ControlButton>
            <ControlButton onClick={handleZoomOut} title="축소">
              −
            </ControlButton>
            {showUserLocation && (
              <ControlButton onClick={moveToCurrentLocation} title="현재 위치">
                <img
                  src={locationIcon}
                  alt="현재 위치"
                  width={16}
                  height={16}
                />
              </ControlButton>
            )}
          </MapControls>
        </>
      )}
    </MapContainer>
  );
};

export default AdvancedGoogleMap;
