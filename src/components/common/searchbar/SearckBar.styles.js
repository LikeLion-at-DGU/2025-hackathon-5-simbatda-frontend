import styled from "styled-components";

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 10px;
  border: 1px solid #775c4a;
  padding: 14px 16px;
`;

const SearchIcon = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 600;
  color: #775c4a;
  background-color: inherit;
  &::placeholder {
    color: #999;
    font-weight: 400;
  }
`;

export { SearchBarContainer, SearchIcon, SearchInput };
