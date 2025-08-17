import styled from "styled-components";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: inherit;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
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
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transition: all 0.3s ease;
`;

const Drawer = styled.div`
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Nickname = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #374151;
  }
`;

const DrawerList = styled.div`
  padding: 16px 0;
`;

const DrawerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
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
