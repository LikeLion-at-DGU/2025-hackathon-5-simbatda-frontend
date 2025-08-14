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

export const BrandName = styled.span`
  font-weight: 800;
  color: #5a3a1e;
  font-size: 18px;
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
  padding: 0 16px 24px;
  display: flex;
  justify-content: center;
`;

export const SearchBar = styled.div`
  display: flex;
  width: 100%;
  height: 41px;
  padding: 14px 16px;
  align-items: center;
  gap: 6px;
  border-radius: 10px;
  border: 1px solid #775c4a;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #3a2a1a;
  background: transparent;
  font-family: Pretendard;
  font-style: normal;
  font-weight: 400;
  line-height: 25px;

  &::placeholder {
    color: var(--gray-gray-400, #999);
  }
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

export const ItemIcon = styled.span`
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
