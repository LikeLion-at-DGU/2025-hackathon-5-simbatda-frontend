// 통합 목데이터 - 모든 페이지에서 사용
export const unifiedMockData = {
  // 사용자 정보
  users: {
    consumer: {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      name: "테스트 사용자",
      phone: "010-1234-5678",
      address: "서울특별시 강남구 강남대로 123",
      profileImage: "",
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-01-15T00:00:00Z",
    },
    seller: {
      id: 2,
      username: "seller1",
      email: "seller@example.com",
      name: "김치만 선생",
      phone: "02-1234-5678",
      address: "서울특별시 강남구 강남대로 123",
      profileImage: "",
      businessLicense: "123-45-67890",
      createdAt: "2025-01-10T00:00:00Z",
      updatedAt: "2025-01-10T00:00:00Z",
    },
  },

  // 상점 정보
  stores: [
    {
      id: 1,
      sellerId: 2,
      name: "김치만 선생",
      description: "정통 김치 요리의 맛을 전하는 상점입니다.",
      address: "서울특별시 강남구 강남대로 123",
      phone: "02-1234-5678",
      businessHours: "09:00 - 18:00",
      rating: 4.8,
      reviewCount: 127,
      category: "한식",
      tags: ["김치", "한식", "전통"],
      images: ["store1.jpg", "store2.jpg"],
      latitude: 37.5665,
      longitude: 126.978,
      isOpen: true,
      createdAt: "2025-01-10T00:00:00Z",
      updatedAt: "2025-01-10T00:00:00Z",
    },
    {
      id: 2,
      sellerId: 3,
      name: "신선마트",
      description: "신선한 식재료를 제공하는 마트입니다.",
      address: "서울특별시 서초구 서초대로 456",
      phone: "02-2345-6789",
      businessHours: "08:00 - 22:00",
      rating: 4.5,
      reviewCount: 89,
      category: "마트",
      tags: ["신선", "식재료", "마트"],
      images: ["store3.jpg", "store4.jpg"],
      latitude: 37.5013,
      longitude: 127.0246,
      isOpen: true,
      createdAt: "2025-01-12T00:00:00Z",
      updatedAt: "2025-01-12T00:00:00Z",
    },
    {
      id: 3,
      sellerId: 4,
      name: "달콤베이커리",
      description: "매일 아침 굽는 신선한 베이커리입니다.",
      address: "서울특별시 마포구 홍대로 789",
      phone: "02-3456-7890",
      businessHours: "07:00 - 20:00",
      rating: 4.7,
      reviewCount: 156,
      category: "베이커리",
      tags: ["베이커리", "빵", "케이크"],
      images: ["store5.jpg", "store6.jpg"],
      latitude: 37.5575,
      longitude: 126.9254,
      isOpen: true,
      createdAt: "2025-01-08T00:00:00Z",
      updatedAt: "2025-01-08T00:00:00Z",
    },
    {
      id: 4,
      sellerId: 5,
      name: "커피향",
      description: "원두를 직접 로스팅하는 커피 전문점입니다.",
      address: "서울특별시 용산구 이태원로 321",
      phone: "02-4567-8901",
      businessHours: "08:00 - 22:00",
      rating: 4.6,
      reviewCount: 203,
      category: "카페",
      tags: ["커피", "원두", "로스팅"],
      images: ["store7.jpg", "store8.jpg"],
      latitude: 37.5344,
      longitude: 126.9944,
      isOpen: true,
      createdAt: "2025-01-06T00:00:00Z",
      updatedAt: "2025-01-06T00:00:00Z",
    },
    {
      id: 5,
      sellerId: 6,
      name: "중국집",
      description: "정통 중국 요리의 맛을 느낄 수 있는 곳입니다.",
      address: "서울특별시 광진구 능동로 654",
      phone: "02-5678-9012",
      businessHours: "11:00 - 21:00",
      rating: 4.4,
      reviewCount: 98,
      category: "중식",
      tags: ["중국요리", "짜장면", "탕수육"],
      images: ["store9.jpg", "store10.jpg"],
      latitude: 37.5487,
      longitude: 127.0854,
      isOpen: true,
      createdAt: "2025-01-14T00:00:00Z",
      updatedAt: "2025-01-14T00:00:00Z",
    },
  ],

  // 카테고리
  categories: [
    { id: 1, name: "전체", icon: "🍽️" },
    { id: 2, name: "한식", icon: "🇰🇷" },
    { id: 3, name: "중식", icon: "🇨🇳" },
    { id: 4, name: "일식", icon: "🇯🇵" },
    { id: 5, name: "양식", icon: "🍕" },
    { id: 6, name: "마트", icon: "🛒" },
    { id: 7, name: "베이커리", icon: "🥖" },
    { id: 8, name: "카페", icon: "☕" },
  ],

  // 상품 정보
  products: [
    {
      id: 1,
      storeId: 1,
      categoryId: 2,
      name: "김치찌개 1인분",
      description: "김치찌개 조리용입니다. 기본 밑반찬도 함께 제공됩니다.",
      originalPrice: 8000,
      discountPrice: 5500,
      discountRate: 30,
      stock: 50,
      weight: "1인분",
      origin: "국내산",
      storage: "냉장 보관",
      expiryDate: "구매 후 7일",
      allergens: ["없음"],
      images: ["product1.jpg", "product1_detail.jpg"],
      tags: ["김치찌개", "1인분", "조리용", "밑반찬"],
      isActive: true,
      isRecommended: true,
      isSpecialPrice: true,
      remainingTime: {
        days: 3,
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-01-15T00:00:00Z",
    },
    {
      id: 2,
      storeId: 1,
      categoryId: 2,
      name: "김치찌개 2인분",
      description: "2인 가족을 위한 김치찌개 세트입니다.",
      originalPrice: 15000,
      discountPrice: 10000,
      discountRate: 33,
      stock: 30,
      weight: "2인분",
      origin: "국내산",
      storage: "냉장 보관",
      expiryDate: "구매 후 7일",
      allergens: ["없음"],
      images: ["product2.jpg", "product2_detail.jpg"],
      tags: ["김치찌개", "2인분", "가족용"],
      isActive: true,
      isRecommended: false,
      isSpecialPrice: true,
      remainingTime: {
        days: 5,
        hours: 12,
        minutes: 30,
        seconds: 0,
      },
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-01-15T00:00:00Z",
    },
    {
      id: 3,
      storeId: 1,
      categoryId: 2,
      name: "된장찌개 1인분",
      description: "구수한 된장찌개입니다.",
      originalPrice: 7000,
      discountPrice: 5000,
      discountRate: 29,
      stock: 40,
      weight: "1인분",
      origin: "국내산",
      storage: "냉장 보관",
      expiryDate: "구매 후 7일",
      allergens: ["대두"],
      images: ["product3.jpg"],
      tags: ["된장찌개", "1인분", "구수한"],
      isActive: true,
      isRecommended: true,
      isSpecialPrice: false,
      remainingTime: {
        days: 7,
        hours: 6,
        minutes: 15,
        seconds: 0,
      },
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-01-15T00:00:00Z",
    },
    {
      id: 4,
      storeId: 2,
      categoryId: 6,
      name: "신선한 채소 세트",
      description: "매일 아침 수확한 신선한 채소들입니다.",
      originalPrice: 12000,
      discountPrice: 9000,
      discountRate: 25,
      stock: 25,
      weight: "1kg",
      origin: "국내산",
      storage: "냉장 보관",
      expiryDate: "구매 후 3일",
      allergens: ["없음"],
      images: ["product4.jpg"],
      tags: ["채소", "신선", "세트"],
      isActive: true,
      isRecommended: false,
      isSpecialPrice: true,
      remainingTime: {
        days: 1,
        hours: 18,
        minutes: 45,
        seconds: 0,
      },
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-01-15T00:00:00Z",
    },
    {
      id: 5,
      storeId: 2,
      categoryId: 6,
      name: "과일 믹스 팩",
      description: "계절별 최고의 과일들을 모아놓은 믹스 팩입니다.",
      originalPrice: 18000,
      discountPrice: 13500,
      discountRate: 25,
      stock: 20,
      weight: "2kg",
      origin: "국내산",
      storage: "냉장 보관",
      expiryDate: "구매 후 5일",
      allergens: ["없음"],
      images: ["product5.jpg"],
      tags: ["과일", "믹스", "계절"],
      isActive: true,
      isRecommended: true,
      isSpecialPrice: false,
      remainingTime: {
        days: 4,
        hours: 9,
        minutes: 20,
        seconds: 0,
      },
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-01-15T00:00:00Z",
    },
    {
      id: 6,
      storeId: 3,
      categoryId: 7,
      name: "크로아상",
      description: "버터의 풍미가 가득한 바삭한 크로아상입니다.",
      originalPrice: 3500,
      discountPrice: 2500,
      discountRate: 29,
      stock: 30,
      weight: "80g",
      origin: "국내산",
      storage: "실온 보관",
      expiryDate: "구매 후 2일",
      allergens: ["밀", "우유", "계란"],
      images: ["product6.jpg"],
      tags: ["크로아상", "베이커리", "버터"],
      isActive: true,
      isRecommended: false,
      isSpecialPrice: true,
      remainingTime: {
        days: 1,
        hours: 12,
        minutes: 30,
        seconds: 0,
      },
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-01-15T00:00:00Z",
    },
    {
      id: 7,
      storeId: 3,
      categoryId: 7,
      name: "초코케이크",
      description: "진한 초콜릿의 맛을 느낄 수 있는 케이크입니다.",
      originalPrice: 12000,
      discountPrice: 9000,
      discountRate: 25,
      stock: 15,
      weight: "500g",
      origin: "국내산",
      storage: "냉장 보관",
      expiryDate: "구매 후 3일",
      allergens: ["밀", "우유", "계란", "초콜릿"],
      images: ["product7.jpg"],
      tags: ["초코케이크", "케이크", "초콜릿"],
      isActive: true,
      isRecommended: true,
      isSpecialPrice: false,
      remainingTime: {
        days: 6,
        hours: 8,
        minutes: 45,
        seconds: 0,
      },
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-01-15T00:00:00Z",
    },
    {
      id: 8,
      storeId: 4,
      categoryId: 8,
      name: "아메리카노",
      description: "깊은 맛의 원두로 내린 아메리카노입니다.",
      originalPrice: 4500,
      discountPrice: 3500,
      discountRate: 22,
      stock: 100,
      weight: "350ml",
      origin: "국내산",
      storage: "핫/아이스",
      expiryDate: "즉시 섭취",
      allergens: ["없음"],
      images: ["product8.jpg"],
      tags: ["아메리카노", "커피", "원두"],
      isActive: true,
      isRecommended: false,
      isSpecialPrice: true,
      remainingTime: {
        days: 2,
        hours: 15,
        minutes: 20,
        seconds: 0,
      },
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-01-15T00:00:00Z",
    },
    {
      id: 9,
      storeId: 4,
      categoryId: 8,
      name: "카페라떼",
      description: "부드러운 우유와 에스프레소의 조화입니다.",
      originalPrice: 5000,
      discountPrice: 4000,
      discountRate: 20,
      stock: 80,
      weight: "400ml",
      origin: "국내산",
      storage: "핫/아이스",
      expiryDate: "즉시 섭취",
      allergens: ["우유"],
      images: ["product9.jpg"],
      tags: ["카페라떼", "커피", "우유"],
      isActive: true,
      isRecommended: true,
      isSpecialPrice: false,
      remainingTime: {
        days: 5,
        hours: 6,
        minutes: 10,
        seconds: 0,
      },
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-01-15T00:00:00Z",
    },
    {
      id: 10,
      storeId: 5,
      categoryId: 3,
      name: "짜장면",
      description: "정통 중국 짜장면의 맛을 느낄 수 있습니다.",
      originalPrice: 8000,
      discountPrice: 6000,
      discountRate: 25,
      stock: 50,
      weight: "1인분",
      origin: "국내산",
      storage: "즉시 섭취",
      expiryDate: "즉시 섭취",
      allergens: ["밀", "대두"],
      images: ["product10.jpg"],
      tags: ["짜장면", "중국요리", "면"],
      isActive: true,
      isRecommended: false,
      isSpecialPrice: true,
      remainingTime: {
        days: 3,
        hours: 18,
        minutes: 30,
        seconds: 0,
      },
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-01-15T00:00:00Z",
    },
    {
      id: 11,
      storeId: 5,
      categoryId: 3,
      name: "탕수육",
      description: "바삭한 튀김과 새콤달콤한 소스의 조화입니다.",
      originalPrice: 15000,
      discountPrice: 12000,
      discountRate: 20,
      stock: 25,
      weight: "1인분",
      origin: "국내산",
      storage: "즉시 섭취",
      expiryDate: "즉시 섭취",
      allergens: ["밀", "계란"],
      images: ["product11.jpg"],
      tags: ["탕수육", "중국요리", "튀김"],
      isActive: true,
      isRecommended: true,
      isSpecialPrice: false,
      remainingTime: {
        days: 7,
        hours: 4,
        minutes: 15,
        seconds: 0,
      },
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-01-15T00:00:00Z",
    },
  ],

  // 좋아요 정보
  likes: [
    { id: 1, userId: 1, productId: 1, createdAt: "2025-01-15T00:00:00Z" },
    { id: 2, userId: 1, productId: 3, createdAt: "2025-01-15T00:00:00Z" },
    { id: 3, userId: 1, productId: 5, createdAt: "2025-01-15T00:00:00Z" },
  ],

  // 예약 정보
  reservations: [
    {
      id: 1,
      userId: 1,
      productId: 1,
      storeId: 1,
      quantity: 2,
      pickupDate: "2025-01-20",
      pickupTime: "14:00 - 15:00",
      totalPrice: 11000,
      discountAmount: 5000,
      status: "pending", // pending, confirmed, completed, cancelled
      specialRequests: "김치를 좀 더 맵게 해주세요",
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-01-15T00:00:00Z",
    },
  ],

  // 예약 옵션
  reservationOptions: {
    pickupDate: [
      { id: 1, date: "2025-01-20", day: "월", available: true },
      { id: 2, date: "2025-01-21", day: "화", available: true },
      { id: 3, date: "2025-01-22", day: "수", available: true },
      { id: 4, date: "2025-01-23", day: "목", available: true },
      { id: 5, date: "2025-01-24", day: "금", available: true },
      { id: 6, date: "2025-01-25", day: "토", available: true },
      { id: 7, date: "2025-01-26", day: "일", available: false },
    ],
    pickupTime: [
      { id: 1, time: "09:00 - 10:00", available: true },
      { id: 2, time: "10:00 - 11:00", available: true },
      { id: 3, time: "11:00 - 12:00", available: false },
      { id: 4, time: "12:00 - 13:00", available: true },
      { id: 5, time: "13:00 - 14:00", available: true },
      { id: 6, time: "14:00 - 15:00", available: true },
      { id: 7, time: "15:00 - 16:00", available: true },
      { id: 8, time: "16:00 - 17:00", available: true },
      { id: 9, time: "17:00 - 18:00", available: false },
    ],
    quantity: [
      { id: 1, count: 1, available: true },
      { id: 2, count: 2, available: true },
      { id: 3, count: 3, available: true },
      { id: 4, count: 4, available: true },
      { id: 5, count: 5, available: true },
    ],
  },

  // 주문 정보
  orders: [
    {
      id: 1,
      userId: 1,
      storeId: 1,
      totalAmount: 11000,
      discountAmount: 5000,
      finalAmount: 6000,
      status: "completed", // pending, processing, completed, cancelled
      paymentMethod: "card",
      paymentStatus: "paid",
      createdAt: "2025-01-10T00:00:00Z",
      updatedAt: "2025-01-10T00:00:00Z",
    },
    {
      id: 2,
      userId: 1,
      storeId: 3,
      totalAmount: 7000,
      discountAmount: 1000,
      finalAmount: 6000,
      status: "processing", // 상품 준비 중
      paymentMethod: "card",
      paymentStatus: "paid",
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-01-15T00:00:00Z",
    },
    {
      id: 3,
      userId: 1,
      storeId: 2,
      totalAmount: 9000,
      discountAmount: 3000,
      finalAmount: 6000,
      status: "pending", // 주문 확인 대기
      paymentMethod: "card",
      paymentStatus: "paid",
      createdAt: "2025-01-16T00:00:00Z",
      updatedAt: "2025-01-16T00:00:00Z",
    },
  ],

  // 주문 상세
  orderItems: [
    {
      id: 1,
      orderId: 1,
      productId: 1,
      quantity: 2,
      unitPrice: 5500,
      totalPrice: 11000,
    },
    {
      id: 2,
      orderId: 2,
      productId: 6,
      quantity: 1,
      unitPrice: 6000,
      totalPrice: 6000,
    },
    {
      id: 3,
      orderId: 3,
      productId: 4,
      quantity: 1,
      unitPrice: 9000,
      totalPrice: 9000,
    },
  ],

  // 리뷰
  reviews: [
    {
      id: 1,
      userId: 1,
      productId: 1,
      storeId: 1,
      rating: 5,
      comment: "정말 맛있어요! 김치가 신선하고 맛있습니다.",
      images: ["review1.jpg"],
      createdAt: "2025-01-12T00:00:00Z",
      updatedAt: "2025-01-12T00:00:00Z",
    },
  ],

  // 알림
  notifications: [
    {
      id: 1,
      userId: 1,
      type: "reservation", // reservation, order, promotion, system
      title: "예약 확인",
      message: "김치찌개 1인분 예약이 확인되었습니다.",
      isRead: false,
      createdAt: "2025-01-15T00:00:00Z",
    },
  ],

  // 재고 이력
  inventoryHistory: [
    {
      id: 1,
      productId: 1,
      storeId: 1,
      type: "in", // in, out, adjustment
      quantity: 100,
      reason: "입고",
      previousStock: 0,
      currentStock: 100,
      createdAt: "2025-01-10T00:00:00Z",
    },
    {
      id: 2,
      productId: 1,
      storeId: 1,
      type: "out",
      quantity: 50,
      reason: "판매",
      previousStock: 100,
      currentStock: 50,
      createdAt: "2025-01-15T00:00:00Z",
    },
  ],

  // 통계 데이터
  statistics: {
    totalUsers: 150,
    totalStores: 25,
    totalProducts: 300,
    totalOrders: 1200,
    totalRevenue: 15000000,
    averageRating: 4.6,
  },
};

// 유틸리티 함수들
export const mockUtils = {
  // 상품 ID로 상품 찾기
  getProductById: (productId) => {
    return unifiedMockData.products.find((p) => p.id === productId);
  },

  // 상점 ID로 상점 찾기
  getStoreById: (storeId) => {
    return unifiedMockData.stores.find((s) => s.id === storeId);
  },

  // 사용자 ID로 사용자 찾기
  getUserById: (userId) => {
    return unifiedMockData.users.consumer.id === userId
      ? unifiedMockData.users.consumer
      : unifiedMockData.users.seller.id === userId
      ? unifiedMockData.users.seller
      : null;
  },

  // 추천 상품 가져오기
  getRecommendedProducts: () => {
    return unifiedMockData.products.filter((p) => p.isRecommended);
  },

  // 특가 상품 가져오기
  getSpecialPriceProducts: () => {
    return unifiedMockData.products.filter((p) => p.isSpecialPrice);
  },

  // 카테고리별 상품 가져오기
  getProductsByCategory: (categoryId) => {
    return unifiedMockData.products.filter((p) => p.categoryId === categoryId);
  },

  // 상점별 상품 가져오기
  getProductsByStore: (storeId) => {
    return unifiedMockData.products.filter((p) => p.storeId === storeId);
  },

  // 사용자별 좋아요 상품 가져오기
  getLikedProductsByUser: (userId) => {
    const likedProductIds = unifiedMockData.likes
      .filter((l) => l.userId === userId)
      .map((l) => l.productId);
    return unifiedMockData.products.filter((p) =>
      likedProductIds.includes(p.id)
    );
  },

  // 상품 좋아요 상태 확인
  isProductLiked: (userId, productId) => {
    return unifiedMockData.likes.some(
      (l) => l.userId === userId && l.productId === productId
    );
  },

  // 예약 옵션 가져오기
  getReservationOptions: () => {
    return unifiedMockData.reservationOptions;
  },

  // 상품별 예약 정보 가져오기
  getReservationsByProduct: (productId) => {
    return unifiedMockData.reservations.filter(
      (r) => r.productId === productId
    );
  },

  // 사용자별 주문 정보 가져오기
  getOrdersByUser: (userId) => {
    return unifiedMockData.orders.filter((o) => o.userId === userId);
  },

  // 주문 ID로 주문 정보 가져오기
  getOrderById: (orderId) => {
    return unifiedMockData.orders.find((o) => o.id === orderId);
  },

  // 주문별 상세 정보 가져오기
  getOrderItemsByOrder: (orderId) => {
    return unifiedMockData.orderItems.filter((oi) => oi.orderId === orderId);
  },

  // 주문 정보와 상품 정보 결합
  getOrderWithDetails: (orderId) => {
    const order = unifiedMockData.orders.find((o) => o.id === orderId);
    if (!order) return null;

    const orderItems = unifiedMockData.orderItems.filter(
      (oi) => oi.orderId === orderId
    );
    const store = unifiedMockData.stores.find((s) => s.id === order.storeId);

    const itemsWithProducts = orderItems.map((item) => {
      const product = unifiedMockData.products.find(
        (p) => p.id === item.productId
      );
      return {
        ...item,
        productName: product?.name || "상품명 없음",
        productImage: product?.images?.[0] || "",
      };
    });

    return {
      ...order,
      storeName: store?.name || "상점명 없음",
      storeAddress: store?.address || "",
      items: itemsWithProducts,
      pickupDate: "2025-01-20", // 실제로는 예약 정보에서 가져와야 함
      pickupTime: "14:00 - 15:00", // 실제로는 예약 정보에서 가져와야 함
    };
  },
};
