import styled, { css } from "styled-components";

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 10px;
  background: #eae7e3;
  position: relative;
  min-height: 140px;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Timestamp = styled.div`
  color: #5d5752;
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 4px;
`;

export const OrderTitle = styled.div`
  color: #5d5752;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 800;
  align-self: stretch;
  margin-top: 8px;
`;

export const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

export const StatusBadge = styled.div`
  padding: 10px 16px;
  border-radius: 12px;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  min-width: 95px;
  text-align: center;

  ${(p) =>
    p.$variant === "action"
      ? css`
          background: #775c4a;
        `
      : p.$variant === "waiting"
      ? css`
          background: #bdbdbd;
        `
      : css`
          background: #37ca79;
        `};
`;

export const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  align-items: flex-start;
  gap: 8px;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

export const InfoLabel = styled.div`
  color: #5d5752;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 400;
`;

export const InfoValue = styled.div`
  color: #5d5752;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 600;
`;

export const Steps = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
  margin-top: 10px;
  margin-bottom: 23px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
`;

export const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  color: ${(p) => (p.$done ? "#000" : "#999")};
  text-align: center;
  font-family: Pretendard;
  font-size: 12px;
  font-weight: ${(p) => (p.$done ? "600" : "400")};
  transition: all 0.2s ease;
`;

export const StepCheck = styled.span`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  background: ${(p) => (p.$done ? "#37ca79" : "#e0e0e0")};
  transition: all 0.2s ease;
  order: -1;

  img {
    display: flex;
    width: 26px;
    height: 24px;
    justify-content: center;
    align-items: center;
    aspect-ratio: 13/12;
  }
`;

export const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding: 2px 0;
  cursor: pointer;
  user-select: none;
  position: absolute;
  bottom: 10px;
  right: 16px;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.5;
  }
`;

export const DetailText = styled.div`
  color: #5d5752;
  text-align: center;
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 400;
`;
