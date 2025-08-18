import styled, { css } from "styled-components";

export const PageContainer = styled.div`
  min-height: 1080px;
  margin: 0 auto;
  padding: 25px;
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

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const BrandLogo = styled.img`
  width: 70px;
  height: 70px;
  flex-shrink: 0;
  aspect-ratio: 1/1;
`;

export const HamburgerButton = styled.button`
  width: 30px;
  height: 30px;
  padding: 8px;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;

  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
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

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 20;
  opacity: ${(p) => (p.$open ? 1 : 0)};
  pointer-events: ${(p) => (p.$open ? "auto" : "none")};
  transition: opacity 0.25s ease;
`;

export const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  height: 1080px;
  width: min(82%, 340px);
  background: #ffffff;
  z-index: 30;
  transform: translateX(${(p) => (p.$open ? "0%" : "100%")});
  transition: transform 0.3s ease;
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.15);
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  display: flex;
  flex-direction: column;
`;

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  border-bottom: 1px solid #eee5dc;
`;

export const ProfileAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ddcfc5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Nickname = styled.span`
  color: #775c4a;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const LogoutButton = styled.button`
  color: #775c4a;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-decoration-line: underline;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

export const DrawerList = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 8px 4px;
`;

export const DrawerItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  border: none;
  background: transparent;
  text-align: left;
  color: #5a3a1e;
  font-size: 16px;
  cursor: pointer;

  &:active {
    background: #f7f3ee;
  }
`;

export const OrderModal = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
  transform: translateY(${(p) => (p.$open ? "0%" : "100%")});
  transition: transform 0.3s ease;
  width: 100%;
`;

export const ModalContent = styled.div`
  background: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const ModalTitle = styled.h3`
  color: #37ca79;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

export const OrderInfo = styled.div`
  margin-bottom: 20px;
`;

export const OrderNumber = styled.div`
  color: #000;
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: 500;

  strong {
    font-size: 20px;
    font-weight: 700;
    display: block;
    margin-top: 4px;
  }
`;

export const OrderSummary = styled.div`
  margin-bottom: 24px;

  h4 {
    color: #000;
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 12px 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    overflow: hidden;
  }

  th,
  td {
    padding: 12px;
    text-align: center;
    border-right: 1px solid #ddd;
  }

  th:last-child,
  td:last-child {
    border-right: none;
  }

  th {
    background: #eae7e3;
    color: #000;
    font-size: 14px;
    font-weight: 600;
    border-bottom: 1px solid #ddd;
  }

  td {
    color: #000;
    font-size: 14px;
    background: #f8f9fa;
  }

  .note {
    color: #999;
    font-size: 12px;
    margin: 12px 0 0 0;
    text-align: center;
  }
`;

export const OrderItem = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

export const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  width: fit-content;
  margin: 0 auto;
`;

export const RejectModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 50;
  opacity: ${(p) => (p.$open ? 1 : 0)};
  pointer-events: ${(p) => (p.$open ? "auto" : "none")};
  transition: opacity 0.3s ease;
`;

export const RejectModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
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

export const ExpiryDate = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  margin-left: 10px;
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
