import styled from "styled-components";

const Container = styled.div`
  margin: 20px 0;
  padding: 15px;
  background-color: #ddcfc5;
  border-radius: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 700;
  color: #775c4a;
  margin: 0;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #686868;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0fdf4;
    transform: translateY(-1px);
  }
`;

const ProductsContainer = styled.div`
  width: 100%;
  overflow-x: auto;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ProductsWrapper = styled.div`
  display: flex;
  gap: 16px;
  padding: 15px 0 0 0;
  min-width: max-content;
`;

const Description = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #5d5752;
  margin: 0;
  margin-top: 5px;
`;

export {
  Container,
  Header,
  Title,
  MoreButton,
  ProductsContainer,
  ProductsWrapper,
  Description,
};