import React, { useState, useRef, useEffect } from "react";
import menuIcon from "../../../assets/icons/menu.svg";
import starsquirrelIcon from "../../../assets/icons/starsquirrel.svg";
import textLogo from "../../../assets/images/text-logo.svg";
import { useNavigate } from "react-router-dom";
import { useStoreStatus } from "../../../hooks/useStoreStatus";
import Button from "../button/Button";
import {
  HeaderContainer,
  Brand,
  BrandLogo,
  RightSection,
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
  OpenStatusSection,
  OpenStatusText,
} from "./HeaderSeller.styles";

const HeaderSeller = ({ userInfo, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const navigate = useNavigate();
  const { isOpen, handleToggleOpenStatus } = useStoreStatus();

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
  };

  return (
    <>
      <HeaderContainer>
        <Brand>
          <BrandLogo
            src={textLogo}
            alt="심봤다"
            onClick={() => navigate("/mainpage-seller")}
            style={{ cursor: "pointer" }}
          />
        </Brand>

        <RightSection>
          <OpenStatusSection>
            <Button
              variant={
                isOpen === null ? "secondary" : isOpen ? "open" : "close"
              }
              onClick={handleToggleOpenStatus}
              disabled={isOpen === null}
            >
              {isOpen === null ? "로딩 중..." : isOpen ? "open" : "close"}
            </Button>
            <OpenStatusText>영업상태변경</OpenStatusText>
          </OpenStatusSection>

          <HamburgerButton
            aria-label="메뉴 열기"
            onClick={() => setDrawerOpen((v) => !v)}
          >
            <img src={menuIcon} alt="메뉴" width={24} height={24} />
          </HamburgerButton>
        </RightSection>
      </HeaderContainer>

      <Backdrop $open={drawerOpen} onClick={() => setDrawerOpen(false)} />
      <Drawer $open={drawerOpen} ref={drawerRef} aria-hidden={!drawerOpen}>
        <DrawerHeader>
          <ProfileAvatar>
            <img src={starsquirrelIcon} alt="프로필" width={28} height={28} />
          </ProfileAvatar>
          <ProfileInfo>
            <Nickname>
              {userInfo?.store_name
                ? `${userInfo.store_name}님`
                : userInfo?.username
                ? `${userInfo.username}님`
                : "로딩 중..."}
            </Nickname>
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
          </ProfileInfo>
        </DrawerHeader>
        <DrawerList>
          <DrawerItem onClick={() => navigate("/mainpage-seller")}>
            주문 현황
          </DrawerItem>
          <DrawerItem onClick={() => navigate("/product-register")}>
            상품 등록
          </DrawerItem>
        </DrawerList>
      </Drawer>
    </>
  );
};

export default HeaderSeller;
