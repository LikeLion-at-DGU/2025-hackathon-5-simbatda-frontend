import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { consumerSignup } from "../../api/auth";
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
} from "./Signup.styles";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

  const phoneRegex = /^[0-9]{10,11}$/;

  useEffect(() => {
    const validateForm = () => {
      const nameValid = formData.name.length > 0;
      const emailValid =
        emailRegex.test(formData.email) && formData.email.length > 0;
      const passwordValid =
        formData.password.length >= 8 && formData.password.length <= 15;
      const confirmPasswordValid =
        formData.password === formData.confirmPassword &&
        formData.confirmPassword.length > 0;
      const phoneValid =
        phoneRegex.test(formData.phone) && formData.phone.length > 0;

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

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMessage = "";

    if (name === "name") {
      if (value.length === 0) {
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
      } else if (value.length < 8 || value.length > 15) {
        errorMessage = "비밀번호 형식이 아닙니다.";
      }
    } else if (name === "confirmPassword") {
      if (value.length === 0) {
        errorMessage = "";
      } else if (value !== formData.password) {
        errorMessage = "비밀번호를 다시 입력해 주세요.";
      }
    } else if (name === "phone") {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      await consumerSignup({
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
        name: formData.name,
        phone: formData.phone,
      });
      navigate("/mainpage");
    } catch (err) {
      if (err?.email && Array.isArray(err.email)) alert(err.email[0]);
      else alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <LoginPageContainer>
      <MainContent>
        <Title>회원가입</Title>

        <PictureSection>
          <SquirrelContainer>
            <img src={squirrelIcon} alt="다람쥐" />
          </SquirrelContainer>
          <ManagerLink>
            사장님이신가요? <Link to="/signup-seller">판매자 전용 페이지</Link>
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
            name="phone"
            type="tel"
            placeholder="숫자만 입력해 주세요"
            value={formData.phone}
            onChange={handleInputChange}
            error={errors.phone}
            required
          />
          <Button type="submit" variant="primary" disabled={!isFormValid}>
            회원가입
          </Button>
        </FormSection>

        <SignupSection>
          <SignupText>
            이미 계정이 있으신가요? <Link to="/signin">로그인하기</Link>
          </SignupText>
        </SignupSection>
      </MainContent>
    </LoginPageContainer>
  );
}

export default Signup;
