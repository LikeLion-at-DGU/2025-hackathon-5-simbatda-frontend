import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  min-height: 1080px;
  margin: 0 auto;
  padding: 25px;
  background: #f5f5f5;
  position: relative;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px 4px;
  position: relative;

  color: #775c4a;
  text-align: center;
  font-feature-settings: "liga" off, "clig" off;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const BackButton = styled.div`
  position: absolute;
  left: 16px;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
    transform: rotate(180deg);
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #eee5dc;
`;

export const Title = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 22px;
  font-weight: 600;
`;

export const MetaList = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  row-gap: 8px;
  column-gap: 12px;
`;

export const MetaLabel = styled.div`
  color: #797979;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
`;

export const MetaValue = styled.div`
  color: #000;

  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
`;

export const SectionHeader = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 600;
`;

export const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  border-bottom: ${(props) =>
    props.$isLastItem ? "none" : "1px solid #eee5dc"};

  font-family: Pretendard;
  font-size: 15px;
  font-weight: 400;

  padding: 2px;
  gap: 20px;
  justify-content: space-between;

  &:first-child {
    border-top: 1px solid #eee5dc;
  }
`;

export const ProductNote = styled.div`
  color: #be4a31;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 500;
  margin-top: 1px;
`;
