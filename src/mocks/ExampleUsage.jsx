import React, { useState, useEffect } from "react";
import { mockUsers, mockProducts, mockStores } from "./MockData.js";
import mockApi from "./mockApi.js";

// 목데이터 직접 사용 예시
export function DirectDataUsage() {
  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", margin: "10px" }}>
      <h3>📊 목데이터 직접 사용 예시</h3>

      <div style={{ marginBottom: "20px" }}>
        <h4>사용자 목록</h4>
        {mockUsers.general.map((user) => (
          <div
            key={user.id}
            style={{
              padding: "8px",
              border: "1px solid #eee",
              margin: "5px 0",
            }}
          >
            {user.name} - {user.email}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>상품 목록</h4>
        {mockProducts.map((product) => (
          <div
            key={product.id}
            style={{
              padding: "8px",
              border: "1px solid #eee",
              margin: "5px 0",
            }}
          >
            {product.name} - {product.price.toLocaleString()}원 (재고:{" "}
            {product.stockQuantity}
            {product.unit})
          </div>
        ))}
      </div>

      <div>
        <h4>매장 목록</h4>
        {mockStores.map((store) => (
          <div
            key={store.id}
            style={{
              padding: "8px",
              border: "1px solid #eee",
              margin: "5px 0",
            }}
          >
            {store.name} - {store.address} (평점: {store.rating}⭐)
          </div>
        ))}
      </div>
    </div>
  );
}

// Mock API 서비스 사용 예시
export function MockApiUsage() {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 병렬로 데이터 조회
      const [productsResponse, storesResponse] = await Promise.all([
        mockApi.getProducts({ storeId: 1 }),
        mockApi.getStores(),
      ]);

      setProducts(productsResponse.data);
      setStores(storesResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      const newProduct = {
        storeId: 1,
        categoryId: 1,
        name: "새로운 상품",
        description: "테스트용 상품입니다",
        price: 10000,
        originalPrice: 12000,
        stockQuantity: 50,
        minStockLevel: 10,
        unit: "개",
        weight: "300g",
        expiryDate: "2025-03-15",
      };

      const response = await mockApi.createProduct(newProduct);
      alert(`상품이 생성되었습니다: ${response.data.name}`);

      // 목록 새로고침
      fetchData();
    } catch (err) {
      alert(`상품 생성 실패: ${err.message}`);
    }
  };

  const handleUpdateStock = async (productId, quantity) => {
    try {
      const response = await mockApi.updateStock(
        productId,
        quantity,
        "테스트 입고",
        "Mock API 테스트",
        101
      );

      alert(
        `재고가 업데이트되었습니다: ${response.data.product.name} (${response.data.product.stockQuantity}${response.data.product.unit})`
      );

      // 목록 새로고침
      fetchData();
    } catch (err) {
      alert(`재고 업데이트 실패: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        🔄 데이터를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
        ❌ 오류 발생: {error}
        <br />
        <button onClick={fetchData} style={{ marginTop: "10px" }}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", margin: "10px" }}>
      <h3>🔌 Mock API 서비스 사용 예시</h3>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleCreateProduct}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          새 상품 생성
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>상품 목록 (API 호출)</h4>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              padding: "10px",
              border: "1px solid #eee",
              margin: "5px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              {product.name} - {product.price.toLocaleString()}원 (재고:{" "}
              {product.stockQuantity}
              {product.unit})
            </div>
            <div>
              <button
                onClick={() => handleUpdateStock(product.id, 10)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  marginRight: "5px",
                  cursor: "pointer",
                }}
              >
                +10
              </button>
              <button
                onClick={() => handleUpdateStock(product.id, -5)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                -5
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h4>매장 목록 (API 호출)</h4>
        {stores.map((store) => (
          <div
            key={store.id}
            style={{
              padding: "8px",
              border: "1px solid #eee",
              margin: "5px 0",
            }}
          >
            {store.name} - {store.address} (평점: {store.rating}⭐)
          </div>
        ))}
      </div>
    </div>
  );
}

// 통합 예시 컴포넌트
export default function MockDataExamples() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>🎯 목데이터 및 Mock API 사용 예시</h1>
      <p>이 페이지는 목데이터와 Mock API 서비스의 사용법을 보여줍니다.</p>

      <DirectDataUsage />
      <MockApiUsage />

      <div
        style={{
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "5px",
          marginTop: "20px",
        }}
      >
        <h3>💡 사용 팁</h3>
        <ul>
          <li>개발자 도구의 Console에서 API 호출 결과를 확인할 수 있습니다</li>
          <li>
            네트워크 탭에서 실제 API 호출과 유사한 지연을 확인할 수 있습니다
          </li>
          <li>가끔 에러가 발생하여 에러 처리 로직을 테스트할 수 있습니다</li>
          <li>재고 업데이트 시 자동으로 이력이 생성됩니다</li>
        </ul>
      </div>
    </div>
  );
}
