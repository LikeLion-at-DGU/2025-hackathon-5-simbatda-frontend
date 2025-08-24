import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import menuIcon from "../../../assets/icons/menu.png";
import starsquirrelIcon from "../../../assets/icons/starsquirrel.png";
import LocationIcon from "../../../assets/icons/Location.png";
import DiscountIcon from "../../../assets/icons/Discount.png";
import GoodQualityIcon from "../../../assets/icons/GoodQuality.png";
import BillIcon from "../../../assets/icons/Bill.png";
import FavoriteIcon from "../../../assets/icons/like/brown-like.svg";
import textLogo from "../../../assets/images/text-logo.svg";
import {
  HeaderContainer,
  Brand,
  BrandLogo,
  HeaderTitle,
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

const Header = ({ userInfo, title }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const navigate = useNavigate();

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
    setDrawerOpen(false);
    navigate("/splash");
    // Splash 화면에서 자동으로 로그인 페이지로 이동하므로 onLogout은 호출하지 않음
  };

  const handleReservationHistory = () => {
    navigate("/order-history");
    setDrawerOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleInventoryMap = () => {
    navigate("/inventory-map");
    setDrawerOpen(false);
  };

  const handleSpecialPrice = () => {
    navigate("/special-price");
    setDrawerOpen(false);
  };

  const handleRecommended = () => {
    navigate("/recommended");
    setDrawerOpen(false);
  };

  const handleFavorites = () => {
    navigate("/wishlist");
    setDrawerOpen(false);
  };

  return (
    <>
      <HeaderContainer>
        <Brand onClick={handleLogoClick}>
          <BrandLogo src={textLogo} alt="심봤다" />
        </Brand>
        {title && <HeaderTitle>{title}</HeaderTitle>}
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
          <DrawerItem onClick={handleInventoryMap}>
            <img src={LocationIcon} alt="재고지도" width={20} height={20} />
            재고 지도
          </DrawerItem>
          <DrawerItem onClick={handleSpecialPrice}>
            <img src={DiscountIcon} alt="특가상품" width={20} height={20} />
            특가 상품
          </DrawerItem>
          <DrawerItem onClick={handleRecommended}>
            <img src={GoodQualityIcon} alt="추천상품" width={20} height={20} />
            추천 상품
          </DrawerItem>
          <DrawerItem onClick={handleReservationHistory}>
            <img src={BillIcon} alt="주문내역" width={20} height={20} />
            주문 내역
          </DrawerItem>
          <DrawerItem onClick={handleFavorites}>
            <img src={FavoriteIcon} alt="찜" width={20} height={20} />찜
          </DrawerItem>
        </DrawerList>
      </Drawer>
    </>
  );
};

export default Header;
