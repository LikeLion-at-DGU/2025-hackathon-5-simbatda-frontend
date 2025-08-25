import styled, { keyframes } from "styled-components";

const pageFadeIn = keyframes`
  from { opacity: 0; transform: scale(1.02); }
  to   { opacity: 1; transform: scale(1); }
`;

const pageFadeOut = keyframes`
  0%   { opacity: 1;  transform: scale(1);     filter: blur(0px); }
  60%  { opacity: 0.4;transform: scale(0.995); filter: blur(1px); }
  100% { opacity: 0;  transform: scale(0.985); filter: blur(2px); }
`;

const popIn = keyframes`
  0%   { opacity: 0; transform: scale(.8); }
  60%  { opacity: 1; transform: scale(1.06); }
  100% { opacity: 1; transform: scale(1); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const wobble = keyframes`
  0%,100% { transform: rotate(0deg); }
  25%     { transform: rotate(-6deg); }
  50%     { transform: rotate(4deg); }
  75%     { transform: rotate(-3deg); }
`;

const riseBounce = keyframes`
  0%   { opacity: 0; transform: translateY(24px); }
  60%  { opacity: 1; transform: translateY(-6px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const floatSlow = keyframes`
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-6px); }
`;

export const PageContainer = styled.section`
  position: relative;
  width: 100%;
  height: 100dvh;
  background: #775c4a;
  color: #ffffff;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${pageFadeIn} 1000ms ease-out;

  &.leaving {
    animation: ${pageFadeOut} 900ms cubic-bezier(0.2, 0.5, 0.5, 0.5) forwards;
  }

  @media (max-width: 768px) {
    align-items: flex-start;
    padding-top: 120px;
  }

  @media (max-width: 480px) {
    align-items: flex-start;
    padding-top: 60px;
  }

  @media (max-width: 375px) {
    align-items: flex-start;
    padding-top: 50px;
  }

  header {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    row-gap: 16px;
    position: relative;
    z-index: 3;
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    position: relative;
  }

  .logo {
    width: 300px;
    height: auto;
    aspect-ratio: 201/113;
    flex-shrink: 0;
    animation: ${popIn} 520ms cubic-bezier(0.2, 0.8, 0.2, 1) 60ms both;
  }
  @media (max-width: 409px) {
    .logo {
      width: 180px;
    }
  }
  @media (min-width: 500px) {
    .logo {
      width: 300px;
    }
  }
  @media (min-width: 800px) {
    .logo {
      width: 500px;
    }
  }

  .logo-acorn {
    width: 72px;
    height: auto;
    transform-origin: 20% 60%;
    animation: ${popIn} 520ms cubic-bezier(0.2, 0.8, 0.2, 1) 140ms both,
      ${wobble} 2500ms ease-in-out 900ms infinite;
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
  @media (max-width: 400px) {
    .logo-acorn {
      width: 56px;
    }
  }
  @media (min-width: 614px) {
    .logo-acorn {
      width: 86px;
    }
  }

  .falling-acorn {
    position: absolute;
    left: -28px;
    bottom: -8px;
    width: 420px;
    height: auto;
    pointer-events: none;
    z-index: 1;
    animation: ${riseBounce} 720ms cubic-bezier(0.2, 0.8, 0.2, 1) 380ms both,
      ${floatSlow} 3800ms ease-in-out 1400ms infinite;
  }
  @media (max-width: 412px) {
    .falling-acorn {
      width: 280px;
    }
  }
  @media (min-width: 824px) {
    .falling-acorn {
      width: 560px;
    }
  }

  .squirrel {
    position: absolute;
    right: -24px;
    bottom: -8px;
    width: 300px;
    height: auto;
    pointer-events: none;
    z-index: 2;
    animation: ${riseBounce} 720ms cubic-bezier(0.2, 0.8, 0.2, 1) 480ms both,
      ${floatSlow} 3800ms ease-in-out 1400ms infinite;
  }
  @media (max-width: 361px) {
    .squirrel {
      width: 260px;
    }
  }
  @media (min-width: 639px) {
    .squirrel {
      width: 460px;
    }
  }

  @media (max-width: 480px) {
    header {
      row-gap: 12px;
      margin-top: 0;
    }
  }

  @media (max-width: 480px) {
    header {
      row-gap: 12px;
      margin-top: 0;
    }
  }

  @media (min-width: 560px) {
    header {
      row-gap: 20px;
    }
  }

  @media (min-width: 800px) {
    header {
      row-gap: 24px;
    }
  }
`;

export const SectionTitle = styled.div`
  color: #fff;
  font-family: Pretendard;
  font-weight: 700;
  line-height: 1.3;
  margin-top: 8px;
  font-size: 20px;
  max-width: 360px;
  animation: ${fadeUp} 420ms ease-out 220ms both;

  @media (min-width: 538px) {
    font-size: 28px;
  }
`;

export const Content = styled.div`
  color: #fff;
  font-family: Pretendard;
  font-weight: 400;
  line-height: 1.5;
  margin-top: 6px;
  opacity: 0.92;
  font-size: 13px;
  max-width: 420px;
  animation: ${fadeUp} 420ms ease-out 320ms both;

  @media (min-width: 421px) {
    font-size: 16px;
  }
`;
