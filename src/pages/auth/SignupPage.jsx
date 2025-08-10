import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/common/input/Input";
import Button from "../../components/common/button/Button";
import squirrelIcon from "../../assets/icons/squirrel.svg";

import {
  SignupPageContainer,
  MainContent,
  Title,
  PictureSection,
  SquirrelContainer,
  ManagerLink,
  FormSection,
  LoginSection,
  LoginText,
} from "./SignupPage.styles";

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // 이메일 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 비밀번호 정규식 (영문+숫자+특수문자, 8~15자)
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

  // 전화번호 정규식 (숫자만)
  const phoneRegex = /^[0-9]+$/;

  // 유효성 검사
  useEffect(() => {
    const validateForm = () => {
      const nameValid = formData.name.length > 0;
      const emailValid =
        emailRegex.test(formData.email) && formData.email.length > 0;
      const passwordValid = formData.password.length > 0;
      const confirmPasswordValid =
        formData.password === formData.confirmPassword &&
        formData.confirmPassword.length > 0;
      const phoneValid =
        phoneRegex.test(formData.phoneNumber) &&
        formData.phoneNumber.length > 0;

      setIsFormValid(
        nameValid &&
          emailValid &&
          passwordValid &&
          confirmPasswordValid &&
          phoneValid
      );
    };

    validateForm();
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 실시간 에러 검사
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMessage = "";

    if (name === "name") {
      if (value.length === 0) {
        errorMessage = "";
      } else if (value.length < 1) {
        errorMessage = "성함을 필수적으로 적어야 합니다.";
      }
    } else if (name === "email") {
      if (value.length === 0) {
        errorMessage = "";
      } else if (!emailRegex.test(value)) {
        errorMessage = "이메일 형식이 아닙니다.";
      }
    } else if (name === "password") {
      if (value.length === 0) {
        errorMessage = "";
      } else if (!passwordRegex.test(value)) {
        errorMessage = "비밀번호 형식이 아닙니다.";
      }
    } else if (name === "confirmPassword") {
      if (value.length === 0) {
        errorMessage = "";
      } else if (formData.password !== value) {
        errorMessage = "비밀번호를 다시 입력해 주세요.";
      }
    } else if (name === "phoneNumber") {
      if (value.length === 0) {
        errorMessage = "";
      } else if (!phoneRegex.test(value)) {
        errorMessage = "전화번호 형식이 아닙니다.";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    // 회원가입 로직 구현
    console.log("회원가입 시도:", formData);
  };

  return (
    <SignupPageContainer>
      <MainContent>
        <Title>회원가입</Title>

        <PictureSection>
          <SquirrelContainer>
            <img src={squirrelIcon} alt="다람쥐" />
          </SquirrelContainer>
          <ManagerLink>
            사장님이신가요? <Link to="/manager">사장님 전용 페이지</Link>
          </ManagerLink>
        </PictureSection>

        <FormSection onSubmit={handleSubmit}>
          <Input
            label="이름"
            name="name"
            type="text"
            placeholder="성함을 입력해 주세요"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            required
          />
          <Input
            label="이메일"
            name="email"
            type="email"
            placeholder="이메일을 입력해 주세요"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
          />
          <Input
            label="비밀번호"
            name="password"
            type="password"
            placeholder="영문+숫자+특수만, 8~15자로 작성"
            value={formData.password}
            onChange={handleInputChange}
            isPassword
            error={errors.password}
            required
          />
          <Input
            label="비밀번호 확인"
            name="confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 한번 입력해 주세요"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            isPassword
            error={errors.confirmPassword}
            required
          />
          <Input
            label="전화번호"
            name="phoneNumber"
            type="tel"
            placeholder="숫자만 입력해 주세요"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            error={errors.phoneNumber}
            required
          />
          <Button type="submit" variant="primary" disabled={!isFormValid}>
            시작하기
          </Button>
        </FormSection>

        <LoginSection>
          <LoginText>
            이미 심봤다 회원이신가요? <Link to="/login">로그인</Link>
          </LoginText>
        </LoginSection>
      </MainContent>
    </SignupPageContainer>
  );
}

export default SignupPage;
