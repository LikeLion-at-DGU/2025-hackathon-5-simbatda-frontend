import React from "react";
import searchIcon from "../../../assets/icons/search.png";
import {
  SearchBarContainer,
  SearchIcon,
  SearchInput,
} from "./SearckBar.styles";

const SearchBar = ({
  placeholder = "텍스트를 입력해 주세요.",
  onSearch,
  ...props
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <SearchBarContainer {...props}>
      <SearchIcon>
        <img src={searchIcon} alt="검색" width={24} height={24} />
      </SearchIcon>
      <SearchInput placeholder={placeholder} onKeyPress={handleKeyPress} />
    </SearchBarContainer>
  );
};

export default SearchBar;
