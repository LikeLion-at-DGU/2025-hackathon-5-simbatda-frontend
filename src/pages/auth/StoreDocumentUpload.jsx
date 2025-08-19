import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sellerSignup, createStore, uploadDocuments } from "../../api/auth";
import Button from "../../components/common/button/Button";
import squirrelIcon from "../../assets/icons/squirrel.svg";

import {
  LoginPageContainer,
  MainContent,
  PictureSection,
  SquirrelContainer,
  FormSection,
  SectionGuide,
  UploadGroup,
  UploadRow,
  UploadText,
  PlusButton,
  HiddenFileInput,
  SignupSection,
  SignupText,
} from "./StoreDocumentUpload.styles";

function StoreDocumentUpload() {
  const navigate = useNavigate();

  // 1, 2단계 정보 확인
  useEffect(() => {
    const signupData = localStorage.getItem("sellerSignupData");
    if (!signupData) {
      alert("회원가입 정보가 없습니다. 처음부터 다시 시작해주세요.");
      navigate("/signup-seller");
      return;
    }

    const parsedData = JSON.parse(signupData);
    if (parsedData.step !== 2) {
      alert("2단계 정보가 없습니다. 처음부터 다시 시작해주세요.");
      navigate("/signup-seller");
      return;
    }
  }, [navigate]);

  const [files, setFiles] = useState({
    bizReg: null,
    permit: null,
    bankbook: null,
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const bizRegRef = useRef(null);
  const permitRef = useRef(null);
  const bankbookRef = useRef(null);

  useEffect(() => {
    const allReady = files.bizReg && files.permit && files.bankbook;
    setIsFormValid(Boolean(allReady));
  }, [files]);

  const handlePick = (key) => {
    const map = { bizReg: bizRegRef, permit: permitRef, bankbook: bankbookRef };
    map[key]?.current?.click();
  };

  const handleChange = (key, e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있어요.");
      return;
    }
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      // 1, 2단계 정보 가져오기
      const signupData = JSON.parse(localStorage.getItem("sellerSignupData"));

      // 1단계: 기본 사용자 정보로 회원가입
      const userResponse = await sellerSignup({
        email: signupData.email,
        password: signupData.password,
        password2: signupData.password2,
        name: signupData.name,
        phone: signupData.phone,
      });

      if (userResponse.user && userResponse.auth) {
        // 2단계: 상점 정보 저장
        const storeData = {
          name: signupData.storeName,
          opening_hours: signupData.openingHours,
          address: signupData.address,
          address_detail: signupData.addressDetail,
        };

        const storeResponse = await createStore(storeData);
        const storeId = storeResponse.store.id;

        // 3단계: 서류 파일 업로드
        await uploadDocuments(files, storeId);

        // localStorage 정리
        localStorage.removeItem("sellerSignupData");

        alert("판매자 회원가입이 완료되었습니다!");
        navigate("/mainpage-seller");
      }
    } catch (err) {
      console.error("Seller signup error:", err);
      console.error("Error details:", {
        name: err?.name,
        message: err?.message,
        detail: err?.detail,
        status: err?.status,
        response: err?.response,
      });

      if (err?.detail) {
        alert(`에러 상세: ${err.detail}`);
      } else if (err?.message) {
        alert(`에러 메시지: ${err.message}`);
      } else if (err?.email && Array.isArray(err.email)) {
        alert(`이메일 에러: ${err.email[0]}`);
      } else if (err?.status === 500) {
        alert("백엔드 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        alert("판매자 회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

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

          <UploadGroup>
            <label>사업자 등록증</label>
            <UploadRow
              onClick={() => handlePick("bizReg")}
              role="button"
              tabIndex={0}
            >
              <UploadText>
                {files.bizReg ? files.bizReg.name : "이미지 등록하기"}
              </UploadText>
              <PlusButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePick("bizReg");
                }}
              >
                +
              </PlusButton>
              <HiddenFileInput
                ref={bizRegRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleChange("bizReg", e)}
              />
            </UploadRow>
          </UploadGroup>

          <UploadGroup>
            <label>영업 신고증</label>
            <UploadRow
              onClick={() => handlePick("permit")}
              role="button"
              tabIndex={0}
            >
              <UploadText>
                {files.permit ? files.permit.name : "이미지 등록하기"}
              </UploadText>
              <PlusButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePick("permit");
                }}
              >
                +
              </PlusButton>
              <HiddenFileInput
                ref={permitRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleChange("permit", e)}
              />
            </UploadRow>
          </UploadGroup>

          <UploadGroup>
            <label>통장 사본</label>
            <UploadRow
              onClick={() => handlePick("bankbook")}
              role="button"
              tabIndex={0}
            >
              <UploadText>
                {files.bankbook ? files.bankbook.name : "이미지 등록하기"}
              </UploadText>
              <PlusButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePick("bankbook");
                }}
              >
                +
              </PlusButton>
              <HiddenFileInput
                ref={bankbookRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleChange("bankbook", e)}
              />
            </UploadRow>
          </UploadGroup>

          <Button type="submit" variant="primary" disabled={!isFormValid}>
            회원가입 완료
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

export default StoreDocumentUpload;
