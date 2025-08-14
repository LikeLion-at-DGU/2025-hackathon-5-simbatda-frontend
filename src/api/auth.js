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

  if (res.status === 409) {
    const data = await res.json();
    throw { email: data.email };
  }

  const data = await res.json();
  if (!res.ok) throw data;

  const { auth } = data;
  if (auth?.accessToken && auth?.refreshToken) {
    setStoredTokens(auth.accessToken, auth.refreshToken);
  }
  return data;
}

export async function consumerLogin(payload) {
  const res = await apiRequest(endpoints.consumer.login, {
    method: "POST",
    body: payload,
  });

  const data = await res.json();
  if (!res.ok) throw data;

  const { auth } = data;
  if (auth?.accessToken && auth?.refreshToken) {
    setStoredTokens(auth.accessToken, auth.refreshToken);
  }
  return data;
}

export async function sellerSignup(payload) {
  const res = await apiRequest(endpoints.seller.signup, {
    method: "POST",
    body: payload,
  });

  if (res.status === 409) {
    throw {
      error: "EMAIL_ALREADY_EXISTS",
      message: "이미 등록된 이메일입니다.",
    };
  }

  const data = await res.json();
  if (!res.ok) throw data;

  const { auth } = data;
  if (auth?.accessToken && auth?.refreshToken) {
    setStoredTokens(auth.accessToken, auth.refreshToken);
  }
  return data;
}

export async function sellerLogin(payload) {
  const res = await apiRequest(endpoints.seller.login, {
    method: "POST",
    body: payload,
  });

  const data = await res.json();
  if (!res.ok) throw data;

  const { auth } = data;
  if (auth?.accessToken && auth?.refreshToken) {
    setStoredTokens(auth.accessToken, auth.refreshToken);
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
  const res = await apiRequest(endpoints.seller.me, { auth: true });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
