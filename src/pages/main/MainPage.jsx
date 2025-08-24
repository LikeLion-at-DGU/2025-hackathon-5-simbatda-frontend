import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/header/Header";
import SearchBar from "../../components/common/searchbar/SearchBar";
import CategoryChips from "../../components/common/chips/CategoryChips";
import AdvancedGoogleMap from "../../components/common/map/AdvancedGoogleMap";
import RecommendedProducts from "../../components/common/products/RecommendedProducts";
import SpecialPriceProducts from "../../components/common/products/SpecialPriceProducts";
import BottomSheet from "../../components/common/bottomsheet/BottomSheet";
import {
  getRecommendedProducts,
  getSpecialPriceProducts,
  getStoreInfo,
  getCategories,
  getAllProducts,
  toggleWishlist,
  getWishlistProducts,
} from "../../api/products";
import { PageContainer, Content } from "./MainPage.styles";

import { getConsumerMe } from "../../api/auth";

function MainPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [specialPriceProducts, setSpecialPriceProducts] = useState([]);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedLocationInfo, setSelectedLocationInfo] = useState(null);
  const [locationProducts, setLocationProducts] = useState([]);
  const [userLocation, setUserLocation] = useState({
    lat: null,
    lng: null,
    radius: 5,
  });
  const [loading, setLoading] = useState(true);
  const [categoryNameToId, setCategoryNameToId] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [nearbyProducts, setNearbyProducts] = useState([]); 
  const [allNearbyProducts, setAllNearbyProducts] = useState([]); 
  const [filteredNearbyProducts, setFilteredNearbyProducts] = useState([]);
  const navigate = useNavigate();

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
    fetchProductsData();
  }, [userLocation]);

  const fetchProductsData = useCallback(async () => {
    try {
      setLoading(true);

      const currentLocation = {
        lat: userLocation.lat || 37.5665,
        lng: userLocation.lng || 126.978,
        radius: userLocation.radius || 5,
      };

      let wishlistProducts = [];
      try {
        wishlistProducts = await getWishlistProducts();
      } catch (error) {
        wishlistProducts = [];
      }

      const wishlistProductIds = new Set(wishlistProducts.map((p) => p.id));

      const rec = await getRecommendedProducts(
        currentLocation.lat,
        currentLocation.lng
      );
      const mappedRec = await Promise.all(
        (rec || []).map(async (product) => {
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
            };
          }
        })
      );
      setRecommendedProducts(mappedRec);

      const specialPrice = await getSpecialPriceProducts(
        currentLocation.lat,
        currentLocation.lng
      );

      const mappedSpecialPrice = await Promise.all(
        (specialPrice || []).map(async (product) => {
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
            };
          }
        })
      );
      setSpecialPriceProducts(mappedSpecialPrice);

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
              store: {
                lat: product.store?.lat || product.lat,
                lng: product.store?.lng || product.lng,
                name: resolvedStoreName,
              },
              source: "nearby",
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
              store: {
                lat: product.store?.lat || product.lat,
                lng: product.store?.lng || product.lng,
                name: resolvedStoreName,
              },
              source: "nearby",
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
      setRecommendedProducts([]);
      setSpecialPriceProducts([]);
      setAllNearbyProducts([]);
      setFilteredNearbyProducts([]);
    } finally {
      setLoading(false);
    }
  }, [userLocation]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);

    if (!searchTerm.trim()) {
      setFilteredNearbyProducts(nearbyProducts);
      return;
    }

    const filtered = nearbyProducts.filter(
      (product) =>
        (product.productName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (product.storeName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (product.categoryName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    setFilteredNearbyProducts(filtered);

    setLocationProducts(filtered);
    setSelectedLocationInfo({
      name: "검색상품",
      type: "search",
      query: searchTerm,
    });
    setBottomSheetOpen(true);
  };

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);

    let filtered;
    if (categoryName === "전체") {
      filtered = nearbyProducts;
    } else {
      filtered = nearbyProducts.filter(
        (product) => product.categoryName === categoryName
      );
    }

    setFilteredNearbyProducts(filtered);

    setLocationProducts(filtered);
    setSelectedLocationInfo({ name: categoryName, type: "category" });
    setBottomSheetOpen(true);
  };

  const handleMapClick = async (event) => {
    try {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      const clickedProducts = allNearbyProducts.filter((product) => {
        if (!product.store) return false;

        const distance = Math.sqrt(
          Math.pow(product.store.lat - lat, 2) +
            Math.pow(product.store.lng - lng, 2)
        );

        return distance < 0.0001;
      });

      if (clickedProducts.length === 0) {
        return;
      }

      let wishlistProducts = [];
      try {
        wishlistProducts = await getWishlistProducts();
      } catch (error) {
        wishlistProducts = [];
      }
      const wishlistProductIds = new Set(wishlistProducts.map((p) => p.id));

      const mappedProducts = clickedProducts.map((product) => ({
        id: product.id,
        storeName: product.storeName,
        productName: product.productName,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        imageUrl: product.imageUrl || "",
        isLiked: wishlistProductIds.has(product.id),
        source: product.source,
      }));

      setLocationProducts(mappedProducts);
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
      const wishlistProductIds = new Set(wishlistProducts.map((p) => p.id));

      const markerProducts = allNearbyProducts.filter((product) => {
        if (!product.store) return false;

        const distance = Math.sqrt(
          Math.pow(product.store.lat - markerData.position.lat, 2) +
            Math.pow(product.store.lng - markerData.position.lng, 2)
        );

        return distance < 0.0001;
      });

      if (markerProducts.length === 0) {
        return;
      }

      const mappedProducts = markerProducts.map((product) => ({
        id: product.id,
        storeName: product.storeName,
        productName: product.productName,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        imageUrl: product.imageUrl || "",
        isLiked: wishlistProductIds.has(product.id),
        source: product.source,
      }));

      setLocationProducts(mappedProducts);
      setBottomSheetOpen(true);
    } catch (error) {
      console.error("마커 클릭 처리 오류:", error);
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

      let wishlistProducts = [];
      try {
        wishlistProducts = await getWishlistProducts();
      } catch (error) {
        wishlistProducts = [];
      }

      let allClusterProducts = [];

      for (const position of clusterPositions) {
        const clusterProducts = allNearbyProducts.filter((product) => {
          if (!product.store) return false;

          const distance = Math.sqrt(
            Math.pow(product.store.lat - position.lat, 2) +
              Math.pow(product.store.lng - position.lng, 2)
          );

          return distance < 0.0001;
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

  const handleBottomSheetClose = () => {
    setBottomSheetOpen(false);
    setSelectedLocationInfo(null);
    setLocationProducts([]);

    setSearchTerm("");
    setFilteredNearbyProducts(nearbyProducts);
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

      const updatedFilteredNearbyProducts = filteredNearbyProducts.map(
        (product) => {
          if (product.id === productId) {
            return { ...product, isLiked: wishlistProductIds.has(product.id) };
          }
          return product;
        }
      );

      setNearbyProducts(updatedNearbyProducts);
      setAllNearbyProducts(updatedAllProducts);
      setFilteredNearbyProducts(updatedFilteredNearbyProducts);
      setLocationProducts(updatedLocationProducts);
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Header userInfo={userInfo} />
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
            상품을 불러오는 중...
          </div>
        </Content>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header userInfo={userInfo} />

      <Content>
        <SearchBar
          onSearch={handleSearch}
          onChange={setSearchTerm}
          value={searchTerm}
        />
        <CategoryChips
          onCategoryChange={handleCategoryChange}
          initialCategory={selectedCategory}
        />
        <AdvancedGoogleMap
          onClick={handleMapClick}
          onMarkerClick={handleMarkerClick}
          onClusterClick={handleClusterClick}
          products={allNearbyProducts}
          userLocation={userLocation}
          markers={[]}
          showUserLocation={true}
        />
        <RecommendedProducts
          products={recommendedProducts}
          name={userInfo?.name || "사용자"}
          onProductLikeToggle={handleProductLikeToggle}
        />
        <SpecialPriceProducts
          products={specialPriceProducts}
          onProductLikeToggle={handleProductLikeToggle}
        />
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
}

export default MainPage;
