import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSellerMe, logout } from "../../api/auth";
import CompletedCard from "../../components/order/CompletedCard";
import Button from "../../components/common/button/Button";
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
  OrderList,
  DateSection,
  DateHeader,
} from "./OrderCompleted.styles";
import greenSquirrelIcon from "../../assets/icons/greensquirrel.png";
import menuIcon from "../../assets/icons/menu.png";
import starsquirrelIcon from "../../assets/icons/starsquirrel.png";

export default function OrderCompleted() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const drawerRef = useRef(null);

  // 샘플 주문 데이터 (날짜별로 그룹화)
  const ordersGroupedByDate = {
    "2025.08.06": [
      {
        createdAt: "오후 8시 33분",
        orderNumber: "B12345",
        itemSummary: "김치찌개 1인분 1개",
        pickupTime: "오후 9시",
      },
      {
        createdAt: "오후 8시 33분",
        orderNumber: "B12346",
        itemSummary: "김치찌개 1인분 1개",
        pickupTime: "오후 9시",
      },
    ],
    "2025.08.05": [
      {
        createdAt: "오후 8시 33분",
        orderNumber: "B12347",
        itemSummary: "김치찌개 1인분 1개",
        pickupTime: "오후 9시",
      },
    ],
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getSellerMe();
        setUserInfo(data);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        navigate("/signin-seller");
      }
    };
    fetchUserInfo();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin-seller");
    } catch (err) {
      console.error("Failed to logout:", err);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

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
        <OpenStatusSection>
          <Button
            variant={isOpen ? "open" : "close"}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "open" : "close"}
          </Button>
          <OpenStatusText>영업상태 변경</OpenStatusText>
        </OpenStatusSection>

        <SectionTitleWrapper>
          <SectionTitle className="active">주문 현황</SectionTitle>
          <SectionTitle onClick={() => navigate("/product-register")}>
            상품 등록
          </SectionTitle>
        </SectionTitleWrapper>

        <StatusButtons>
          <Button variant="status" onClick={() => navigate("/mainpage-seller")}>
            주문 접수
          </Button>
          <Button
            variant="status"
            onClick={() => navigate("/order-in-progress")}
          >
            진행 중
          </Button>
          <Button variant="status" className="active">
            진행 완료
          </Button>
        </StatusButtons>

        <OrderList>
          {Object.entries(ordersGroupedByDate)
            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA)) // 최신 날짜 먼저
            .map(([date, orders]) => (
              <DateSection key={date}>
                <DateHeader>{date}</DateHeader>
                {orders.map((order, index) => (
                  <CompletedCard key={`${date}-${index}`}>
                    {order}
                  </CompletedCard>
                ))}
              </DateSection>
            ))}
        </OrderList>
      </Content>

      <Backdrop $open={drawerOpen} onClick={() => setDrawerOpen(false)} />
      <Drawer $open={drawerOpen} ref={drawerRef} aria-hidden={!drawerOpen}>
        <DrawerHeader>
          <ProfileAvatar>
            <img src={starsquirrelIcon} alt="프로필" width={28} height={28} />
          </ProfileAvatar>
          <ProfileInfo>
            <Nickname>{userInfo?.storeName || "로딩 중..."}님</Nickname>
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
          </ProfileInfo>
        </DrawerHeader>
        <DrawerList>
          <DrawerItem>주문 현황</DrawerItem>
          <DrawerItem onClick={() => navigate("/product-register")}>
            상품 등록
          </DrawerItem>
        </DrawerList>
      </Drawer>
    </PageContainer>
  );
}
