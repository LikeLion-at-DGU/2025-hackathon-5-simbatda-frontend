import React from "react";
import WishListHeader from "../../components/common/header/WishListHeader";
import { WishListContainer, WishListContent } from "./WishList.styles";

const WishList = () => {
  const userInfo = {
    name: "사용자",
  };

  const handleLogout = () => {
    console.log("로그아웃");
  };

  return (
    <WishListContainer>
      <WishListHeader userInfo={userInfo} onLogout={handleLogout} />
      <WishListContent>
        <p>찜 컴포넌트 추가하기</p>
      </WishListContent>
    </WishListContainer>
  );
};

export default WishList;
