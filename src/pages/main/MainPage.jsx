import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConsumerMe, logout } from "../../api/auth";
import {
  PageContainer,
  Header,
  Brand,
  BrandLogo,
  HamburgerButton,
  Content,
  SearchBar,
  SearchInput,
  Backdrop,
  Drawer,
  DrawerHeader,
  ProfileAvatar,
  ProfileInfo,
  Nickname,
  LogoutButton,
  DrawerList,
  DrawerItem,
  ItemIcon,
} from "./MainPage.styles";
import squirrelIcon from "../../assets/icons/squirrel.svg";
import searchIcon from "../../assets/icons/search.png";
import menuIcon from "../../assets/icons/menu.png";
import LocationIcon from "../../assets/icons/location.png";
import DiscountIcon from "../../assets/icons/discount.png";
import GoodQualityIcon from "../../assets/icons/goodquality.png";
import BillIcon from "../../assets/icons/bill.png";
import FavoriteIcon from "../../assets/icons/favorite.png";
import greenSquirrelIcon from "../../assets/icons/greensquirrel.png";
import starsquirrelIcon from "../../assets/icons/starsquirrel.png";

function MainPage() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getConsumerMe();
        setUserInfo(data);
      } catch (err) {
        console.error("Failed to fetch user info:", err);

        navigate("/signin");
      }
    };
    fetchUserInfo();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch (err) {
      console.error("Failed to logout:", err);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };
  //esc버튼으로 메뉴 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  //바깥부분 클릭하먄 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setDrawerOpen(false);
      }
    };
    if (drawerOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [drawerOpen]);

  return (
    <PageContainer>
      <Header>
        <Brand>
          <BrandLogo src={greenSquirrelIcon} alt="심봤다" />
        </Brand>
        <HamburgerButton
          aria-label="메뉴 열기"
          onClick={() => setDrawerOpen((v) => !v)}
        >
          <img src={menuIcon} alt="메뉴" width={24} height={24} />
        </HamburgerButton>
      </Header>

      <Content>
        <SearchBar>
          <ItemIcon>
            <img src={searchIcon} alt="검색" width={20} height={20} />
          </ItemIcon>
          <SearchInput placeholder="텍스트를 입력해 주세요." />
        </SearchBar>
      </Content>

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
    </PageContainer>
  );
}

export default MainPage;
