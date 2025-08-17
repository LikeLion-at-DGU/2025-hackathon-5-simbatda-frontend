import React, { useState, useRef, useEffect } from "react";
import menuIcon from "../../../assets/icons/menu.png";
import starsquirrelIcon from "../../../assets/icons/starsquirrel.png";
import LocationIcon from "../../../assets/icons/location.png";
import DiscountIcon from "../../../assets/icons/discount.png";
import GoodQualityIcon from "../../../assets/icons/goodQuality.png";
import BillIcon from "../../../assets/icons/bill.png";
import FavoriteIcon from "../../../assets/icons/favorite.png";
import textLogo from "../../../assets/images/text-logo.svg";
import {
  HeaderContainer,
  Brand,
  BrandLogo,
  HamburgerButton,
  Backdrop,
  Drawer,
  DrawerHeader,
  DrawerList,
  DrawerItem,
  ProfileAvatar,
  ProfileInfo,
  Nickname,
  LogoutButton,
} from "./Header.styles";

const Header = ({ userInfo, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawerOpen(false);
      }
    };

    if (drawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [drawerOpen]);

  const handleLogout = () => {
    onLogout?.();
    setDrawerOpen(false);
  };

  return (
    <>
      <HeaderContainer>
        <Brand>
          <BrandLogo src={textLogo} alt="심봤다" />
        </Brand>
        <HamburgerButton
          aria-label="메뉴 열기"
          onClick={() => setDrawerOpen((v) => !v)}
        >
          <img src={menuIcon} alt="메뉴" width={24} height={24} />
        </HamburgerButton>
      </HeaderContainer>

      <Backdrop $open={drawerOpen} onClick={() => setDrawerOpen(false)} />
      <Drawer $open={drawerOpen} ref={drawerRef} aria-hidden={!drawerOpen}>
        <DrawerHeader>
          <ProfileAvatar>
            <img src={starsquirrelIcon} alt="프로필" width={28} height={28} />
          </ProfileAvatar>
          <ProfileInfo>
            <Nickname>{userInfo?.name || "로딩 중..."}님</Nickname>
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
          </ProfileInfo>
        </DrawerHeader>
        <DrawerList>
          <DrawerItem>
            <img src={LocationIcon} alt="재고지도" width={20} height={20} />
            재고 지도
          </DrawerItem>
          <DrawerItem>
            <img src={DiscountIcon} alt="특가상품" width={20} height={20} />
            특가 상품
          </DrawerItem>
          <DrawerItem>
            <img src={GoodQualityIcon} alt="추천상품" width={20} height={20} />
            추천 상품
          </DrawerItem>
          <DrawerItem>
            <img src={BillIcon} alt="예약내역" width={20} height={20} />
            예약 내역
          </DrawerItem>
          <DrawerItem>
            <img src={FavoriteIcon} alt="찜" width={20} height={20} />찜
          </DrawerItem>
        </DrawerList>
      </Drawer>
    </>
  );
};

export default Header;
