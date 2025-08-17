import React, { useState } from "react";
import styled from "styled-components";
import Input from "../../components/common/input/Input";
import Button from "../../components/common/button/Button";
import ProductCard from "../../components/common/card/ProductCard";

const TestContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Section = styled.div`
  margin-bottom: 40px;

  h2 {
    margin-bottom: 20px;
    color: #1f2937;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 10px;
  }
`;

const CardRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;

const CompactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const TestPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  // ProductCard 테스트용 데이터
  const sampleProducts = [
    {
      id: 1,
      storeName: "신선마트",
      productName: "신선 사과 1kg",
      originalPrice: 8000,
      discountPrice: 6000,
      // imageUrl 제거 - 기본 이미지 사용
      isLiked: false,
    },
    {
      id: 2,
      storeName: "편의점24",
      productName: "유기농 당근 500g",
      originalPrice: 4000,
      discountPrice: 3000,
      // imageUrl 제거 - 기본 이미지 사용
      isLiked: true,
    },
    {
      id: 3,
      storeName: "농장직송",
      productName: "방울토마토 250g",
      originalPrice: 5000,
      discountPrice: 5000,
      // imageUrl 제거 - 기본 이미지 사용
      isLiked: false,
    },
    {
      id: 4,
      storeName: "신선마트",
      productName: "바나나 1kg",
      originalPrice: 3000,
      discountPrice: 2000,
      // imageUrl 제거 - 기본 이미지 사용
      isLiked: false,
    },
    {
      id: 5,
      storeName: "직송농장",
      productName: "신선 오이 1kg",
      originalPrice: 6000,
      discountPrice: 4500,
      // imageUrl 제거 - 기본 이미지 사용
      isLiked: false,
    },
  ];

  const [products, setProducts] = useState(sampleProducts);

  const handleLikeToggle = (productId, newLikedState) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, isLiked: newLikedState }
          : product
      )
    );
  };

  const handleCardClick = (productId) => {
    console.log(`상품 ${productId} 클릭됨`);
    alert(`상품 ${productId}가 클릭되었습니다!`);
  };

  return (
    <TestContainer>
      <h1>🧪 컴포넌트 테스트 페이지</h1>

      {/* ProductCard 테스트 섹션 */}
      <Section>
        <h2>🎯 ProductCard 컴포넌트</h2>

        <div>
          <h3>📱 Default Variant (가로형)</h3>
          <CardRow>
            {products.slice(0, 2).map((product) => (
              <ProductCard
                key={product.id}
                variant="default"
                storeName={product.storeName}
                productName={product.productName}
                originalPrice={product.originalPrice}
                discountPrice={product.discountPrice}
                imageUrl={product.imageUrl}
                isLiked={product.isLiked}
                onLikeToggle={(liked) => handleLikeToggle(product.id, liked)}
                onClick={() => handleCardClick(product.id)}
              />
            ))}
          </CardRow>
        </div>

        <div style={{ marginTop: "40px" }}>
          <h3>🔲 Compact Variant (컴팩트)</h3>
          <CompactGrid>
            {products.map((product) => (
              <ProductCard
                key={`compact-${product.id}`}
                variant="compact"
                storeName={product.storeName}
                productName={product.productName}
                originalPrice={product.originalPrice}
                discountPrice={product.discountPrice}
                imageUrl={product.imageUrl}
                isLiked={product.isLiked}
                onLikeToggle={(liked) => handleLikeToggle(product.id, liked)}
                onClick={() => handleCardClick(product.id)}
              />
            ))}
          </CompactGrid>
        </div>
      </Section>

      {/* 기존 Input 컴포넌트 테스트 */}
      <Section>
        <h2>📝 Input 컴포넌트</h2>

        <div>
          <h3>기본 Input</h3>
          <Input
            title="이름"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3>필수 Input (required)</h3>
          <Input
            title="이메일"
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3>비밀번호 Input (토글 기능)</h3>
          <Input
            title="비밀번호"
            isPassword
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            title="비밀번호 확인"
            isPassword
            placeholder="비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={
              password && confirmPassword && password !== confirmPassword
                ? "비밀번호가 일치하지 않습니다"
                : ""
            }
            required
          />
        </div>
      </Section>

      {/* Button 컴포넌트 테스트 */}
      <Section>
        <h2>🔘 Button 컴포넌트</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h3>크기별 버튼</h3>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Button size="large">large</Button>
              <Button size="small">small</Button>
            </div>
          </div>

          <div>
            <h3>작은 버튼 Variant별</h3>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Button size="small" variant="primary">
                Primary
              </Button>
              <Button size="small" variant="outline">
                Outline
              </Button>
              <Button size="small" variant="brown">
                Brown
              </Button>
            </div>
          </div>

          <div>
            <h3>작은 버튼 상태별</h3>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Button size="small">기본</Button>
              <Button size="small" disabled>
                비활성
              </Button>
              <Button size="small" loading>
                로딩중
              </Button>
            </div>
          </div>

          <div>
            <h3>Variant별 버튼</h3>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Button variant="primary">Primary</Button>
              <Button variant="outline">Outline</Button>
            </div>
          </div>

          <div>
            <h3>상태별 버튼</h3>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Button>기본</Button>
              <Button disabled>비활성</Button>
              <Button loading>로딩 중</Button>
            </div>
          </div>
        </div>
      </Section>
    </TestContainer>
  );
};

export default TestPage;
