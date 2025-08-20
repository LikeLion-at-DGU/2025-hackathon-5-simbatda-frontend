import {
  apiRequest,
  setStoredTokens,
  clearStoredTokens,
  getStoredTokens,
} from "./client";

const endpoints = {
  consumer: {
    signup: "/accounts/consumer/signup/",
    login: "/accounts/consumer/login/",
    me: "/accounts/consumer/me/",
  },
  seller: {
    signup: "/accounts/seller/signup/",
    login: "/accounts/seller/login/",
    me: "/accounts/seller/me/",
  },
  token: {
    refresh: "/accounts/token/refresh/",
    logout: "/accounts/logout/",
  },
};

export async function consumerSignup(payload) {
  const res = await apiRequest(endpoints.consumer.signup, {
    method: "POST",
    body: payload,
  });

  const data = await res.json();

  if (res.status === 409) {
    throw { email: data.email };
  }

  if (!res.ok) {
    console.error("Consumer signup failed:", data);
    throw data;
  }

  const { auth, user } = data;
  if (auth?.accessToken && auth?.refreshToken) {
    setStoredTokens(auth.accessToken, auth.refreshToken);
    // 사용자 정보 저장 (소비자 역할)
    localStorage.setItem(
      "userInfo",
      JSON.stringify({ ...user, role: "consumer" })
    );
  }
  return data;
}

