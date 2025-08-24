import styled, { css } from "styled-components";

export const PageContainer = styled.div`
  min-height: 1080px;
  margin: 0 auto;
  padding: 25px;
  padding-top: 65px;
  background: #f5f5f5;
  position: relative;
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  height: 70px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f5f5f5;
`;

export const Content = styled.main`
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 120px);
`;

export const OpenStatusSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 24px;
`;

export const OpenStatusText = styled.span`
  color: #999;
  font-size: 12px;
  margin-top: 4px;
`;

export const SectionTitleWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 0.5px solid #775c4a;
`;

export const SectionTitle = styled.h2`
  color: #8a8a8a;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  cursor: pointer;

  &.active {
    color: #775c4a;
  }
`;

export const StatusButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  width: fit-content;
`;

export const EmptyMessage = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 16px;
  text-align: center;
`;

export const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const RejectModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 50;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
`;

export const RejectModalContent = styled.div`
  padding: 24px;
  width: 400px;
  max-width: 90vw;
`;

export const RejectModalHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

export const RejectModalTitle = styled.h3`
  color: #000;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  img {
    width: 20px;
    height: 20px;
    margin-bottom: 2px;
  }
`;

export const RejectModalSection = styled.div`
  margin-bottom: 24px;
`;

export const RejectModalSubtitle = styled.h4`
  color: #000;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
`;

export const RejectInfo = styled.div`
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 16px 0;
`;

export const RejectOrderInfo = styled.div`
  display: grid;
  grid-template-columns: 2fr 0.5fr 1fr;
  padding: 2px;
  font-size: 14px;
  color: #000;
  gap: 30px;
`;

export const RejectReason = styled.div`
  margin-bottom: 32px;
`;

export const RejectSelect = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='14' height='8' viewBox='0 0 14 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M1 1L7 7L13 1' stroke='%23999999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;

  &:focus {
    outline: none;
    border-color: #37ca79;
  }

  option {
    padding: 12px;
  }
`;

export const RejectButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
  width: fit-content;
  margin: 0 auto;
`;

export const CancelButton = styled.button`
  padding: 12px 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  color: #666;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

export const ConfirmButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #37ca79;
  color: white;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #33b56d;
  }
`;
