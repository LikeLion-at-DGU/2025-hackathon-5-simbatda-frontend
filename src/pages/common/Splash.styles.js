import styled, { keyframes } from "styled-components";

const pageFadeIn = keyframes`
  from { opacity: 0; transform: scale(1.02); }
  to   { opacity: 1; transform: scale(1); }
`;

const pageFadeOut = keyframes`
  to { opacity: 0; transform: scale(1.01); }
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

const dropBounce = keyframes`
  0%   { opacity: 0; transform: translate(40%, -130%) rotate(-8deg); }
  60%  { opacity: 1; transform: translate(40%, -35%)  rotate(2deg); }  
  80%  { transform: translate(40%, -45%) rotate(-1deg); }              
  100% { transform: translate(40%, -40%) rotate(0); }                 
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

  animation: ${pageFadeIn} 360ms ease-out;

  &.leaving {
    animation: ${pageFadeOut} 300ms ease forwards;
  }

  header,
  content,
  sectiontitle {
    display: block;
  }

  header {
    max-width: 430px;
    margin: 0 auto;
    padding: calc(env(safe-area-inset-top) + 48px) 28px 0;
  }

  .top {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo {
    width: 217px;
    height: 122px;
    flex-shrink: 0;
    aspect-ratio: 201/113;
    display: block;
    animation: ${popIn} 520ms cubic-bezier(0.2, 0.8, 0.2, 1) 60ms both;
    will-change: transform, opacity;
  }

  .logo-acorn {
    width: 80px;
    height: 80px;
    transform-origin: 60% 60%;
    animation: ${popIn} 520ms cubic-bezier(0.2, 0.8, 0.2, 1) 140ms both,
      ${wobble} 2500ms ease-in-out 900ms infinite;
    will-change: transform, opacity;
  }

  sectiontitle {
    color: #fff;
    font-family: Pretendard;
    font-size: 25px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
    animation: ${fadeUp} 420ms ease-out 220ms both;
  }

  content {
    color: #fff;
    font-family: Pretendard;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    animation: ${fadeUp} 420ms ease-out 320ms both;
  }

  .falling-acorn {
    position: absolute;
    left: max(-10vw, -24px);
    bottom: -8px;
    width: clamp(280px, 68vw, 560px);
    height: auto;
    pointer-events: none;
    z-index: 1;
    animation: ${riseBounce} 720ms cubic-bezier(0.2, 0.8, 0.2, 1) 380ms both,
      ${floatSlow} 3800ms ease-in-out 1400ms infinite;
  }

  .squirrel {
    position: absolute;
    right: max(-8vw, -24px);
    bottom: -8px;
    width: clamp(260px, 72vw, 460px);
    height: auto;
    pointer-events: none;
    animation: ${riseBounce} 720ms cubic-bezier(0.2, 0.8, 0.2, 1) 480ms both,
      ${floatSlow} 3800ms ease-in-out 1400ms infinite;
    will-change: transform, opacity;
    z-index: 2;
  }
`;
