import styled from "styled-components";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  height: 70px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f5f5f5;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BrandLogo = styled.img`
  height: 50px;
`;

const HamburgerButton = styled.button`
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

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 20;
  opacity: ${(p) => (p.$open ? 1 : 0)};
  pointer-events: ${(p) => (p.$open ? "auto" : "none")};
  transition: opacity 0.25s ease;
`;

const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: ${({ $open }) => ($open ? "0" : "-320px")};
  width: 320px;
  height: 100vh;
  background: #ffffff;
  z-index: 1001;
  transition: right 0.3s ease;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
`;

const ProfileAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ddcfc5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Nickname = styled.span`
  color: #775c4a;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const LogoutButton = styled.button`
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
const DrawerList = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 8px 4px;
`;

const DrawerItem = styled.button`
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
export {
  HeaderContainer,
  Brand,
  BrandLogo,
  HamburgerButton,
  Backdrop,
  Drawer,
  DrawerHeader,
  ProfileAvatar,
  ProfileInfo,
  Nickname,
  LogoutButton,
  DrawerList,
  DrawerItem,
};
