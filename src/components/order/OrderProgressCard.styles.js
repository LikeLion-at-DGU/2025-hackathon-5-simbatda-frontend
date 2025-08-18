import styled, { css } from "styled-components";

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 10px;
  background: #eae7e3;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

export const OrderMeta = styled.div`
  color: #5d5752;
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 4px;
`;

export const OrderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #5d5752;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 800;
  align-self: stretch;

  span {
    color: #5d5752;
    font-family: Pretendard;
    font-size: 18px;
    font-weight: 600;
    align-self: stretch;
  }
`;

export const RightColumn = styled.div`
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
  min-width: 115px;
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

export const PickupTime = styled.div`
  color: #5d5752;
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 700;
  margin-top: 16px;
`;

export const CardBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: -45px;
`;

export const Steps = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  gap: 10px;
`;

export const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  color: rgb(0, 0, 0);
  text-align: center;
  font-feature-settings: "liga" off, "clig" off;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  ${(p) =>
    p.$done &&
    css`
      color: #000;
      font-weight: 400;
    `};
`;

export const StepCheck = styled.span`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

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
  margin-top: 16px;
  margin-bottom: -20px;
  cursor: pointer;
  user-select: none;

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
