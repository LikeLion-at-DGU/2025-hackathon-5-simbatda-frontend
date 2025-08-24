import styled from "styled-components";

const ChipsContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 16px 0;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ChipsWrapper = styled.div`
  display: flex;
  gap: 12px;
  min-width: max-content;
`;

const Chip = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid
    ${({ $isSelected }) => ($isSelected ? "#775C4A" : "#e5e7eb")};
  background-color: ${({ $isSelected }) =>
    $isSelected ? "#775C4A" : "#DDCFC5"};
  color: ${({ $isSelected }) => ($isSelected ? "#ffffff" : "#6b7280")};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;

  &:hover {
    border-color: ${({ $isSelected }) => ($isSelected ? "#37CA79" : "#775C4A")};
    background-color: ${({ $isSelected }) =>
      $isSelected ? "#37CA79" : "#DDCFC5"};
    color: ${({ $isSelected }) => ($isSelected ? "#ffffff" : "#775C4A")};
  }

  &:active {
    transform: scale(0.95);
  }
`;

export { ChipsContainer, ChipsWrapper, Chip };
