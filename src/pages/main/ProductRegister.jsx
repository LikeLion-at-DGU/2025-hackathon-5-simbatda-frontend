import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSellerMe,
  getSellerProducts,
  createProduct,
  deleteProduct,
  getSellerStore,
} from "../../api/seller";
import { logout, getCategories } from "../../api/auth";
import Button from "../../components/common/button/Button";
import {
  PageContainer,
  Content,
  OpenStatusSection,
  OpenStatusText,
  SectionTitle,
  SectionTitleWrapper,
  EmptyMessage,
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

import HeaderSeller from "../../components/common/header/HeaderSeller";
import { Backdrop } from "../../components/common/header/HeaderSeller.styles";
import { useStoreStatus } from "../../hooks/useStoreStatus";
import closeIcon from "../../assets/icons/x.png";
import ProductCard from "../../components/product/ProductCard";

function ProductRegister() {
  const navigate = useNavigate();
  const { isOpen, setIsOpen, handleToggleOpenStatus } = useStoreStatus();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
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

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      }
      return [category];
    });
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategories([
        { id: 1, name: "식자재" },
        { id: 2, name: "한식" },
        { id: 3, name: "중식" },
        { id: 4, name: "일식" },
        { id: 5, name: "양식" },
        { id: 6, name: "분식" },
        { id: 7, name: "카페/음료" },
        { id: 8, name: "패스트푸드" },
        { id: 9, name: "치킨" },
        { id: 10, name: "피자" },
        { id: 11, name: "베이커리" },
        { id: 12, name: "기타" },
      ]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
        setSelectedImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchProducts = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      const productsData = await getSellerProducts();

      setProducts(productsData);
    } catch (err) {
      console.error(" fetchProducts 오류:", err);

      if (err.message && err.message.includes("500")) {
        if (retryCount < 3) {
          setTimeout(() => fetchProducts(retryCount + 1), 2000);
          return;
        }
        alert("백엔드 서버에 문제가 있습니다. 잠시 후 다시 시도해주세요.");
      } else {
        alert("상품 목록을 불러오는데 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      fetchProducts();
    };

    window.addEventListener("focus", handleFocus);

    if (products.length > 0) {
      console.log("🔄 상품 배열 변경 감지, 새로고침 실행");
      fetchProducts();
    }

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [products]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getSellerMe();
        setUserInfo(data);

        if (data.store) {
          setIsOpen(data.store.is_open);
        } else {
          try {
            const storeData = await getSellerStore();

            if (storeData && storeData.length > 0) {
              const store = storeData[0];

              setUserInfo((prev) => ({
                ...prev,
                store: store,
              }));

              setIsOpen(store.is_open);
            }
          } catch (storeErr) {
            console.error("상점 정보 가져오기 실패:", storeErr);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        navigate("/signin-seller");
      }
    };
    fetchUserInfo();
  }, [navigate]);

  useEffect(() => {
    fetchCategories();
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

  const handleAddMenu = () => {
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!menuName.trim()) {
      alert("메뉴 이름을 입력해주세요.");
      return;
    }
    if (!basePrice || Number(basePrice) <= 0) {
      alert("원 가격을 입력해주세요.");
      return;
    }
    if (!quantity || Number(quantity) < 1) {
      alert("수량을 입력해주세요.");
      return;
    }
    if (selectedCategories.length === 0) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (!previewUrl) {
      alert("이미지를 업로드해주세요.");
      return;
    }

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

      const formData = new FormData();
      formData.append("name", menuName);
      formData.append("price", Number(basePrice || 0));
      formData.append("discount_price", Number(finalPrice || basePrice || 0));
      formData.append("description", description || "");
      formData.append(
        "category",
        selectedCategories.length > 0
          ? categories.find((cat) => cat.name === selectedCategories[0])?.id ||
              1
          : 1
      );
      formData.append("stock", Number(quantity || 1));
      formData.append("expiration_date", expiryDate.toISOString());
      formData.append("is_active", true);
      if (selectedImageFile) {
        formData.append("image", selectedImageFile);
      } else {
        alert("상품 이미지를 선택해주세요.");
        return;
      }

      const newProduct = await createProduct(formData);

      await fetchProducts();

      setSheetOpen(false);

      setPreviewUrl("");
      setSelectedImageFile(null);
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

      alert("상품이 성공적으로 등록되었습니다!");
    } catch (err) {
      console.error("상품 등록 처리 오류", err);

      if (err.message && err.message.includes("500")) {
        alert("백엔드 서버에 문제가 있습니다. 잠시 후 다시 시도해주세요.");
      } else if (err.response) {
        const status = err.response.status;
        if (status === 400) {
          alert(
            "입력 데이터에 문제가 있습니다. 모든 필수 항목을 확인해주세요."
          );
        } else if (status === 401) {
          alert("로그인이 필요합니다. 다시 로그인해주세요.");
        } else if (status === 403) {
          alert("권한이 없습니다. 가게 등록을 먼저 완료해주세요.");
        } else if (status >= 500) {
          alert("백엔드 서버에 문제가 있습니다. 잠시 후 다시 시도해주세요.");
        } else {
          alert(err.message || "상품 등록에 실패했습니다. 다시 시도해주세요.");
        }
      } else {
        alert(err.message || "상품 등록에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      try {
        await deleteProduct(id);
        alert("상품이 삭제되었습니다.");
        await fetchProducts();
      } catch (err) {
        console.error("상품 삭제 실패:", err);
        alert(err.message || "상품 삭제에 실패했습니다.");
      }
    }
  };

  const handleToggleSale = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, onSale: !p.onSale } : p))
    );
  };

  return (
    <PageContainer>
      <HeaderSeller userInfo={userInfo} onLogout={handleLogout} />
      <Content>
        <OpenStatusSection>
          <Button
            variant={isOpen ? "open" : "close"}
            onClick={handleToggleOpenStatus}
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

        {isLoading ? (
          <EmptyMessage>상품 목록을 불러오는 중입니다...</EmptyMessage>
        ) : products.filter((p) => p.stock > 0 && p.is_active).length === 0 ? (
          <EmptyMessage>아직 등록된 메뉴가 없습니다.</EmptyMessage>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {products
              .filter((p) => p.stock > 0 && p.is_active)
              .map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  categories={categories}
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
            disabled={!userInfo?.store}
          >
            메뉴 추가
          </Button>
        </FixedBottomButton>
      </Content>

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
                  {categoriesLoading ? (
                    <div style={{ padding: "12px", color: "#666" }}>
                      카테고리를 불러오는 중...
                    </div>
                  ) : (
                    <div>
                      <ChipGroup>
                        {categories.map((cat) => {
                          const isSelected = selectedCategories.includes(
                            cat.name
                          );
                          const hasOtherSelection =
                            selectedCategories.length > 0 && !isSelected;

                          return (
                            <Chip
                              key={cat.id}
                              type="button"
                              $active={isSelected}
                              onClick={() => toggleCategory(cat.name)}
                              style={{
                                opacity: hasOtherSelection ? 0.5 : 1,
                                cursor: hasOtherSelection
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                            >
                              {cat.name}
                            </Chip>
                          );
                        })}
                      </ChipGroup>
                    </div>
                  )}
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
                    disabled={
                      !selectedImageFile || !menuName || !basePrice || !quantity
                    }
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
