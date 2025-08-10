import React, { useState } from "react";
import visibilityOnIcon from "../../../assets/icons/toggle/visibility-on.svg";
import visibilityOffIcon from "../../../assets/icons/toggle/visibility-off.svg";
import {
  InputWrapper,
  Label,
  InputContainer,
  StyledInput,
  ToggleButton,
  ErrorMessage,
} from "./Input.styles";

const Input = ({
  label,
  title,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  isPassword = false,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = isPassword || type === "password";
  const inputType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <InputWrapper className={className}>
      {(title || label) && (
        <Label>
          {title || label}
          {required && <span className="required">*</span>}
        </Label>
      )}
      <InputContainer>
        <StyledInput
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          $hasError={!!error}
          $hasToggle={isPasswordType}
          {...props}
        />
        {isPasswordType && (
          <ToggleButton type="button" onClick={togglePasswordVisibility}>
            <img
              src={showPassword ? visibilityOnIcon : visibilityOffIcon}
              alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            />
          </ToggleButton>
        )}
      </InputContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
};

export default Input;
