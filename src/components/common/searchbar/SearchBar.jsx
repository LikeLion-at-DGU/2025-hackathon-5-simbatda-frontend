import React, { useState, useRef, useEffect } from "react";
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
  value: externalValue,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(externalValue || "");
  const isComposingRef = useRef(false);

  // 외부에서 value가 변경되면 내부 상태도 업데이트
  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  const value = externalValue !== undefined ? externalValue : internalValue;

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
    setInternalValue(next);
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
