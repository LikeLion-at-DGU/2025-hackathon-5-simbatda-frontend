import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import mapPinIcon from "../../../assets/icons/active-pin.png";
import currentLocationPinIcon from "../../../assets/icons/current-pin.png";
import locationIcon from "../../../assets/icons/Location.png";
import inventoryPinDefault from "../../../assets/icons/inactive-pin.png";
import {
  MapContainer,
  MapWrapper,
  MapOverlay,
  MapInfo,
  MapControls,
  ControlButton,
} from "./AdvancedGoogleMap.styles";

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
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
  markers = [],
  onMarkerClick,
  onClusterClick,
  onLocationUpdate,
  inventoryPinIcon,
  size = "default",
  nearbyPin,
  otherPin,
  products = [],
  userLocation = null,
  showUserLocation = false,
}) => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMarkers, setCurrentMarkers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);

  const currentLocationRef = useRef(currentLocation);
  const mapInstanceRef = useRef(map);
  const currentLocationMarkerRef = useRef(currentLocationMarker);

  useEffect(() => {
    currentLocationRef.current = currentLocation;
  }, [currentLocation]);

  useEffect(() => {
    mapInstanceRef.current = map;
  }, [map]);

  useEffect(() => {
    currentLocationMarkerRef.current = currentLocationMarker;
  }, [currentLocationMarker]);

  const productMarkers = useMemo(() => {
    if (!products || products.length === 0) return [];

    const storeGroups = {};

    products.forEach((product) => {
      let productLat, productLng;

      if (product.store && product.store.lat && product.store.lng) {
        productLat = product.store.lat;
        productLng = product.store.lng;
      } else if (product.lat && product.lng) {
        productLat = product.lat;
        productLng = product.lng;
      } else {
        return;
      }

      const storeKey = `${productLat.toFixed(6)}_${productLng.toFixed(6)}`;

      if (!storeGroups[storeKey]) {
        storeGroups[storeKey] = {
          position: { lat: productLat, lng: productLng },
          storeName: product.storeName || product.store?.name || "상점",
          products: [],
          distance: Infinity,
        };
      }

      storeGroups[storeKey].products.push(product);

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

    return Object.values(storeGroups).map((storeGroup) => {
      const nearbySourceProducts = storeGroup.products.filter(
        (product) => product.source === "nearby"
      );

      const isNearby = nearbySourceProducts.length > 0;

      return {
        id: `store_${storeGroup.position.lat}_${storeGroup.position.lng}`,
        position: storeGroup.position,
        title: `${storeGroup.storeName} (${storeGroup.products.length}개 상품)`,
        type: isNearby ? "nearby" : "other",
        name: storeGroup.storeName,
        storeGroup: storeGroup,
        distance: storeGroup.distance,
      };
    });
  }, [products, userLocation]);

  const activeMarkers = useMemo(() => {
    if (productMarkers.length > 0) {
      return productMarkers;
    }

    if (markers.length > 0) {
      return markers;
    }

    return [];
  }, [productMarkers, markers]);

  useEffect(() => {}, [activeMarkers]);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setCurrentLocation(location);

          if (onLocationUpdate) {
            onLocationUpdate(location);
          }

          if (mapInstanceRef.current) {
            addCurrentLocationMarker(location, mapInstanceRef.current);
            mapInstanceRef.current.setCenter(location);
            mapInstanceRef.current.setZoom(16);
          }
        },
        (error) => {
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
  }, []);

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
      zIndex: 9999,
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
  }, []);

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

  useEffect(() => {
    if (showUserLocation && !currentLocation) {
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

    currentMarkers.forEach((marker) => marker.setMap(null));

    const newMarkers = [];

    activeMarkers.forEach((markerData, index) => {
      let chosenIconUrl;
      if (markerData.type === "nearby") {
        chosenIconUrl = nearbyPin || inventoryPinIcon || inventoryPinDefault;
      } else {
        chosenIconUrl = otherPin || mapPinIcon;
      }

      const offset = index * 0.0001;
      const offsetPosition = {
        lat: markerData.position.lat + offset,
        lng: markerData.position.lng + offset,
      };

      let markerIcon;
      if (markerData.storeGroup) {
        const iconSize = 30;
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
        visible: true,
        zIndex: 1000 + index,
      });

      if (onMarkerClick) {
        marker.addListener("click", () => {
          onMarkerClick(markerData);
        });
      } else {
        marker.addListener("click", () => {
          if (markerData.storeGroup) {
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
                  <div style="border-bottom: 1px solid #eee; padding: 8px 0; cursor: pointer;" data-product-id="${
                    product.id
                  }">
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

    if (!map.getBounds()) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
        bounds.extend(marker.getPosition());
      });

      if (userLocation && userLocation.lat && userLocation.lng) {
        bounds.extend({ lat: userLocation.lat, lng: userLocation.lng });
      }

      map.fitBounds(bounds);
    }

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
