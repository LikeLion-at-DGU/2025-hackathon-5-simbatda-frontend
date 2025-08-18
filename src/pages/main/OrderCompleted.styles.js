import styled from "styled-components";
import {
  PageContainer,
  Header,
  Brand,
  BrandLogo,
  HamburgerButton,
  Content,
  OpenStatusSection,
  OpenStatusText,
  SectionTitleWrapper,
  SectionTitle,
  StatusButtons,
  Backdrop,
  Drawer,
  DrawerHeader,
  ProfileAvatar,
  ProfileInfo,
  Nickname,
  LogoutButton,
  DrawerList,
  DrawerItem,
} from "./MainPageSeller.styles";

export {
  PageContainer,
  Header,
  Brand,
  BrandLogo,
  HamburgerButton,
  Content,
  OpenStatusSection,
  OpenStatusText,
  SectionTitleWrapper,
  SectionTitle,
  StatusButtons,
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

export const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const DateSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const DateHeader = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 4px;
`;
