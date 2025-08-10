import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/common/input/Input";
import Button from "../../components/common/button/Button";
import squirrelIcon from "../../assets/icons/squirrel.svg";

import {
  LoginPageContainer,
  MainContent,
  Title,
  PictureSection,
  SquirrelContainer,
  ManagerLink,
  FormSection,
  SignupSection,
  SignupText,
} from "./LoginPage_m.styles";

function LoginPage_m() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // 이메일 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 비밀번호 정규식
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // 유효성 검사
  useEffect(() => {
    const validateForm = () => {
      const emailValid =
        emailRegex.test(formData.email) && formData.email.length > 0;
      const passwordValid =
        passwordRegex.test(formData.password) && formData.password.length > 0;

      setIsFormValid(emailValid && passwordValid);
    };

    validateForm();
  }, [formData.email, formData.password]);

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

    if (name === "email") {
      if (value.length === 0) {
        errorMessage = "";
      } else if (!emailRegex.test(value)) {
        errorMessage = "올바른 이메일 형식을 입력해주세요";
      }
    } else if (name === "password") {
      if (value.length === 0) {
        errorMessage = "";
      } else if (!passwordRegex.test(value)) {
        errorMessage =
          "대소문자, 특수문자, 숫자를 포함하여 8자 이상이어야 합니다";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("판매자 로그인 시도:", formData);
  };

  return (
    <LoginPageContainer>
      <MainContent>
        <Title>로그인</Title>

        <PictureSection>
          <SquirrelContainer>
            <img src={squirrelIcon} alt="다람쥐" />
          </SquirrelContainer>
          <ManagerLink>
            일반 유저이신가요? <Link to="/user">일반 유저 전용 페이지</Link>
          </ManagerLink>
        </PictureSection>

        <FormSection onSubmit={handleSubmit}>
          <Input
            label="이메일"
            name="email"
            type="email"
            placeholder="이메일을 입력해주세요"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
          />
          <Input
            label="비밀번호"
            name="password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={formData.password}
            onChange={handleInputChange}
            isPassword
            error={errors.password}
            required
          />
          <Button type="submit" variant="primary" disabled={!isFormValid}>
            로그인
          </Button>
        </FormSection>

        <SignupSection>
          <SignupText>
            아직 심봤다 회원이 아니신가요?{" "}
            <Link to="/signup">바로 회원가입하기</Link>
          </SignupText>
        </SignupSection>
      </MainContent>
    </LoginPageContainer>
  );
}

export default LoginPage_m;
