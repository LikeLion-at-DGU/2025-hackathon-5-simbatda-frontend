import React from "react";
import { ButtonWrapper, StyledButton, LoadingSpinner } from "./Button.styles";

const Button = ({
  children,
  size = "large", // "large" (327×54) 또는 "small" (100×34)
  variant = "primary", // "primary", "outline", "brown"
  type = "button",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  icon,
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <ButtonWrapper>
      <StyledButton
        type={type}
        $size={size}
        $variant={variant}
        disabled={disabled}
        $loading={loading}
        onClick={handleClick}
        className={className}
        {...props}
      >
        {loading && (
          <LoadingSpinner
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </LoadingSpinner>
        )}
        {!loading && icon && icon}
        {children}
      </StyledButton>
    </ButtonWrapper>
  );
};

export default Button;