import React, { useState } from "react";
import { ChipsContainer, ChipsWrapper, Chip } from "./CategoryChips.styles";

const categories = [
  "전체",
  "식자재",
  "베이커리",
  "카페/음료",
  "한식",
  "일식",
  "중식",
  "양식",
  "피자",
  "치킨",
  "패스트푸드",
  "족발/보쌈",
  "기타",
];

const CategoryChips = ({ onCategoryChange, initialCategory = "전체" }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategoryChange?.(category);
  };

  return (
    <ChipsContainer>
      <ChipsWrapper>
        {categories.map((category) => (
          <Chip
            key={category}
            $isSelected={selectedCategory === category}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Chip>
        ))}
      </ChipsWrapper>
    </ChipsContainer>
  );
};

export default CategoryChips;
