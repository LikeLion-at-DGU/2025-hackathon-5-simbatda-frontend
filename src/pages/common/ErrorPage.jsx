import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #8b4513;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #654321;
  }
`;

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <ErrorContainer>
      <Title>페이지를 찾을 수 없습니다</Title>
      <Message>
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </Message>
      <Button onClick={() => navigate("/")}>메인으로 돌아가기</Button>
    </ErrorContainer>
  );
}

export default ErrorPage;
