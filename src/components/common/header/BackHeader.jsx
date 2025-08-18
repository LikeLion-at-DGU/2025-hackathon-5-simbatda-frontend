import React from "react";
import { useNavigate } from "react-router-dom";
import forward from "../../../assets/icons/forward.png";
import { Header, BackButton, Title } from "./BackHeader.styles";

const BackHeader = ({ title, onBackClick }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <Header>
      <BackButton onClick={handleBackClick}>
        <img src={forward} alt="뒤로 가기" />
      </BackButton>
      <Title>{title}</Title>
    </Header>
  );
};

export default BackHeader;
