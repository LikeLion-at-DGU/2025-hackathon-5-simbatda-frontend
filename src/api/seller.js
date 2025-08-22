import { apiRequest } from "./client";

export async function getSellerMe() {
  const res = await apiRequest("/accounts/seller/me/", {
    method: "GET",
    auth: true,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Failed to fetch seller info");
  }

  return await res.json();
}

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

export async function rejectOrder(orderId, rejectReason) {
  const res = await apiRequest(`/reservations/${orderId}/cancel/`, {
    method: "PATCH",
    auth: true,
    body: {
      cancel_reason: rejectReason,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error("Failed to reject order:", data);
    throw data;
  }

  return await res.json();
}

export async function markOrderReady(orderId) {
  const res = await apiRequest(`/reservations/${orderId}/ready/`, {
    method: "PATCH",
    auth: true,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error("Failed to mark order ready:", data);
    throw data;
  }

  return await res.json();
}

export async function markOrderPickup(orderId) {
  const res = await apiRequest(`/reservations/${orderId}/pickup/`, {
    method: "PATCH",
    auth: true,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error("Failed to mark order pickup:", data);
    throw data;
  }

  return await res.json();
}

export async function toggleStoreStatus() {
  console.log("toggleStoreStatus API 호출 시작");

  const res = await apiRequest("/stores/is_open/", {
    method: "PATCH",
    auth: true,
  });

  console.log("toggleStoreStatus API 응답 상태:", res.status);
  console.log("toggleStoreStatus API 응답 헤더:", res.headers);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("Failed to toggle store status:", data);
    throw new Error(
      data?.detail || data?.detal || "영업 상태 변경에 실패했습니다."
    );
  }

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

export async function getSellerStore() {
  const res = await apiRequest("/stores/", { auth: true });
  if (!res.ok) {
    throw new Error("Failed to fetch store info");
  }
  return res.json();
}

export async function getProductById(productId) {
  const res = await apiRequest(`/products/${productId}/`, {
    method: "GET",
    auth: true,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error("Failed to get product:", data);
    throw data;
  }
  return await res.json();
}

export async function getSellerProducts() {
  const res = await apiRequest("/products/", { auth: true });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));

    if (res.status === 500) {
      throw new Error("백엔드 서버 오류 (500): HTML");
    }

    throw new Error(errorData.detail || "Failed to fetch products");
  }
  return res.json();
}

export async function createProduct(productData) {
  const formData = new FormData();

  if (productData instanceof FormData) {
    const res = await apiRequest("/products/", {
      method: "POST",
      auth: true,
      body: productData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("상품 생성 API 에러 상세:", {
        status: res.status,
        statusText: res.statusText,
        errorData: errorData,
        response: res,
      });
      throw new Error(
        errorData.detail || errorData.message || "Failed to create product"
      );
    }

    return res.json();
  }

  formData.append("name", productData.name);
  formData.append("price", productData.price);
  formData.append("discount_price", productData.discount_price);
  formData.append("description", productData.description || "");
  formData.append("category", productData.category || 1);
  formData.append("stock", productData.stock || 1);
  formData.append("expiration_date", productData.expiration_date);

  if (productData.image) {
    formData.append("image", productData.image);
  }

  console.log("상품 생성 요청 데이터:", {
    name: productData.name,
    price: productData.price,
    discount_price: productData.discount_price,
    category: productData.category,
    stock: productData.stock,
    expiration_date: productData.expiration_date,
    hasImage: !!productData.image,
  });

  const res = await apiRequest("/products/", {
    method: "POST",
    auth: true,
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("상품 생성 API 에러 상세:", {
      status: res.status,
      statusText: res.statusText,
      errorData: errorData,
      response: res,
    });

    const error = new Error(
      errorData.detail || errorData.message || "Failed to create product"
    );
    error.response = res;
    throw error;
  }

  return res.json();
}

export async function updateProduct(productId, productData) {
  console.log("updateProduct 호출됨 - 상품 ID:", productId);
  console.log("전송할 데이터:", productData);

  const formData = new FormData();

  if (productData instanceof FormData) {
    console.log("FormData로 업데이트");
    const res = await apiRequest(`/products/${productId}/`, {
      method: "PUT",
      auth: true,
      body: productData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("FormData 업데이트 실패:", errorData);
      throw new Error(
        errorData.detail || errorData.message || "Failed to update product"
      );
    }

    return await res.json();
  }

  console.log("일반 데이터로 업데이트");
  formData.append("name", productData.name);
  formData.append("price", productData.price);
  formData.append("discount_price", productData.discount_price);
  formData.append("description", productData.description || "");
  formData.append("category", productData.category || 1);
  formData.append("stock", productData.stock || 1);
  formData.append("expiration_date", productData.expiration_date);

  if (productData.image && productData.image instanceof File) {
    formData.append("image", productData.image);
  }

  console.log("FormData 내용:");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  const res = await apiRequest(`/products/${productId}/`, {
    method: "PUT",
    auth: true,
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("일반 데이터 업데이트 실패:", errorData);
    throw new Error(
      errorData.detail || errorData.message || "Failed to update product"
    );
  }

  return await res.json();
}

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
export async function getProductStock(productId) {
  const res = await apiRequest(`/products/${productId}/`, {
    method: "GET",
    auth: true,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error("Failed to get product stock:", data);
    throw data;
  }

  const product = await res.json();
  return {
    id: product.id,
    name: product.name,
    stock: product.stock,
    is_active: product.is_active,
  };
}

export async function getReservationDetail(reservationId) {
  const res = await apiRequest(`/reservations/${reservationId}/`, {
    method: "GET",
    auth: true,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error("Failed to get reservation detail:", data);
    throw data;
  }

  return await res.json();
}
