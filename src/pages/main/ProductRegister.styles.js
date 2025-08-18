import styled from "styled-components";
import {
  PageContainer as MainPageContainer,
  Header as MainHeader,
  Brand as MainBrand,
  BrandLogo as MainBrandLogo,
  HamburgerButton as MainHamburgerButton,
  Content as MainContent,
  OpenStatusSection as MainOpenStatusSection,
  OpenStatusText as MainOpenStatusText,
  SectionTitle as MainSectionTitle,
  SectionTitleWrapper as MainSectionTitleWrapper,
  EmptyMessage as MainEmptyMessage,
  Backdrop as MainBackdrop,
  Drawer as MainDrawer,
  DrawerHeader as MainDrawerHeader,
  ProfileAvatar as MainProfileAvatar,
  ProfileInfo as MainProfileInfo,
  Nickname as MainNickname,
  LogoutButton as MainLogoutButton,
  DrawerList as MainDrawerList,
  DrawerItem as MainDrawerItem,
  OrderModal as MainOrderModal,
  ModalContent as MainModalContent,
  ModalHeader as MainModalHeader,
  ModalTitle as MainModalTitle,
  ModalButtons as MainModalButtons,
} from "./MainPageSeller.styles";

export const PageContainer = MainPageContainer;
export const Header = MainHeader;
export const Brand = MainBrand;
export const BrandLogo = MainBrandLogo;
export const HamburgerButton = MainHamburgerButton;
export const Content = MainContent;
export const OpenStatusSection = MainOpenStatusSection;
export const OpenStatusText = MainOpenStatusText;
export const SectionTitle = MainSectionTitle;
export const SectionTitleWrapper = MainSectionTitleWrapper;
export const EmptyMessage = MainEmptyMessage;
export const Backdrop = MainBackdrop;
export const Drawer = MainDrawer;
export const DrawerHeader = MainDrawerHeader;
export const ProfileAvatar = MainProfileAvatar;
export const ProfileInfo = MainProfileInfo;
export const Nickname = MainNickname;
export const LogoutButton = MainLogoutButton;
export const DrawerList = MainDrawerList;
export const DrawerItem = MainDrawerItem;

export const OrderModal = MainOrderModal;
export const ModalContent = MainModalContent;
export const ModalHeader = styled(MainModalHeader)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
`;
export const ModalTitle = styled(MainModalTitle)`
  color: #686868;
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 700;
`;
export const ModalButtons = styled(MainModalButtons)`
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px auto 0; //중앙정렬

  button {
    width: 242px;
    margin: 0 auto;
  }
`;

export const FixedBottomButton = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);

  button {
    width: 242px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  color: #5d5752;
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: Pretendard;

  span.req {
    color: #37ca79;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 8px;
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #37ca79;
  }

  &::placeholder {
    color: #ababab;
    font-size: 14px;
    font-weight: 500;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  resize: vertical;
  &::placeholder {
    color: #ababab;
    font-family: Pretendard;
    font-size: 14px;

    font-weight: 500;
  }
  &:focus {
    outline: none;
    border-color: #37ca79;
  }
`;

export const SmallInput = styled(TextInput)`
  width: 100px;
`;

export const TimeInput = styled(TextInput)`
  width: 110px;
  color: #ababab;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 500;

  &::-webkit-calendar-picker-indicator {
    display: none;
  }

  &::-webkit-datetime-edit {
    padding: 0;
  }

  &::-webkit-datetime-edit-ampm-field {
    display: none;
  }
`;

export const UploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const UploadPreview = styled.div`
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

export const UploadButton = styled.label`
  padding: 12px 16px;
  border: 1px dashed #c9c9c9;
  color: #ababab;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 500;
`;

export const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Chip = styled.button`
  border: 1px solid ${(p) => (p.$active ? "#37ca79" : "#e0e0e0")};
  background: ${(p) => (p.$active ? "#eaf9f1" : "white")};
  color: ${(p) => (p.$active ? "#1a9b59" : "#666")};
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;

  text-align: center;

  font-family: Pretendard;
  font-size: 14px;
  font-weight: 500;
`;

export const PriceRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

export const PriceInput = styled(TextInput)`
  background: white;
  border-radius: 10px;
  padding: 12px;
  text-align: right;

  color: #686868;

  font-family: Pretendard;
  font-size: 20px;

  font-weight: 700;
`;

export const ResultBox = styled.div`
  background: #eaf9f1;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Pretendard;

  span {
    color: #686868;
    font-size: 20px;
    font-weight: 500;
  }

  strong {
    color: #686868;
    font-size: 20px;
    font-weight: 700;
    text-align: right;
  }
`;

export const DiscountBox = styled(ResultBox)`
  background: #37ca79;
  justify-content: flex-end;
  font-family: Pretendard;
  font-size: 20px;

  font-weight: 700;
  span,
  strong {
    color: white;
  }
`;

export const PercentBox = styled(ResultBox)`
  width: 160px;
`;

export const Note = styled.p`
  color: #999;
  font-size: 12px;
  margin: 4px 0 0 0;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
`;
