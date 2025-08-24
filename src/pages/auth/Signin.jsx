import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { consumerLogin } from "../../api/auth";
import Input from "../../components/common/input/Input";
import Button from "../../components/common/button/Button";
import greenSquirrelIcon from "../../assets/images/greensquirrel.svg";

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
} from "./Signin.styles";

function Signin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

  useEffect(() => {
    const validateForm = () => {
      const emailValid =
        emailRegex.test(formData.email) && formData.email.length > 0;
      const passwordValid =
        passwordRegex.test(formData.password) && formData.password.length > 0;

      setIsFormValid(emailValid && passwordValid);
    };

    validateForm();
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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
        errorMessage = "영문+숫자+특수문자를 포함하여 8~15자로 작성해주세요";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      const response = await consumerLogin({
        email: formData.email,
        password: formData.password,
      });

      if (response.user && response.auth) {
        alert("로그인이 완료되었습니다!");
        navigate("/mainpage");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err?.detail) {
        alert(err.detail);
      } else if (err?.error) {
        alert(err.error);
      } else {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    }
  };

  return (
    <LoginPageContainer>
      <MainContent>
        <Title>소비자 로그인</Title>

        <PictureSection>
          <SquirrelContainer>
            <img src={greenSquirrelIcon} alt="다람쥐" />
          </SquirrelContainer>
          <ManagerLink>
            사장님이신가요? <Link to="/signin-seller">판매자 전용 페이지</Link>
          </ManagerLink>
        </PictureSection>

        <FormSection onSubmit={handleSubmit}>
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
          <Button type="submit" variant="primary" disabled={!isFormValid}>
            로그인
          </Button>
        </FormSection>

        <SignupSection>
          <SignupText>
            아직 심봤다 회원이 아니신가요?{" "}
            <Link to="/signup">바로회원가입하기</Link>
          </SignupText>
        </SignupSection>
      </MainContent>
    </LoginPageContainer>
  );
}

export default Signin;
