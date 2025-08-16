import {
  mockUsers,
  mockStores,
  mockCategories,
  mockProducts,
  mockInventoryHistory,
  mockOrders,
  mockNotifications,
} from "./MockData.js";

// API 응답 지연 시뮬레이션 (실제 네트워크 지연과 유사하게)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 에러 시뮬레이션
const simulateError = (probability = 0.1) => {
  if (Math.random() < probability) {
    throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
};

// Mock API 서비스 클래스
class MockApiService {
  constructor() {
    this.users = [...mockUsers.general, ...mockUsers.seller];
    this.stores = [...mockStores];
    this.categories = [...mockCategories];
    this.products = [...mockProducts];
    this.inventoryHistory = [...mockInventoryHistory];
    this.orders = [...mockOrders];
    this.notifications = [...mockNotifications];
  }

  // ===== 인증 관련 API =====
  async login(email, password) {
    await delay(800);
    simulateError(0.05);

    const user = this.users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    return {
      success: true,
      user: { ...user, password: undefined }, // 비밀번호 제거
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
    };
  }

  async signup(userData) {
    await delay(1000);
    simulateError(0.05);

    // 이메일 중복 확인
    if (this.users.find((u) => u.email === userData.email)) {
      throw new Error("이미 사용 중인 이메일입니다.");
    }

    const newUser = {
      id: this.users.length + 1,
      ...userData,
      createdAt: new Date().toISOString().split("T")[0],
      lastLoginAt: new Date().toISOString(),
    };

    this.users.push(newUser);

    return {
      success: true,
      user: { ...newUser, password: undefined },
      message: "회원가입이 완료되었습니다.",
    };
  }

  // ===== 매장 관련 API =====
  async getStores(filters = {}) {
    await delay(500);
    simulateError(0.03);

    let filteredStores = [...this.stores];

    if (filters.businessType) {
      filteredStores = filteredStores.filter(
        (store) => store.businessType === filters.businessType
      );
    }

    if (filters.isOpen !== undefined) {
      filteredStores = filteredStores.filter(
        (store) => store.isOpen === filters.isOpen
      );
    }

    return {
      success: true,
      data: filteredStores,
      total: filteredStores.length,
    };
  }

  async getStoreById(storeId) {
    await delay(300);
    simulateError(0.02);

    const store = this.stores.find((s) => s.id === parseInt(storeId));
    if (!store) {
      throw new Error("매장을 찾을 수 없습니다.");
    }

    return {
      success: true,
      data: store,
    };
  }

  async createStore(storeData, sellerId) {
    await delay(1200);
    simulateError(0.05);

    const newStore = {
      id: this.stores.length + 1,
      sellerId,
      ...storeData,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      isOpen: true,
      rating: 0,
      reviewCount: 0,
    };

    this.stores.push(newStore);

    return {
      success: true,
      data: newStore,
      message: "매장이 성공적으로 등록되었습니다.",
    };
  }

  // ===== 상품 관련 API =====
  async getProducts(filters = {}) {
    await delay(600);
    simulateError(0.03);

    let filteredProducts = [...this.products];

    if (filters.storeId) {
      filteredProducts = filteredProducts.filter(
        (product) => product.storeId === parseInt(filters.storeId)
      );
    }

    if (filters.categoryId) {
      filteredProducts = filteredProducts.filter(
        (product) => product.categoryId === parseInt(filters.categoryId)
      );
    }

    if (filters.isActive !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.isActive === filters.isActive
      );
    }

    return {
      success: true,
      data: filteredProducts,
      total: filteredProducts.length,
    };
  }

  async getProductById(productId) {
    await delay(300);
    simulateError(0.02);

    const product = this.products.find((p) => p.id === parseInt(productId));
    if (!product) {
      throw new Error("상품을 찾을 수 없습니다.");
    }

    return {
      success: true,
      data: product,
    };
  }

  async createProduct(productData) {
    await delay(1000);
    simulateError(0.05);

    const newProduct = {
      id: this.products.length + 1,
      ...productData,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      isActive: true,
    };

    this.products.push(newProduct);

    return {
      success: true,
      data: newProduct,
      message: "상품이 성공적으로 등록되었습니다.",
    };
  }

  async updateProduct(productId, updateData) {
    await delay(800);
    simulateError(0.05);

    const productIndex = this.products.findIndex(
      (p) => p.id === parseInt(productId)
    );
    if (productIndex === -1) {
      throw new Error("상품을 찾을 수 없습니다.");
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updateData,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    return {
      success: true,
      data: this.products[productIndex],
      message: "상품이 성공적으로 수정되었습니다.",
    };
  }

  // ===== 재고 관리 API =====
  async getInventoryHistory(filters = {}) {
    await delay(500);
    simulateError(0.03);

    let filteredHistory = [...this.inventoryHistory];

    if (filters.storeId) {
      filteredHistory = filteredHistory.filter(
        (history) => history.storeId === parseInt(filters.storeId)
      );
    }

    if (filters.productId) {
      filteredHistory = filteredHistory.filter(
        (history) => history.productId === parseInt(filters.productId)
      );
    }

    if (filters.type) {
      filteredHistory = filteredHistory.filter(
        (history) => history.type === filters.type
      );
    }

    return {
      success: true,
      data: filteredHistory,
      total: filteredHistory.length,
    };
  }

  async updateStock(productId, quantity, reason, note, userId) {
    await delay(800);
    simulateError(0.05);

    const productIndex = this.products.findIndex(
      (p) => p.id === parseInt(productId)
    );
    if (productIndex === -1) {
      throw new Error("상품을 찾을 수 없습니다.");
    }

    const product = this.products[productIndex];
    const previousStock = product.stockQuantity;
    const currentStock = previousStock + quantity;

    if (currentStock < 0) {
      throw new Error("재고가 부족합니다.");
    }

    // 상품 재고 업데이트
    this.products[productIndex].stockQuantity = currentStock;
    this.products[productIndex].updatedAt = new Date()
      .toISOString()
      .split("T")[0];

    // 재고 변동 이력 추가
    const newHistory = {
      id: this.inventoryHistory.length + 1,
      productId: parseInt(productId),
      storeId: product.storeId,
      type: quantity > 0 ? "입고" : "출고",
      quantity,
      previousStock,
      currentStock,
      reason,
      note,
      createdAt: new Date().toISOString(),
      createdBy: userId,
    };

    this.inventoryHistory.push(newHistory);

    return {
      success: true,
      data: {
        product: this.products[productIndex],
        history: newHistory,
      },
      message: "재고가 성공적으로 업데이트되었습니다.",
    };
  }

  // ===== 주문 관련 API =====
  async getOrders(filters = {}) {
    await delay(600);
    simulateError(0.03);

    let filteredOrders = [...this.orders];

    if (filters.userId) {
      filteredOrders = filteredOrders.filter(
        (order) => order.userId === parseInt(filters.userId)
      );
    }

    if (filters.storeId) {
      filteredOrders = filteredOrders.filter(
        (order) => order.storeId === parseInt(filters.storeId)
      );
    }

    if (filters.status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === filters.status
      );
    }

    return {
      success: true,
      data: filteredOrders,
      total: filteredOrders.length,
    };
  }

  async createOrder(orderData) {
    await delay(1000);
    simulateError(0.05);

    const newOrder = {
      id: this.orders.length + 1,
      orderNumber: `ORD-${new Date().getFullYear()}-${String(
        this.orders.length + 1
      ).padStart(3, "0")}`,
      status: "주문접수",
      orderDate: new Date().toISOString(),
      ...orderData,
    };

    this.orders.push(newOrder);

    // 주문된 상품들의 재고 차감
    for (const item of orderData.items) {
      await this.updateStock(
        item.productId,
        -item.quantity,
        "고객 주문",
        `주문 #${newOrder.orderNumber}`,
        orderData.userId
      );
    }

    return {
      success: true,
      data: newOrder,
      message: "주문이 성공적으로 접수되었습니다.",
    };
  }

  // ===== 알림 관련 API =====
  async getNotifications(userId) {
    await delay(400);
    simulateError(0.02);

    const userNotifications = this.notifications.filter(
      (notification) => notification.userId === parseInt(userId)
    );

    return {
      success: true,
      data: userNotifications,
      total: userNotifications.length,
    };
  }

  async markNotificationAsRead(notificationId) {
    await delay(300);
    simulateError(0.02);

    const notificationIndex = this.notifications.findIndex(
      (n) => n.id === parseInt(notificationId)
    );

    if (notificationIndex === -1) {
      throw new Error("알림을 찾을 수 없습니다.");
    }

    this.notifications[notificationIndex].isRead = true;

    return {
      success: true,
      message: "알림이 읽음으로 표시되었습니다.",
    };
  }

  // ===== 카테고리 관련 API =====
  //사용자 정보 조회 API
  async getSellerMe() {
    await delay(300);
    simulateError(0.02);

    // 첫 번째 판매자 정보 (임시) 나중에바꾸기
    const seller = mockUsers.seller[0];
    return {
      success: true,
      data: { ...seller, password: undefined },
    };
  }

  async getCategories() {
    await delay(300);
    simulateError(0.02);

    return {
      success: true,
      data: this.categories,
    };
  }

  // ===== 통계 관련 API =====
  async getStoreStats(storeId) {
    await delay(800);
    simulateError(0.03);

    const storeProducts = this.products.filter(
      (p) => p.storeId === parseInt(storeId)
    );
    const storeOrders = this.orders.filter(
      (o) => o.storeId === parseInt(storeId)
    );

    const totalProducts = storeProducts.length;
    const lowStockProducts = storeProducts.filter(
      (p) => p.stockQuantity <= p.minStockLevel
    ).length;
    const totalRevenue = storeOrders
      .filter((o) => o.status === "완료")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      success: true,
      data: {
        totalProducts,
        lowStockProducts,
        totalRevenue,
        totalOrders: storeOrders.length,
        completedOrders: storeOrders.filter((o) => o.status === "완료").length,
      },
    };
  }
}

// 싱글톤 인스턴스 생성
const mockApi = new MockApiService();

export default mockApi;
