import React, { useEffect, useRef, useState, useMemo } from "react";
import styled from "styled-components";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import mapPinIcon from "../../../assets/icons/map-pin.svg";
import currentLocationPinIcon from "../../../assets/icons/pin.svg";
import locationIcon from "../../../assets/icons/Location.png";

const MapContainer = styled.div`
  width: ${(props) => (props.$size === "full" ? "100%" : "328px")};
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

const AdvancedGoogleMap = ({
  onClick,
  center = "37.5665,126.9780",
  zoom = 15,
  markers = [],
  onMarkerClick,
  onClusterClick,
  inventoryPinIcon,
  size = "default",
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [markerClusterer, setMarkerClusterer] = useState(null);
  const [currentMarkers, setCurrentMarkers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);

  const defaultMarkers = useMemo(
    () => [
      {
        id: 1,
        position: { lat: 37.5665, lng: 126.978 },
        title: "서울시청",
        type: "store",
        name: "서울 중앙시장",
      },
      {
        id: 2,
        position: { lat: 37.5645, lng: 126.976 },
        title: "광화문",
        type: "store",
        name: "광화문 상점가",
      },
      {
        id: 3,
        position: { lat: 37.5685, lng: 126.98 },
        title: "명동",
        type: "store",
        name: "명동 상점가",
      },
      {
        id: 4,
        position: { lat: 37.5625, lng: 126.974 },
        title: "시청역",
        type: "store",
        name: "시청역 상점가",
      },
      {
        id: 5,
        position: { lat: 37.5705, lng: 126.982 },
        title: "종로",
        type: "store",
        name: "종로 상점가",
      },
    ],
    []
  );

  const activeMarkers = useMemo(
    () => (markers.length > 0 ? markers : defaultMarkers),
    [markers, defaultMarkers]
  );

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setCurrentLocation(location);

          if (map) {
            addCurrentLocationMarker(location, map);
            map.setCenter(location);
            map.setZoom(16);
          }
        },
        (error) => {
          console.log("현재 위치를 가져올 수 없습니다:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      console.log("Geolocation이 지원되지 않습니다");
    }
  };

  const addCurrentLocationMarker = (location, mapInstance) => {
    if (currentLocationMarker) {
      currentLocationMarker.setMap(null);
    }

    const marker = new window.google.maps.Marker({
      position: location,
      map: mapInstance,
      title: "현재 위치",
      icon: {
        url: currentLocationPinIcon,
        scaledSize: new window.google.maps.Size(48, 48),
        anchor: new window.google.maps.Point(24, 48),
      },
      zIndex: 1000,
    });

    setCurrentLocationMarker(marker);
  };

  const moveToCurrentLocation = () => {
    if (currentLocation && map) {
      map.setCenter(currentLocation);
      map.setZoom(16);

      if (!currentLocationMarker) {
        addCurrentLocationMarker(currentLocation, map);
      }
    } else {
      getCurrentLocation();
    }
  };

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
      console.error("구글 맵 초기화 오류:", error);
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
      if (markerClusterer) {
        markerClusterer.clearMarkers();
      }
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
    if (!map || activeMarkers.length === 0) return;

    currentMarkers.forEach((marker) => marker.setMap(null));

    const newMarkers = [];

    activeMarkers.forEach((markerData) => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: map,
        title: markerData.title,
        icon: {
          url: inventoryPinIcon || mapPinIcon,
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32),
        },
      });

      if (onMarkerClick) {
        marker.addListener("click", () => {
          onMarkerClick(markerData);
        });
      }

      newMarkers.push(marker);
    });

    setCurrentMarkers(newMarkers);

    if (newMarkers.length > 0) {
      const clusterer = new MarkerClusterer({
        map: map,
        markers: newMarkers,
        gridSize: 100,
        maxZoom: 16,
        minimumClusterSize: 2,
        renderer: {
          render: ({ count, position }) => {
            return new window.google.maps.Marker({
              position,
              icon: {
                url:
                  "data:image/svg+xml;charset=UTF-8," +
                  encodeURIComponent(`
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="25" cy="25" r="25" fill="#37ca79" stroke="#2a9d5f" stroke-width="2"/>
                    <text x="25" y="32" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial, sans-serif">${count}</text>
              `),
                scaledSize: new window.google.maps.Size(50, 50),
                anchor: new window.google.maps.Point(25, 25),
              },
            });
          },
        },
      });

      setMarkerClusterer(clusterer);

      if (onClusterClick) {
        clusterer.addListener("clusterclick", (cluster) => {
          onClusterClick(cluster);
        });
      }
    }
  }, [map, activeMarkers]);

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
            <ControlButton onClick={moveToCurrentLocation} title="현재 위치">
              <img src={locationIcon} alt="현재 위치" width={16} height={16} />
            </ControlButton>
          </MapControls>
        </>
      )}
    </MapContainer>
  );
};

export default AdvancedGoogleMap;
