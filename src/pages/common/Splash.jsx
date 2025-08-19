import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "./Splash.styles";
import acorn1 from "../../assets/images/acorn1.svg";
import textLogoWhite from "../../assets/images/text-logo-white.svg";
import acorns from "../../assets/images/acorns.svg";
import splashSquirrel from "../../assets/images/splashsquirrel.svg";
const SHOW_MS = 4000;
const FADE_MS = 900;
const Splash = () => {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setLeaving(true), SHOW_MS);
    const navTimer = setTimeout(() => navigate("/signin"), SHOW_MS + FADE_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <PageContainer className={leaving ? "leaving" : ""}>
      <header>
        <div className="top">
          <img className="logo" src={textLogoWhite} alt="심!봤다 로고" />
          <img className="logo-acorn" src={acorn1} alt="도토리" />
        </div>

        <sectiontitle>동네 남는 재고, 도토리를 콕!</sectiontitle>
        <content>우리 동네 숨은 도토리를 찾는 재미</content>
      </header>

      <img className="falling-acorn" src={acorns} alt="" aria-hidden="true" />
      <img
        className="squirrel"
        src={splashSquirrel}
        alt="도토리를 발견한 다람쥐"
      />
    </PageContainer>
  );
};

export default Splash;
