// 프록시를 사용하여 CORS 문제 해결
const API_BASE_URL = "https://yeonhee.shop"; // 임시로 직접 백엔드 사용

export const getStoredTokens = () => {
  try {
    const accessToken = localStorage.getItem("accessToken") || "";
    const refreshToken = localStorage.getItem("refreshToken") || "";
    return { accessToken, refreshToken };
  } catch {
    return { accessToken: "", refreshToken: "" };
  }
};

export const setStoredTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

export const clearStoredTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

async function refreshAccessToken() {
  const { refreshToken } = getStoredTokens();
  if (!refreshToken) return null;

  const res = await fetch(`${API_BASE_URL}/accounts/token/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const newAccess = data?.access;
  if (newAccess) setStoredTokens(newAccess, refreshToken);
  return newAccess || null;
}

export async function apiRequest(
  path,
  { method = "GET", body, auth = false, headers = {} } = {}
) {
  const url = `${API_BASE_URL}${path}`;
  const tokenSet = getStoredTokens();

  // FormData인지 확인하여 Content-Type 설정
  const isFormData = body instanceof FormData;
  const baseHeaders = { ...headers };

  if (!isFormData) {
    baseHeaders["Content-Type"] = "application/json";
  }

  if (auth && tokenSet.accessToken) {
    baseHeaders.Authorization = `Bearer ${tokenSet.accessToken}`;
  }

  const response = await fetch(url, {
    method,
    headers: baseHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      const htmlText = await response.text();
      throw new Error(
        `백엔드 서버 오류 (${response.status}): HTML 응답을 받았습니다. 서버 상태를 확인해주세요.`
      );
    }
  }

  if (response.status === 401 && auth) {
    const cloned = await response
      .clone()
      .json()
      .catch(() => null);
    const code = cloned?.code || cloned?.detail;
    if (
      code === "token_not_valid" ||
      String(code).toLowerCase().includes("token")
    ) {
      const newAccess = await refreshAccessToken();
      if (newAccess) {
        const retryHeaders = {
          ...baseHeaders,
          Authorization: `Bearer ${newAccess}`,
        };
        const retry = await fetch(url, {
          method,
          headers: retryHeaders,
          body: body ? JSON.stringify(body) : undefined,
        });
        return retry;
      }
    }
  }

  return response;
}