export async function consumerLogin(payload) {
  const res = await apiRequest(endpoints.consumer.login, {
    method: "POST",
    body: payload,
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Consumer login failed:", data);
    throw data;
  }

  const { auth, user } = data;
  if (auth?.accessToken && auth?.refreshToken) {
    setStoredTokens(auth.accessToken, auth.refreshToken);
    // 사용자 정보 저장 (소비자 역할)
    localStorage.setItem(
      "userInfo",
      JSON.stringify({ ...user, role: "consumer" })
    );
  }
  return data;
}

export async function sellerSignup(payload) {
  const res = await apiRequest(endpoints.seller.signup, {
    method: "POST",
    body: payload,
  });

  const data = await res.json();

  if (res.status === 409) {
    throw {
      error: "EMAIL_ALREADY_EXISTS",
      message: "이미 등록된 이메일입니다.",
    };
  }

  if (!res.ok) {
    console.error("Seller signup failed:", data);
    throw data;
  }

  const { auth, user } = data;
  if (auth?.accessToken && auth?.refreshToken) {
    setStoredTokens(auth.accessToken, auth.refreshToken);
    // 사용자 정보 저장 (판매자 역할)
    localStorage.setItem(
      "userInfo",
      JSON.stringify({ ...user, role: "seller" })
    );
  }
  return data;
}

export async function sellerLogin(payload) {
  const res = await apiRequest(endpoints.seller.login, {
    method: "POST",
    body: payload,
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Seller login failed:", data);
    throw data;
  }

  const { auth, user } = data;
  if (auth?.accessToken && auth?.refreshToken) {
    setStoredTokens(auth.accessToken, auth.refreshToken);
    // 사용자 정보 저장 (판매자 역할)
    localStorage.setItem(
      "userInfo",
      JSON.stringify({ ...user, role: "seller" })
    );
  }
  return data;
}

export async function logout() {
  const { refreshToken } = getStoredTokens();
  if (!refreshToken) return true;

  const res = await apiRequest(endpoints.token.logout, {
    method: "POST",
    auth: true,
    body: { refresh: refreshToken },
  });

  if (res.status === 204 || res.ok) {
    clearStoredTokens();
    // 사용자 정보도 제거
    localStorage.removeItem("userInfo");
    return true;
  }

  const data = await res.json().catch(() => ({}));
  throw data;
}

export async function getConsumerMe() {
  const res = await apiRequest(endpoints.consumer.me, { auth: true });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function getSellerMe() {
  const mockApi = (await import("../mocks/mockApi.js")).default;
  const response = await mockApi.getSellerMe();
  return response.data;
}

// 상점 정보 저장 API - 1단계
export async function createStore(storeData) {
  const res = await apiRequest("/stores/signup/step1/", {
    method: "POST",
    auth: true,
    body: {
      store_name: storeData.name,
      opening_time: storeData.opening_hours,
      address_search: storeData.address,
      address_detail: storeData.address_detail || "",
      latitude: 37.5665, // 임시 위도 (실제로는 주소 검색 API에서 가져와야 함)
      longitude: 126.978, // 임시 경도 (실제로는 주소 검색 API에서 가져와야 함)
    },
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Store creation failed:", data);
    throw data;
  }
  return data;
}

// 서류 업로드 API - 2단계
export async function uploadDocuments(documents, storeId) {
  const formData = new FormData();
  formData.append("store_id", storeId);

  if (documents.bizReg) {
    formData.append("business_license", documents.bizReg);
  }
  if (documents.permit) {
    formData.append("permit_doc", documents.permit);
  }
  if (documents.bankbook) {
    formData.append("bank_copy", documents.bankbook);
  }

  const res = await apiRequest("/stores/signup/step2/", {
    method: "POST",
    auth: true,
    body: formData,
  });

  let data;
  try {
    data = await res.json();
  } catch (parseError) {
    console.error("Failed to parse response as JSON:", parseError);
    throw new Error(
      "서버에서 잘못된 응답 형식을 받았습니다. 백엔드 서버 상태를 확인해주세요."
    );
  }

  if (!res.ok) {
    console.error("Document upload failed:", data);
    throw data;
  }
  return data;
}

// 판매자 주문 목록 조회 API
export async function getSellerOrders(status = null) {
  let url = "/reservations/";
  if (status) {
    url += `?status=${status}`;
  }

  const res = await apiRequest(url, {
    method: "GET",
    auth: true,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error("Failed to fetch seller orders:", data);
    throw data;
  }

  return await res.json();
}

// 주문 수락 API
export async function acceptOrder(orderId) {
  const res = await apiRequest(`/reservations/${orderId}/confirm/`, {
    method: "PATCH",
    auth: true,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error("Failed to accept order:", data);
    throw data;
  }

  return await res.json();
}

// 주문 거절 API
export async function rejectOrder(orderId, rejectReason) {
  const res = await apiRequest(`/reservations/${orderId}/`, {
    method: "PATCH",
    auth: true,
    body: {
      status: "cancel",
      reject_reason: rejectReason,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error("Failed to reject order:", data);
    throw data;
  }

  return await res.json();
}

// 상점 영업 상태 변경 API
export async function toggleStoreStatus() {
  console.log("toggleStoreStatus API 호출 시작");

  const res = await apiRequest("/stores/is_open/", {
    method: "PATCH",
    auth: true,
  });

  console.log("toggleStoreStatus API 응답 상태:", res.status);
  console.log("toggleStoreStatus API 응답 헤더:", res.headers);

  const data = await res.json().catch(() => ({}));

  // 비정상 상태 코드 처리
  if (!res.ok) {
    console.error("Failed to toggle store status:", data);
    throw new Error(
      data?.detail || data?.detal || "영업 상태 변경에 실패했습니다."
    );
  }

  // 200이라도 백엔드가 detail/detal을 내려보내는 경우(상점 없음 등) 처리
  if (typeof data?.is_open !== "boolean") {
    const msg =
      data?.detail ||
      data?.detal ||
      "상점 정보가 없습니다. 상점 등록을 먼저 완료하세요.";
    console.error("잘못된 토글 응답:", data);
    throw new Error(msg);
  }

  console.log("toggleStoreStatus API 응답 데이터:", data);
  return data;
}

// 판매자 상점 정보 조회 API
export async function getSellerStore() {
  const res = await apiRequest("/stores/", { auth: true });
  if (!res.ok) {
    throw new Error("Failed to fetch store info");
  }
  return res.json();
}

// 판매자 상품 목록 조회 API
export async function getSellerProducts() {
  const res = await apiRequest("/products/", { auth: true });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

// 새 상품 등록 API
export async function createProduct(productData) {
  const formData = new FormData();

  // FormData가 이미 전달된 경우 그대로 사용
  if (productData instanceof FormData) {
    const res = await apiRequest("/products/", {
      method: "POST",
      auth: true,
      body: productData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.detail || errorData.message || "Failed to create product"
      );
    }

    return res.json();
  }

  // 일반 객체인 경우 FormData로 변환
  formData.append("name", productData.name);
  formData.append("price", productData.price);
  formData.append("discount_price", productData.discount_price);
  formData.append("description", productData.description || "");
  formData.append("category", productData.category || 1);
  formData.append("stock", productData.stock || 1);
  formData.append("expiration_date", productData.expiration_date);

  // 이미지가 있으면 추가
  if (productData.image) {
    formData.append("image", productData.image);
  }

  const res = await apiRequest("/products/", {
    method: "POST",
    auth: true,
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to create product"
    );
  }

  return res.json();
}

// 상품 수정 API
export async function updateProduct(productId, productData) {
  const formData = new FormData();

  // FormData가 이미 전달된 경우 그대로 사용
  if (productData instanceof FormData) {
    const res = await apiRequest(`/products/${productId}/`, {
      method: "PUT",
      auth: true,
      body: productData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.detail || errorData.message || "Failed to update product"
      );
    }

    return res.json();
  }

  // 일반 객체인 경우 FormData로 변환
  formData.append("name", productData.name);
  formData.append("price", productData.price);
  formData.append("discount_price", productData.discount_price);
  formData.append("description", productData.description || "");
  formData.append("category", productData.category || 1);
  formData.append("stock", productData.stock || 1);
  formData.append("expiration_date", productData.expiration_date);

  // 이미지가 있으면 추가
  if (productData.image) {
    formData.append("image", productData.image);
  }

  const res = await apiRequest(`/products/${productId}/`, {
    method: "PUT",
    auth: true,
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to update product"
    );
  }

  return res.json();
}

// 상품 삭제 API
export async function deleteProduct(productId) {
  const res = await apiRequest(`/products/${productId}/`, {
    method: "DELETE",
    auth: true,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to delete product"
    );
  }

  return { success: true };
}

// 카테고리 목록 조회 API
export async function getCategories() {
  const res = await apiRequest("/categories/", { auth: false });
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  return res.json();
}
