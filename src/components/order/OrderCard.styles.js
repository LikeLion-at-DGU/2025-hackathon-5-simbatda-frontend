import styled from "styled-components";

export const OrderCardContainer = styled.div`
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

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  height: 40px;
`;

export const AcceptButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 12px;
  background: #37ca79;
  color: white;
  font-size: 16px;
  cursor: pointer;
  font-family: Pretendard;
  font-weight: 700;
  min-width: 95px;
  text-align: center;

  &:hover {
    background: #33b56d;
  }
`;

export const RejectButton = styled.button`
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: white;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  font-family: Pretendard;
  font-weight: 700;
  min-width: 95px;
  text-align: center;

  &:hover {
    background: #f5f5f5;
  }
`;

export const StatusBadge = styled.div`
  padding: 10px 16px;
  background-color: #bdbdbd;
  color: white;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  font-family: Pretendard;
  min-width: 95px;
  text-align: center;
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

export const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding: 2px 0;
  cursor: pointer;
  user-select: none;
  position: absolute;
  bottom: 16px;
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
