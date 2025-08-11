import styled from "styled-components";

export const LoginPageContainer = styled.div`
  width: 375px;
  min-height: 812px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 106px 24px 188px;
  margin: 0 auto;
  font-family: "Pretendard", sans-serif;
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const PictureSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

export const SquirrelContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const FormSection = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 327px;
  margin-bottom: 1px;

  > * {
    margin-bottom: 16px;
  }

  > *:nth-child(4) {
    margin-bottom: 32px;
  }

  > *:last-child {
    margin-bottom: 0;
  }
`;

export const SectionGuide = styled.p`
  width: 100%;
  max-width: 327px;
  align-self: flex-start;

  color: #5d5752;
  font-size: 18px;
  line-height: 26px;
  font-weight: 500;
  margin: 8px 0 16px;

  strong {
    font-weight: 700;
  }
`;

export const UploadGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    font-size: 14px;
    color: #5d5752;
  }
`;

export const UploadRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  background: #ffffff;
  border: 1px solid #e6e1dc;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;

  &:focus {
    outline: 2px solid #c9b5a8;
    outline-offset: 2px;
  }
`;

export const UploadText = styled.span`
  color: #b0aaa6;
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 40px);
`;

export const PlusButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  border: 1px solid #d6c9bf;
  background: #fff;
  font-size: 20px;
  line-height: 1;
  color: #6b4e3d;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const SignupSection = styled.div`
  text-align: center;
`;

export const SignupText = styled.p`
  color: var(--black-black-100, #61605e);
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  margin: 0;
  margin-top: 16px;

  a {
    color: var(--1, #775c4a);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
    text-decoration: underline;

    &:hover {
      color: #654321;
    }
  }
`;
