import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/input/Input";
import Button from "../../components/common/button/Button";
import squirrelIcon from "../../assets/icons/squirrel.svg";

import {
  LoginPageContainer,
  MainContent,
  PictureSection,
  SquirrelContainer,
  FormSection,
  SectionGuide,
  SignupSection,
  SignupText,
} from "./StoreRegistration.styles";

function StoreRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    storeName: "",
    openingHours: "",
    address: "",
    addressDetail: "",
  });

  const [errors, setErrors] = useState({
    storeName: "",
    openingHours: "",
    address: "",
    addressDetail: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      const storeNameValid = formData.storeName.trim().length > 0;
      const openingHoursValid = timeRangeRegex.test(
        formData.openingHours.trim()
      );
      const addressValid = formData.address.trim().length > 0;

      setIsFormValid(storeNameValid && openingHoursValid && addressValid);
    };
    validateForm();
  }, [formData]);
  const timeRangeRegex =
    /^\s*([01]\d|2[0-3]):([0-5]\d)\s*~\s*([01]\d|2[0-3]):([0-5]\d)\s*$/;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // 카카오
  const openAddressSearch = () => {
    if (!window.daum || !window.daum.postcode) {
      alert(
        "주소 검색 스크립트를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요."
      );
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        // 도로명 주소
        const roadAddress = data.roadAddress || "";
        const jibunAddress = data.jibunAddress || "";
        const selected = roadAddress.length > 0 ? roadAddress : jibunAddress;

        setFormData((prev) => ({ ...prev, address: selected }));
        // 상세 주소
        const detailInput = document.querySelector(
          'input[name="addressDetail"]'
        );
        detailInput && detailInput.focus();
      },
    }).open();
  };

  const validateField = (name, value) => {
    let message = "";
    const v = value.trim();

    if (name === "storeName" && v.length === 0)
      message = "가게명을 입력해 주세요.";
    if (name === "openingHours") {
      if (v.length === 0) {
        message = "영업 시간을 입력해 주세요.";
      } else if (!timeRangeRegex.test(v)) {
        message = "‘00:00~00:00’ 형식으로 작성해 주세요.";
      }
    }
    if (name === "address" && v.length === 0) message = "주소를 입력해 주세요.";

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    navigate("/store-document-upload");
  }; //API

  return (
    <LoginPageContainer>
      <MainContent>
        <PictureSection>
          <SquirrelContainer>
            <img src={squirrelIcon} alt="다람쥐" />
          </SquirrelContainer>
        </PictureSection>

        <FormSection onSubmit={handleSubmit}>
          <SectionGuide>
            <strong>매장 등록</strong>에 필요한 정보를
            <br />
            입력해 주세요.
          </SectionGuide>

          <Input
            label="가게명"
            name="storeName"
            type="text"
            placeholder="가게명(상호)을 입력해 주세요"
            value={formData.storeName}
            onChange={handleInputChange}
            error={errors.storeName}
            required
          />

          <Input
            label="영업 시간"
            name="openingHours"
            type="text"
            placeholder="영업시간을 적어주세요 (예: 10:00~22:00)"
            value={formData.openingHours}
            onChange={handleInputChange}
            error={errors.openingHours}
            required
            inputMode="numeric"
            maxLength={11}
          />

          <Input
            label="주소 검색"
            name="address"
            type="text"
            placeholder="주소를 입력해 주세요"
            value={formData.address}
            onChange={handleInputChange}
            onClick={openAddressSearch}
            readOnly
            error={errors.address}
            required
          />

          <Input
            label="상세 주소"
            name="addressDetail"
            type="text"
            placeholder="상세 주소를 적어주세요"
            value={formData.addressDetail}
            onChange={handleInputChange}
            error={errors.addressDetail}
          />

          <Button type="submit" variant="primary" disabled={!isFormValid}>
            다음
          </Button>
        </FormSection>

        <SignupSection>
          <SignupText>
            이미 심봤다 회원이신가요? <Link to="/signin-seller">로그인</Link>
          </SignupText>
        </SignupSection>
      </MainContent>
    </LoginPageContainer>
  );
}

export default StoreRegistration;
