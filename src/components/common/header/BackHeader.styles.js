import styled from "styled-components";

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 30px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  margin: 0 -25px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f3f4f6;
  }

  img {
    width: 20px;
    height: 20px;
    transform: rotate(180deg);
  }
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 500;
  color: black;
  margin: 0;
`;

export { Header, BackButton, Title };
