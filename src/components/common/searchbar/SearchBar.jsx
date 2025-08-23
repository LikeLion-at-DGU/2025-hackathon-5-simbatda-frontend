import React, { useState, useRef } from "react";
import searchIcon from "../../../assets/icons/search.png";
import {
  SearchBarContainer,
  SearchIcon,
  SearchInput,
} from "./SearckBar.styles";

const SearchBar = ({
  placeholder = "텍스트를 입력해 주세요.",
  onSearch,
  onChange,
  ...props
}) => {
  const [value, setValue] = useState("");
  const isComposingRef = useRef(false);

  const triggerSearch = () => {
    if (onSearch) onSearch(value.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isComposingRef.current) {
      e.preventDefault();
      triggerSearch();
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = () => {
    isComposingRef.current = false;
  };

  const handleChange = (e) => {
    const next = e.target.value;
    setValue(next);
    if (onChange) onChange(next);
  };

  const handleIconClick = () => {
    triggerSearch();
  };

  return (
    <SearchBarContainer {...props}>
      <SearchIcon onClick={handleIconClick} style={{ cursor: "pointer" }}>
        <img src={searchIcon} alt="검색" width={24} height={24} />
      </SearchIcon>
      <SearchInput
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
    </SearchBarContainer>
  );
};

export default SearchBar;
