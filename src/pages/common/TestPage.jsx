import React, { useState } from "react";
import styled from "styled-components";
import Input from "../../components/common/input/Input";
import Button from "../../components/common/button/Button";

const TestContainer = styled.div`
  max-width: 600px;
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

const TestPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <TestContainer>
      <h1>Input 컴포넌트 테스트</h1>

      <Section>
        <h2>기본 Input</h2>
        <Input
          title="이름"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Section>

      <Section>
        <h2>필수 Input (required)</h2>
        <Input
          title="이메일"
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Section>

      <Section>
        <h2>비밀번호 Input (토글 기능)</h2>
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
      </Section>

      <Section>
        <h2>Button 컴포넌트</h2>

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
