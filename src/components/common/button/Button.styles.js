import styled, { keyframes } from "styled-components";

// 애니메이션
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StyledButton = styled.button`
  width: ${(props) => (props.$size === "small" ? "100px" : "327px")};
  height: ${(props) => (props.$size === "small" ? "34px" : "54px")};
  border-radius: ${(props) => (props.$size === "small" ? "10px" : "16px")};
  padding: ${(props) => (props.$size === "small" ? "8px 16px" : "14px 24px")};
  border: none;
  font-size: ${(props) => (props.$size === "small" ? "16px" : "18px")};
  font-weight: ${(props) => (props.$size === "small" ? "400" : "500")};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => (props.$size === "small" ? "4px" : "8px")};

  /* 기본 스타일 (큰 버튼) */
  background-color: var(--color-primary-brown);
  color: white;

  &:hover {
    background-color: var(--color-primary-brown-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px var(--color-shadow-brown);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px var(--color-shadow-brown);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-shadow-brown);
  }

  /* 작은 버튼 variant별 스타일 */
  ${(props) =>
    props.$size === "small" &&
    props.$variant === "primary" &&
    `
    background-color: var(--color-primary-green);
    
    &:hover {
      background-color: var(--color-primary-green-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px var(--color-shadow-green);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px var(--color-shadow-green);
    }
    
    &:focus {
      box-shadow: 0 0 0 3px var(--color-shadow-green);
    }
  `}

  ${(props) =>
    props.$size === "small" &&
    props.$variant === "outline" &&
    `
    background-color: transparent;
    color: var(--color-primary-brown);
    border: 2px solid var(--color-primary-brown);

    &:hover {
      background-color: var(--color-primary-brown);
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px var(--color-shadow-brown);
    }
  `}

  ${(props) =>
    props.$size === "small" &&
    props.$variant === "brown" &&
    `
    background-color: var(--color-primary-brown);
    
    &:hover {
      background-color: var(--color-primary-brown-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px var(--color-shadow-brown);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px var(--color-shadow-brown);
    }
    
    &:focus {
      box-shadow: 0 0 0 3px var(--color-shadow-brown);
    }
  `}

  /* 판매자 페이지  */
 ${(props) =>
    props.$variant === "status" &&
    `
  display: flex;
  align-items: center;        
  justify-content: center;   
  box-sizing: border-box;     

  width: 80px;
  flex: none;
  height: 38px;
  padding: 0 10px;            
  
  border-radius: 5px;
  border: none;
  background:#EAE7E3;
  color: #5D5752;
  font-size: 14px;
  font-weight: 600;
  
  margin: 0;

  &.active {
    background: #AB9C9C;
    color: #FFF;
  }

  &:hover {
    background: #AB9C9C;
    color: #FFF;
  }

  &.active:hover {
    background: #AB9C9C;
    color: #FFF;
  }
`}


  ${(props) =>
    props.$variant === "accept" &&
    `
    flex: 1;
    padding: 14px;
    border: none;
    border-radius: 10px;
    background: #37CA79;
    color: white;
    font-size: 16px;
    font-weight: 600;
    width:107px;
    height:40px;

    &:hover {
      background:#37CA79;;
    }
  `}

  ${(props) =>
    props.$variant === "reject" &&
    `
    flex: 1;
    padding: 14px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background: white;
    color: #666;
    font-size: 16px;
    font-weight: 600;
    width:107px;
    height:40px;

    &:hover {
      background: #f5f5f5;
    }
  `}

  ${(props) =>
    props.$variant === "close" &&
    `
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    font-size: 18px;
    color: #999;
    border-radius: 50%;

    &:hover {
      background: #f5f5f5;
    }
  `}

  ${(props) =>
    (props.$variant === "open" || props.$variant === "close") &&
    `
    width: 65px;
    height: 25px;
    padding: 1px 6px;
    border-radius: ${props.$variant === "open" ? "10px" : "10px"};
    border: 1px solid ${props.$variant === "open" ? "#37CA79" : "#8A8A8A"};
    background: transparent;
    color: ${props.$variant === "open" ? "#37CA79" : "#8A8A8A"};
    font-size: 14px;
    font-weight: 500;

    &:hover {
      background: ${props.$variant === "open" ? "#37CA79" : "#8A8A8A"};
      color: white;
    }
  `}

  /* 큰 버튼 variant 스타일 */
  ${(props) =>
    props.$size !== "small" &&
    props.$variant === "outline" &&
    `
    background-color: transparent;
    color: var(--color-primary-brown);
    border: 2px solid var(--color-primary-brown);

    &:hover {
      background-color: var(--color-primary-brown);
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px var(--color-shadow-brown);
    }
  `}

  /* 상태별 스타일 */
  ${(props) =>
    props.disabled &&
    `
    background-color: var(--color-neutral-disabled);
    color: var(--color-neutral-disabled-text);
    border: none;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;

    &:hover {
      background-color: var(--color-neutral-disabled);
      transform: none;
      box-shadow: none;
    }
  `}

  /* 로딩 상태 */
  ${(props) =>
    props.$loading &&
    `
    cursor: wait;
    opacity: 0.7;
  `}
`;

export const LoadingSpinner = styled.svg`
  animation: ${spin} 1s linear infinite;
`;