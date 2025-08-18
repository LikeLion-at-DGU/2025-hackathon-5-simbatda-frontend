import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSellerMe, logout } from "../../api/auth";
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
  SectionTitle,
  SectionTitleWrapper,
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
  FixedBottomButton,
  OrderModal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalButtons,
  Form,
  Field,
  Label,
  Row,
  TextInput,
  TextArea,
  SmallInput,
  TimeInput,
  UploadRow,
  UploadPreview,
  UploadButton,
  ChipGroup,
  Chip,
  PriceRow,
  ResultBox,
  PercentBox,
  Note,
  CloseButton,
  PriceInput,
  DiscountBox,
} from "./ProductRegister.styles";

import menuIcon from "../../assets/icons/menu.png";
import greenSquirrelIcon from "../../assets/icons/greensquirrel.png";
import starsquirrelIcon from "../../assets/icons/starsquirrel.png";
import closeIcon from "../../assets/icons/x.png";
import ProductCard from "../../components/product/ProductCard";

function ProductRegister() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [menuName, setMenuName] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryDay, setExpiryDay] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("0");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const drawerRef = useRef(null);

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

  const handleAddMenu = () => {
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
  };

  const categories = [
    "식자재",
    "한식",
    "중식",
    "일식",
    "양식",
    "분식",
    "카페/음료",
    "패스트푸드",
    "치킨",
    "피자",
    "베이커리",
    "기타",
  ];

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const parsedBase = Number(basePrice) || 0;
  const parsedPercent = Math.min(
    100,
    Math.max(0, Number(discountPercent) || 0)
  );
  const [finalPrice, setFinalPrice] = useState("");

  useEffect(() => {
    if (parsedBase && parsedPercent >= 0 && !finalPrice) {
      const calculated = Math.round(parsedBase * (1 - parsedPercent / 100));
      setFinalPrice(calculated);
    }
  }, [parsedBase, parsedPercent, finalPrice]);

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const [timePart, periodPart] = (expiryTime || "12:00 AM").split(" ");
      let [hh, mm] = (timePart || "12:00")
        .split(":")
        .map((n) => parseInt(n, 10));
      const period = (periodPart || "AM").toUpperCase();
      if (period === "PM" && hh < 12) hh += 12;
      if (period === "AM" && hh === 12) hh = 0;
      const year = parseInt(expiryYear || new Date().getFullYear(), 10);
      const month =
        Math.max(1, Math.min(12, parseInt(expiryMonth || 1, 10))) - 1;
      const day = Math.max(1, Math.min(31, parseInt(expiryDay || 1, 10)));
      const expiryDate = new Date(year, month, day, hh, mm || 0, 0, 0);

      const newProduct = {
        id: Date.now(),
        name: menuName,
        categories: selectedCategories,
        expiryISO: expiryDate.toISOString(),
        basePrice: parsedBase,
        discountPercent: parsedPercent,
        finalPrice: Number(finalPrice || 0),
        description,
        quantity: Number(quantity || 0),
        imageUrl: previewUrl,
        onSale: true,
      };

      setProducts((prev) => [newProduct, ...prev]);
      setSheetOpen(false);

      setPreviewUrl("");
      setSelectedCategories([]);
      setMenuName("");
      setExpiryYear("");
      setExpiryMonth("");
      setExpiryDay("");
      setExpiryTime("");
      setBasePrice("");
      setDiscountPercent("0");
      setFinalPrice("");
      setDescription("");
      setQuantity("");
    } catch (err) {
      console.error("상품 등록 처리 오류", err);
      alert("입력값을 확인해주세요.");
    }
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleSale = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, onSale: !p.onSale } : p))
    );
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
          <SectionTitle onClick={() => navigate("/mainpage-seller")}>
            주문 현황
          </SectionTitle>
          <SectionTitle className="active">상품 등록</SectionTitle>
        </SectionTitleWrapper>

        {products.length === 0 ? (
          <EmptyMessage>아직 등록된 메뉴가 없습니다.</EmptyMessage>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onDelete={handleDeleteProduct}
                onToggleSale={handleToggleSale}
              />
            ))}
          </div>
        )}

        <FixedBottomButton>
          <Button
            variant="accept"
            onClick={handleAddMenu}
            style={{
              fontSize: "20px",
              fontWeight: "590",
              padding: "16px 32px",
            }}
          >
            메뉴 추가
          </Button>
        </FixedBottomButton>
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
          <DrawerItem onClick={() => navigate("/mainpage-seller")}>
            주문 현황
          </DrawerItem>
          <DrawerItem>상품 등록</DrawerItem>
        </DrawerList>
      </Drawer>

      {sheetOpen && (
        <>
          <Backdrop $open={sheetOpen} onClick={handleCloseSheet} />
          <OrderModal $open={sheetOpen}>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>상품 등록</ModalTitle>
              </ModalHeader>
              <CloseButton onClick={handleCloseSheet}>
                <img src={closeIcon} alt="닫기" width={20} height={20} />
              </CloseButton>

              <Form onSubmit={handleSubmit}>
                <Field>
                  <Label>
                    이미지 등록<span className="req">*</span>
                  </Label>
                  <UploadRow>
                    <UploadPreview>
                      {previewUrl ? (
                        <img src={previewUrl} alt="미리보기" />
                      ) : (
                        "미리보기"
                      )}
                    </UploadPreview>
                    <UploadButton>
                      이미지 파일 업로드 하기
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFileChange}
                      />
                    </UploadButton>
                  </UploadRow>
                </Field>

                <Field>
                  <Label>
                    메뉴 카테고리<span className="req">*</span>
                  </Label>
                  <ChipGroup>
                    {categories.map((cat) => (
                      <Chip
                        key={cat}
                        type="button"
                        $active={selectedCategories.includes(cat)}
                        onClick={() => toggleCategory(cat)}
                      >
                        {cat}
                      </Chip>
                    ))}
                  </ChipGroup>
                </Field>

                <Field>
                  <Label>
                    메뉴 이름<span className="req">*</span>
                  </Label>
                  <TextInput
                    placeholder="메뉴 이름을 등록해주세요"
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                  />
                </Field>

                <Field>
                  <Label>
                    유통기한<span className="req">*</span>
                  </Label>
                  <Row>
                    <SmallInput
                      placeholder="년도"
                      value={expiryYear}
                      onChange={(e) => setExpiryYear(e.target.value)}
                    />
                    <SmallInput
                      placeholder="월"
                      value={expiryMonth}
                      onChange={(e) => setExpiryMonth(e.target.value)}
                    />
                    <SmallInput
                      placeholder="일"
                      value={expiryDay}
                      onChange={(e) => setExpiryDay(e.target.value)}
                    />
                    <Row>
                      <select
                        style={{
                          width: "80px",
                          padding: "12px",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          color: "#ababab",
                          fontFamily: "Pretendard",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                        value={expiryTime?.split(" ")[1] || "AM"}
                        onChange={(e) => {
                          const timeValue =
                            expiryTime?.split(" ")[0] || "12:00";
                          setExpiryTime(`${timeValue} ${e.target.value}`);
                        }}
                      >
                        <option value="AM">오전</option>
                        <option value="PM">오후</option>
                      </select>
                      <TimeInput
                        type="time"
                        step="60"
                        value={expiryTime?.split(" ")[0] || ""}
                        onChange={(e) => {
                          const period = expiryTime?.split(" ")[1] || "AM";
                          setExpiryTime(`${e.target.value} ${period}`);
                        }}
                      />
                    </Row>
                  </Row>
                  <Note>
                    *해당 유통기한이 지날 시, 품목이 자동으로 삭제됩니다
                  </Note>
                </Field>

                <Field>
                  <Label>
                    메뉴 가격<span className="req">*</span>
                  </Label>
                  <PriceRow>
                    <Label>원 가격</Label>
                    <PriceInput
                      type="text"
                      placeholder="원 가격"
                      value={
                        basePrice ? Number(basePrice).toLocaleString() : ""
                      }
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/[^0-9]/g, "");
                        setBasePrice(newValue);
                        if (finalPrice && newValue) {
                          const newDiscount = Math.round(
                            (1 - Number(finalPrice) / Number(newValue)) * 100
                          );
                          setDiscountPercent(String(newDiscount));
                        }
                      }}
                    />

                    <Label>최종 판매 가격</Label>
                    <PriceInput
                      type="text"
                      placeholder="최종 판매 가격"
                      value={
                        finalPrice ? Number(finalPrice).toLocaleString() : ""
                      }
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/[^0-9]/g, "");
                        setFinalPrice(newValue);
                        if (newValue && basePrice) {
                          const newDiscount = Math.round(
                            (1 - Number(newValue) / Number(basePrice)) * 100
                          );
                          setDiscountPercent(String(newDiscount));
                        }
                      }}
                    />

                    <Label>할인율 적용(%)</Label>
                    <DiscountBox>
                      <strong>{parsedPercent}%</strong>
                    </DiscountBox>
                  </PriceRow>
                </Field>

                <Field>
                  <Label>메뉴 설명</Label>
                  <TextArea
                    rows={3}
                    placeholder="메뉴 상세 설명을 적어주세요"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Field>

                <Field>
                  <Label>
                    수량 입력<span className="req">*</span>
                  </Label>
                  <SmallInput
                    type="number"
                    min="1"
                    placeholder="00"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= 1 || e.target.value === "") {
                        setQuantity(e.target.value);
                      }
                    }}
                  />
                </Field>

                <ModalButtons>
                  <Button
                    variant="accept"
                    type="submit"
                    style={{
                      fontSize: "20px",
                      fontWeight: "590",
                      padding: "16px 32px",
                    }}
                  >
                    메뉴 추가
                  </Button>
                </ModalButtons>
              </Form>
            </ModalContent>
          </OrderModal>
        </>
      )}
    </PageContainer>
  );
}

export default ProductRegister;
