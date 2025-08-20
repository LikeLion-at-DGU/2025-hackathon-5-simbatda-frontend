import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
  margin-top: 100px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 0 16px;
  max-width: 1400px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    padding: 0 24px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
    padding: 0 32px;
  }

  @media (min-width: 1400px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 40px;
    padding: 0 40px;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150px 20px;
  text-align: center;
`;

export const EmptyText = styled.p`
  font-size: 16px;
  color: #6c757d;
  margin: 0;
  font-weight: 500;
`;

export const EmptyImage = styled.img`
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  opacity: 0.7;
`;
