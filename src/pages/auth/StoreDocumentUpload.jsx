import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button/Button";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const formData = new FormData();
    formData.append("bizReg", files.bizReg);
    formData.append("permit", files.permit);
    formData.append("bankbook", files.bankbook);

    console.log("서류 업로드 시도:", {
      bizReg: files.bizReg?.name,
      permit: files.permit?.name,
      bankbook: files.bankbook?.name,
    });

    navigate("/mainpage-seller");
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
            시작하기
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
