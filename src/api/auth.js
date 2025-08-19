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
