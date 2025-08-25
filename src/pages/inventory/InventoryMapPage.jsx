import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdvancedGoogleMap from "../../components/common/map/AdvancedGoogleMap";
import Header from "../../components/common/header/Header";
import BottomSheet from "../../components/common/bottomsheet/BottomSheet";
import {
  getStoreInfo,
  getCategories,
  getAllProducts,
  toggleWishlist,
  getWishlistProducts,
} from "../../api/products";
import { getConsumerMe } from "../../api/auth";
import {
  PageContainer,
  Content,
  MapContainer,
  PageTitle,
} from "./InventoryMapPage.styles";

const InventoryMapPage = () => {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedLocationInfo, setSelectedLocationInfo] = useState(null);
  const [locationProducts, setLocationProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({
    lat: null,
    lng: null,
    radius: 5,
  });
  const [categoryNameToId, setCategoryNameToId] = useState({});
  const [nearbyProducts, setNearbyProducts] = useState([]); 
  const [allNearbyProducts, setAllNearbyProducts] = useState([]); 
  const [filteredNearbyProducts, setFilteredNearbyProducts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getConsumerMe();
        setUserInfo({ name: userData.name });
      } catch (error) {
        console.error("사용자 정보 조회 오류:", error);
        setUserInfo({ name: "사용자" });
      }
    };

    fetchUserInfo();
  }, []);

  const requestUserLocation = useCallback(() => {
    if (userLocation.lat && userLocation.lng) {
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            radius: 5,
          };
          setUserLocation(newLocation);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setTimeout(() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const newLocation = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                      radius: 5,
                    };
                    setUserLocation(newLocation);
                  },
                  (retryError) => {
                    console.log("위치 권한 재요청 실패");
                  },
                  {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000,
                  }
                );
              }
            }, 1000); 
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    }
  }, [userLocation.lat, userLocation.lng]);

  useEffect(() => {
    if (userLocation.lat && userLocation.lng) {
      return;
    }

    const timer = setTimeout(() => {
      requestUserLocation();
    }, 100);

    return () => clearTimeout(timer);
  }, [requestUserLocation, userLocation.lat, userLocation.lng]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getCategories();
        if (!mounted) return;
        const map = {};
        (list || []).forEach((c) => {
          if (c?.name && c?.id != null) map[c.name] = c.id;
        });
        setCategoryNameToId(map);
      } catch (_) {}
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    fetchProductsData();
  }, [userLocation]);

  const fetchProductsData = useCallback(async () => {
    try {
      setLoading(true);

      let wishlistProducts = [];
      try {
        wishlistProducts = await getWishlistProducts();
      } catch (error) {
        wishlistProducts = [];
      }

      const wishlistProductIds = new Set(wishlistProducts.map((p) => p.id));

      const allProducts = await getAllProducts();

      const mappedAllProducts = await Promise.all(
        (allProducts || []).map(async (product) => {
          try {
            const storeId = product.store_id ?? product.store?.id;
            const storeInfo = storeId ? await getStoreInfo(storeId) : null;
            const resolvedStoreName =
              (storeInfo?.name && storeInfo.name.trim()) ||
              (product.store_name && String(product.store_name).trim()) ||
              (product.store?.name && String(product.store.name).trim()) ||
              "상점";

            const isLiked = wishlistProductIds.has(product.id);

            return {
              id: product.id,
              storeName: resolvedStoreName,
              productName: product.name,
              originalPrice: product.price,
              discountPrice: product.discount_price,
              imageUrl: product.image || "",
              isLiked: isLiked,
              categoryName: product.category_name,
              stock: product.stock || 0,
              store: {
                lat: product.store?.lat || product.lat,
                lng: product.store?.lng || product.lng,
                name: resolvedStoreName,
              },
              source: "temp",
            };
          } catch (_) {
            const resolvedStoreName =
              (product.store_name && String(product.store_name).trim()) ||
              (product.store?.name && String(product.store.name).trim()) ||
              "상점";

            const isLiked = wishlistProductIds.has(product.id);

            return {
              id: product.id,
              storeName: resolvedStoreName,
              productName: product.name,
              originalPrice: product.price,
              discountPrice: product.discount_price,
              imageUrl: product.image || "",
              isLiked: isLiked,
              categoryName: product.category_name,
              stock: product.stock || 0,
              store: {
                lat: product.store?.lat || product.lat,
                lng: product.store?.lng || product.lng,
                name: resolvedStoreName,
              },
              source: "temp",
            };
          }
        })
      );

      const allProductsForMap = [...mappedAllProducts];

      const uniqueProducts = [];
      const seenIds = new Set();

      const productsWithDistance = [];
      allProductsForMap.forEach((product) => {
        if (!seenIds.has(product.id)) {
          seenIds.add(product.id);

          const currentLat = userLocation.lat || 37.5665;
          const currentLng = userLocation.lng || 126.978;

          if (product.store && product.store.lat && product.store.lng) {
            const distance = Math.sqrt(
              Math.pow(product.store.lat - currentLat, 2) +
                Math.pow(product.store.lng - currentLng, 2)
            );

            productsWithDistance.push({
              ...product,
              distance: distance,
            });
          } else {
            productsWithDistance.push({
              ...product,
              distance: Infinity,
            });
          }
        }
      });

      productsWithDistance.sort((a, b) => a.distance - b.distance);

      productsWithDistance.forEach((product) => {
        const isNearby = product.distance <= 0.05;

        uniqueProducts.push({
          ...product,
          source: isNearby ? "nearby" : "all",
        });
      });

      const nearbyProducts = uniqueProducts.filter(
        (p) => p.source === "nearby"
      );

      setNearbyProducts(nearbyProducts);
      setAllNearbyProducts(uniqueProducts);
      setFilteredNearbyProducts(nearbyProducts);
    } catch (error) {
      console.error("상품 데이터 로드 실패:", error);
      setAllNearbyProducts([]);
    } finally {
      setLoading(false);
    }
  }, [userLocation]);

  const handleBottomSheetClose = () => {
    setBottomSheetOpen(false);
    setSelectedLocationInfo(null);
    setLocationProducts([]);
  };

  const handleProductClick = (productId) => {
    navigate(`/registeration/${productId}`);
  };

  const handleProductLikeToggle = async (productId, isLiked) => {
    try {
      await toggleWishlist(productId, isLiked);

      let wishlistProducts = [];
      try {
        wishlistProducts = await getWishlistProducts();
      } catch (error) {
        wishlistProducts = [];
      }
      const wishlistProductIds = new Set(wishlistProducts.map((p) => p.id));

      const updatedNearbyProducts = nearbyProducts.map((product) => {
        if (product.id === productId) {
          return { ...product, isLiked: wishlistProductIds.has(product.id) };
        }
        return product;
      });

      const updatedAllProducts = allNearbyProducts.map((product) => {
        if (product.id === productId) {
          return { ...product, isLiked: wishlistProductIds.has(product.id) };
        }
        return product;
      });

      const updatedLocationProducts = locationProducts.map((product) => {
        if (product.id === productId) {
          return { ...product, isLiked: wishlistProductIds.has(product.id) };
        }
        return product;
      });

      setNearbyProducts(updatedNearbyProducts);
      setAllNearbyProducts(updatedAllProducts);
      setFilteredNearbyProducts(updatedNearbyProducts);
      setLocationProducts(updatedLocationProducts);
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
    }
  };

  const handleMapClick = async (event) => {
    try {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      const clickedProducts = allNearbyProducts.filter((product) => {
        if (!product.store || !product.store.lat || !product.store.lng) {
          return false;
        }

        const distance = Math.sqrt(
          Math.pow(product.store.lat - lat, 2) +
            Math.pow(product.store.lng - lng, 2)
        );

        return distance <= 0.001;
      });

      if (clickedProducts.length === 0) {
        return;
      }

      setLocationProducts(clickedProducts);
      setSelectedLocationInfo({
        name: "주변 상품",
        type: "nearby",
        query: `위치: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      });
      setBottomSheetOpen(true);
    } catch (error) {
      console.error("지도 클릭 처리 오류:", error);
    }
  };

  const handleMarkerClick = async (markerData) => {
    try {
      setSelectedLocationInfo({
        name: markerData.name,
        type: "store",
        query: markerData.title,
      });

      let wishlistProducts = [];
      try {
        wishlistProducts = await getWishlistProducts();
      } catch (error) {
        wishlistProducts = [];
      }

      const clickedProducts = allNearbyProducts.filter((product) => {
        if (!product.store || !product.store.lat || !product.store.lng) {
          return false;
        }

        const distance = Math.sqrt(
          Math.pow(product.store.lat - markerData.position.lat, 2) +
            Math.pow(product.store.lng - markerData.position.lng, 2)
        );

        return distance <= 0.001;
      });

      setLocationProducts(clickedProducts);
      setBottomSheetOpen(true);
    } catch (_) {
      setLocationProducts([]);
      setSelectedLocationInfo({
        name: "주변 상품",
        type: "nearby",
        query: "오류",
      });
      setBottomSheetOpen(true);
    }
  };

  const handleClusterClick = async (cluster) => {
    try {
      const map = cluster.map;
      const bounds = new window.google.maps.LatLngBounds();

      const clusterPositions = [];
      cluster.markers.forEach((marker) => {
        const position = marker.getPosition();
        bounds.extend(position);
        clusterPositions.push({
          lat: position.lat(),
          lng: position.lng(),
        });
      });

      map.fitBounds(bounds);

      let allClusterProducts = [];

      for (const position of clusterPositions) {
        const clusterProducts = allNearbyProducts.filter((product) => {
          if (!product.store || !product.store.lat || !product.store.lng) {
            return false;
          }

          const distance = Math.sqrt(
            Math.pow(product.store.lat - position.lat, 2) +
              Math.pow(product.store.lng - position.lng, 2)
          );

          return distance <= 0.001;
        });

        if (clusterProducts.length > 0) {
          allClusterProducts.push(...clusterProducts);
        }
      }

      const uniqueProducts = allClusterProducts.filter(
        (product, index, self) =>
          index === self.findIndex((p) => p.id === product.id)
      );

      if (uniqueProducts.length > 0) {
        setLocationProducts(uniqueProducts);
        setSelectedLocationInfo({
          name: "클러스터 상품",
          type: "cluster",
          query: `${uniqueProducts.length}개 상품`,
        });
        setBottomSheetOpen(true);
      }
    } catch (error) {
      console.error("클러스터 클릭 처리 오류:", error);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Header userInfo={userInfo || { name: "사용자" }} title={"재고 지도"} />
        <Content>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              fontSize: "18px",
              color: "#666",
            }}
          >
            재고 데이터를 불러오는 중...
          </div>
        </Content>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header userInfo={userInfo || { name: "사용자" }} title={"재고 지도"} />

      <Content>
        <PageTitle>재고 지도</PageTitle>

        <MapContainer>
          <AdvancedGoogleMap
            onClick={handleMapClick}
            onMarkerClick={handleMarkerClick}
            onClusterClick={handleClusterClick}
            products={allNearbyProducts}
            userLocation={userLocation}
            markers={[]}
            showUserLocation={true}
            size="full"
          />
        </MapContainer>

        <BottomSheet
          isOpen={bottomSheetOpen}
          onClose={handleBottomSheetClose}
          location={selectedLocationInfo}
          products={locationProducts}
          onProductClick={handleProductClick}
          onProductLikeToggle={handleProductLikeToggle}
        />
      </Content>
    </PageContainer>
  );
};

export default InventoryMapPage;
