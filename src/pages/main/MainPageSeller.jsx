import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSellerMe, logout } from "../../api/auth";
import Button from "../../components/common/Button/Button.jsx";
import {
  PageContainer,
  Header,
  Brand,
  BrandLogo,
  HamburgerButton,
  Content,
  OpenStatusSection,
  OpenStatusText,
  SectionTitle,
  SectionTitleWrapper,
  StatusButtons,
  EmptyMessage,
  Backdrop,
  Drawer,
  DrawerHeader,
  ProfileAvatar,
  ProfileInfo,
  Nickname,
  LogoutButton,
  DrawerList,
  DrawerItem,
  OrderModal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  OrderInfo,
  OrderNumber,
  OrderItem,
  OrderSummary,
  ModalButtons,
  RejectModal,
  RejectModalContent,
  RejectModalHeader,
  RejectModalTitle,
  RejectModalSection,
  RejectModalSubtitle,
  RejectOrderInfo,
  RejectReason,
  RejectSelect,
  RejectButtons,
  RejectInfo,
  ExpiryDate,
} from "./MainPageSeller.styles";

import menuIcon from "../../assets/icons/menu.png";
import greenSquirrelIcon from "../../assets/icons/greensquirrel.png";
import starsquirrelIcon from "../../assets/icons/starsquirrel.png";
import ImportantIcon from "../../assets/icons/Important.png";

function MainPageSeller() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const rejectReasons = [
    "상품의 상태가 좋지 않아요...",
    "가게 내부 문제 발생",
    "기타 사유",
  ];
  const drawerRef = useRef(null);

  // 테스트용 주문 데이터
  const sampleOrder = {
    orderNumber: "B12345",
    items: [
      {
        name: "김치찌개 1인분",
        quantity: 1,
        price: 5600,
        expiryDate: "25.08.06",
      },
    ],
    total: 5600,
    customer: "고객명",
    orderTime: "오후 8시 33분",
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

  // (5초 후 모달 표시)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentOrder(sampleOrder);
      setOrderModalOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin-seller");
    } catch (err) {
      console.error("Failed to logout:", err);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const handleAcceptOrder = () => {
    alert("주문을 접수했습니다!");
    setOrderModalOpen(false);
    setCurrentOrder(null);
  };

  const handleRejectOrder = () => {
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    alert("주문을 거절했습니다.");
    setRejectModalOpen(false);
    setOrderModalOpen(false);
    setCurrentOrder(null);
    setRejectReason("");
  };

  const handleCancelReject = () => {
    setRejectModalOpen(false);
    setRejectReason("");
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
          <SectionTitle>상품 등록</SectionTitle>
        </SectionTitleWrapper>

        <StatusButtons>
          <Button variant="status" className="active">
            주문 접수
          </Button>
          <Button variant="status">진행 중</Button>
          <Button variant="status">진행 완료</Button>
        </StatusButtons>

        <EmptyMessage>아직 주문 접수된 건이 없어요</EmptyMessage>
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
          <DrawerItem>상품 등록</DrawerItem>
        </DrawerList>
      </Drawer>

      {orderModalOpen && currentOrder && (
        <>
          <Backdrop $open={orderModalOpen} />
          <OrderModal $open={orderModalOpen}>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>{currentOrder.orderTime} 접수</ModalTitle>
              </ModalHeader>

              <OrderInfo>
                <OrderNumber>
                  예약 번호
                  <br />
                  <strong>{currentOrder.orderNumber}</strong>
                </OrderNumber>
              </OrderInfo>

              <OrderSummary>
                <h4>주문 정보</h4>
                <table>
                  <thead>
                    <tr>
                      <th>상품명</th>
                      <th>수량</th>
                      <th>금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrder.items.map((item, index) => (
                      <OrderItem key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price.toLocaleString()}원</td>
                      </OrderItem>
                    ))}
                  </tbody>
                </table>
                <p className="note">
                  10분 이내에 수락이 안 되면 예약이 자동 취소됩니다.
                </p>
              </OrderSummary>

              <ModalButtons>
                <Button variant="reject" onClick={handleRejectOrder}>
                  거절
                </Button>
                <Button variant="accept" onClick={handleAcceptOrder}>
                  수락
                </Button>
              </ModalButtons>
            </ModalContent>
          </OrderModal>
        </>
      )}

      {rejectModalOpen && (
        <>
          <Backdrop $open={rejectModalOpen} onClick={handleCancelReject} />
          <RejectModal $open={rejectModalOpen}>
            <RejectModalContent>
              <RejectModalHeader>
                <RejectModalTitle>
                  <img src={ImportantIcon} alt="거절 사유" />
                  <span>거절 사유</span>
                </RejectModalTitle>
              </RejectModalHeader>

              <RejectModalSection>
                <RejectModalSubtitle>주문 상품 정보</RejectModalSubtitle>
                <RejectInfo>
                  <RejectOrderInfo>
                    <div>{currentOrder.items[0].name}</div>
                    <div>{currentOrder.items[0].quantity}</div>
                    <div>{currentOrder.items[0].price.toLocaleString()}원</div>
                  </RejectOrderInfo>
                  <ExpiryDate>
                    유통기한: {currentOrder.items[0].expiryDate}
                  </ExpiryDate>
                </RejectInfo>
              </RejectModalSection>

              <RejectReason>
                <RejectModalSubtitle>취소 사유</RejectModalSubtitle>
                <RejectSelect
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                >
                  <option value="">상품이 방금 품절됐어요ㅠㅠ!</option>
                  {rejectReasons.map((reason, index) => (
                    <option key={index} value={reason}>
                      {reason}
                    </option>
                  ))}
                </RejectSelect>
              </RejectReason>

              <RejectButtons>
                <Button variant="accept" onClick={handleConfirmReject}>
                  보내기
                </Button>
              </RejectButtons>
            </RejectModalContent>
          </RejectModal>
        </>
      )}
    </PageContainer>
  );
}

export default MainPageSeller;
