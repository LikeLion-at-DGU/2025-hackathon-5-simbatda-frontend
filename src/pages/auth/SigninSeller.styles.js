import styled from "styled-components";

export const LoginPageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 24px 0 24px;
  margin: 0 auto;
  width: 100%;
  max-width: 100%;
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
`;

export const Title = styled.h1`
  color: #5d5752;
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 15px;
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

export const ManagerLink = styled.div`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 50px;
  margin-top: 10px;

  a {
    color: #8b4513;
    text-decoration: underline;
    font-weight: 500;

    &:hover {
      color: #654321;
    }
  }
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

  > *:nth-child(2) {
    margin-bottom: 32px;
  }

  > *:last-child {
    margin-bottom: 0;
  }
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
