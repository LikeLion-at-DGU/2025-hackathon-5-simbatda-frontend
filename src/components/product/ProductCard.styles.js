import styled from "styled-components";

export const CardContainer = styled.div`
  background: #fff;
  border-radius: 14px;
  border: 1px solid #eee5dc;
  padding: 0;
  overflow: hidden;
`;

export const StockNotice = styled.div`
  position: relative;
  padding: 10px 16px;
  display: flex;
  align-items: center;

  &::before {
    content: "";
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 0;
    height: 1px;
    background: #bfb1a7;
  }

  span {
    color: ${(p) => (p.$low ? " #BE4A31;" : "#5D5752")};
    font-family: Pretendard;
    font-size: 14px;
    font-weight: 600;
    background: #fff;
    padding-right: 12px;
  }
`;

export const CardBody = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  padding: 16px 0;
`;

export const LeftColumn = styled.div`
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 12px;
  align-items: flex-start;
  padding: 0 16px;
`;

export const Preview = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 8px;
  background: #eaeaea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Category = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 400;
`;

export const Title = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 600;
`;

export const Description = styled.div`
  color: #686868;
  font-size: 14px;
  color: #000;
  font-family: Pretendard;
  font-weight: 400;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
  padding-right: 16px;
`;

export const StatusPill = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: ${(p) => (p.$active ? "#eaf9f1" : "#f8f9fa")};
  color: ${(p) => (p.$active ? "#1a9b59" : "#686868")};
  font-size: 12px;
  cursor: pointer;

  ${(p) =>
    p.$menu &&
    `
      width: 36px;
      text-align: center;
    `}
`;

export const MoreMenu = styled.div`
  position: absolute;
  top: 120%;
  right: 0;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
  min-width: 120px;
  z-index: 2;
`;

export const MoreMenuItem = styled.button`
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  text-align: left;
  color: #5d5752;
  cursor: pointer;

  &:hover {
    background: #f7f3ee;
  }
`;

export const FooterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ExpireLabel = styled.div`
  white-space: nowrap;
  margin-top: 1px;
  color: #37ca79;

  font-family: Pretendard;
  font-size: 14px;

  font-weight: 500;
  padding-left: 3px;
`;

export const Price = styled.div`
  color: #000;
  font-weight: 700;
  font-size: 22px;
`;
