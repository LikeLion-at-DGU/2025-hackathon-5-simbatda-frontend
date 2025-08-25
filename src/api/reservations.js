import { apiRequest } from "./client";

// 주문내역 조회 API
export const getReservations = async () => {
  try {
    const response = await apiRequest(`/reservations/`, {
      method: "GET",
      auth: true,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`주문내역 API 오류 상세:`, {
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
    console.error("주문내역 조회 오류:", error);
    throw error;
  }
};

// 주문내역 상세 조회 API
export const getReservationDetail = async (reservationId) => {
  try {
    const response = await apiRequest(`/reservations/${reservationId}/`, {
      method: "GET",
      auth: true,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("주문내역 상세 조회 오류:", error);
    throw error;
  }
};

// 주문내역 취소 API
export const cancelReservation = async (reservationId, reason) => {
  try {
    const payload = { cancel_reason: reason };
    const response = await apiRequest(
      `/reservations/${reservationId}/cancel/`,
      {
        method: "POST",
        auth: true,
        body: payload,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`주문내역 취소 API 오류 상세:`, {
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
    console.error("주문내역 취소 오류:", error);
    throw error;
  }
};

// 소비자 예약 알림 조회 API
export const getNotifications = async () => {
  try {
    const response = await apiRequest(`/reservations/notifications/`, {
      method: "GET",
      auth: true,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`알림 조회 API 오류:`, {
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
    console.error("알림 조회 오류:", error);
    throw error;
  }
};

// 알림 읽음 처리 API
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiRequest(
      `/reservations/notifications/${notificationId}/read/`,
      {
        method: "PATCH",
        auth: true,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`알림 읽음 처리 API 오류:`, {
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
    console.error("알림 읽음 처리 오류:", error);
    throw error;
  }
};
