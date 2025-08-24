import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageContainer } from "./Splash.styles";
import acorn1 from "../../assets/images/acorn1.svg";
import textLogoWhite from "../../assets/images/text-logo-white.svg";
import acorns from "../../assets/images/acorns.svg";
import splashSquirrel from "../../assets/images/splashsquirrel.svg";
import { getStoredTokens } from "../../api/client";

const SHOW_MS = 4000;
const FADE_MS = 900;

const Splash = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setLeaving(true), SHOW_MS);

    const navTimer = setTimeout(() => {
      if (location.pathname === "/splash") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");
        navigate("/signin");
      } else {
        const { accessToken } = getStoredTokens();
        if (accessToken) {
          try {
            const userInfo = localStorage.getItem("userInfo");
            if (userInfo) {
              const parsedUser = JSON.parse(userInfo);
              if (parsedUser.role === "seller") {
                navigate("/mainpage-seller");
              } else {
                navigate("/mainpage");
              }
            } else {
              navigate("/mainpage");
            }
          } catch (error) {
            console.error("Error parsing user info:", error);
            navigate("/mainpage");
          }
        } else {
          navigate("/signin");
        }
      }
    }, SHOW_MS + FADE_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [navigate, location.pathname]);

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
