import React, { useState } from "react";
import styled from "styled-components";
import Input from "../../components/common/input/Input";

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
    </TestContainer>
  );
};

export default TestPage;
