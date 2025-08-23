import { apiRequest } from "./client";

// 특가 상품 조회 API
export const getSpecialPriceProducts = async (
  lat = 37.498095,
  lng = 127.02761,
  radius = 5
) => {
  try {
    const queryParams = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radius: radius.toString(),
    });

    const response = await apiRequest(`/products/discount/?${queryParams}`, {
      method: "GET",
      auth: true,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`특가 상품 API 오류 상세:`, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        response: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("특가 상품 조회 오류:", error);
    throw error;
  }
};

// 근처 상품 조회 API
export const getNearbyProducts = async (
  lat = 37.498095,
  lng = 127.02761,
  radius = 5,
  search = "",
  category
) => {
  try {
    const queryParams = new URLSearchParams({
      lat: lat?.toString?.() ?? "",
      lng: lng?.toString?.() ?? "",
      radius: radius?.toString?.() ?? "",
    });

    if (search && search.trim().length > 0) {
      queryParams.set("search", search.trim());
    }

    if (
      category !== undefined &&
      category !== null &&
      String(category).trim() !== ""
    ) {
      queryParams.set("category", String(category));
    }

    const qs = queryParams.toString();
    const url = qs.length > 0 ? `/products/nearby/?${qs}` : `/products/nearby/`;

    const response = await apiRequest(url, {
      method: "GET",
      auth: true,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`근처 상품 API 오류 상세:`, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        response: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("근처 상품 조회 오류:", error);
    throw error;
  }
};

// 카테고리별 상품 조회 API
export const getProductsByCategory = async (
  categoryId,
  lat = 37.498095,
  lng = 127.02761,
  radius = 5
) => {
  try {
    const queryParams = new URLSearchParams({
      category: categoryId?.toString?.() ?? "",
      lat: lat.toString(),
      lng: lng.toString(),
      radius: radius.toString(),
    });

    const response = await apiRequest(`/products/?${queryParams}`, {
      method: "GET",
      auth: true,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`카테고리별 상품 API 오류 상세:`, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        response: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("카테고리별 상품 조회 오류:", error);
    throw error;
  }
};

// 전체 상품 목록 조회 API (위도/경도 파라미터 없음)
export const getAllProducts = async () => {
  try {
    const response = await apiRequest(`/products/`, {
      method: "GET",
      auth: true,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`전체 상품 API 오류 상세:`, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        response: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("전체 상품 조회 오류:", error);
    throw error;
  }
};

// 추천 상품 조회 API (소비자 추천 엔드포인트 사용)
export const getRecommendedProducts = async () => {
  try {
    const response = await apiRequest(`/accounts/consumer/recommends/`, {
      method: "GET",
      auth: true,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`추천 상품 API 오류 상세:`, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        response: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("추천 상품 조회 오류:", error);
    throw error;
  }
};

// 상품 상세 조회 API
export const getProductDetail = async (productId) => {
  try {
    const response = await apiRequest(`/products/${productId}/`, {
      method: "GET",
      auth: true,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("상품 상세 조회 오류:", error);
    throw error;
  }
};

// 상점 정보 조회 API
export const getStoreInfo = async (storeId) => {
  try {
    const response = await apiRequest(`/stores/${storeId}/`, {
      method: "GET",
      auth: true,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("상점 정보 조회 오류:", error);
    throw error;
  }
};

// 상점 상품 목록 조회 API
export const getStoreProducts = async (storeId) => {
  try {
    let response;

    // 1차 시도: /stores/{id}/products/
    try {
      response = await apiRequest(`/stores/${storeId}/products/`, {
        method: "GET",
        auth: true,
      });
    } catch (err) {
      try {
        response = await apiRequest(`/products/?store=${storeId}`, {
          method: "GET",
          auth: true,
        });
      } catch (err2) {
        response = await apiRequest(`/products/?store_id=${storeId}`, {
          method: "GET",
          auth: true,
        });
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`상점 상품 목록 API 오류 상세:`, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        response: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    let items = [];
    if (Array.isArray(data)) {
      items = data;
    } else if (data && Array.isArray(data.results)) {
      items = data.results;
    } else if (data && Array.isArray(data.data)) {
      items = data.data;
    } else if (data && Array.isArray(data.items)) {
      items = data.items;
    }

    const sid = Number(storeId);
    const filtered = (items || []).filter((p) => {
      const s = p.store;
      return s === sid || (s && typeof s === "object" && Number(s.id) === sid);
    });

    return filtered;
  } catch (error) {
    console.error("상점 상품 목록 조회 오류:", error);
    return [];
  }
};

// 카테고리 목록 조회 API
export const getCategories = async () => {
  try {
    const response = await apiRequest(`/categories/`, {
      method: "GET",
      auth: true,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`카테고리 목록 API 오류 상세:`, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        response: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("카테고리 목록 조회 오류:", error);
    return [];
  }
};

// 예약 생성 API
export const createReservation = async ({ productId, quantity }) => {
  try {
    const payload = { product: productId, quantity };
    const response = await apiRequest(`/reservations/`, {
      method: "POST",
      auth: true,
      body: payload,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`예약 생성 API 오류 상세:`, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        response: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("예약 생성 오류:", error);
    throw error;
  }
};

// 찜 등록/해제 API
export const toggleWishlist = async (productId, wishlisted) => {
  try {
    const response = await apiRequest(`/products/${productId}/wishlist/`, {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        product_id: productId,
        wishlisted: wishlisted,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`찜 ${wishlisted ? "등록" : "해제"} API 오류:`, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        response: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`찜 ${wishlisted ? "등록" : "해제"} 오류:`, error);
    throw error;
  }
};

// 찜 목록 조회 API
export const getWishlistProducts = async () => {
  try {
    const response = await apiRequest(`/products/wishlist/`, {
      method: "GET",
      auth: true,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`찜 목록 조회 API 오류:`, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        response: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`찜 목록 조회 오류:`, error);
    throw error;
  }
};
