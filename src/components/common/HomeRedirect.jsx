import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredTokens } from "../../api/client";

const HomeRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectUser = () => {
      try {
        const { accessToken } = getStoredTokens();

        if (!accessToken) {
          navigate("/splash");
          return;
        }

        navigate("/mainpage");
      } catch (error) {
        console.error("Error during redirect:", error);
        navigate("/splash");
      }
    };
    //
    redirectUser();
  }, [navigate]);

  return null;
};

export default HomeRedirect;
