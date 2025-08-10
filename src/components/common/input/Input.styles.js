import styled from "styled-components";

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Label = styled.label`
  color: var(--black-black-400, #262524);
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  margin-bottom: 8px;

  .required {
    margin-left: 2px;
  }
`;

export const InputContainer = styled.div`
  position: relative;
  width: 327px;
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 54px;
  border-radius: 16px;
  padding: 14px;
  padding-right: ${(props) => (props.$hasToggle ? "48px" : "14px")};
  border: 1px solid #e6e6e6;
  font-size: 16px;
  transition: all 0.2s ease;

  ::placeholder {
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 26px; /* 162.5% */
  }

  &:focus {
    outline: none;
    border-color: #775c4a;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  ${(props) =>
    props.$hasError &&
    `
    border-color: #ef4444;
    
    &:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}
`;

export const ToggleButton = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

export const ErrorMessage = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 14px;
  color: #ef4444;
`;
