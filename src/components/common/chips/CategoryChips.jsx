import React, { useState, useEffect } from "react";
import { ChipsContainer, ChipsWrapper, Chip } from "./CategoryChips.styles";
import { getCategories } from "../../../api/products";

const fallbackCategories = [
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
  "분식",
  "기타",
];

const CategoryChips = ({ onCategoryChange, initialCategory = "전체" }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [categories, setCategories] = useState(["전체"]);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const list = await getCategories();
        if (!isMounted) return;
        const names = Array.isArray(list)
          ? ["전체", ...list.map((c) => c.name)]
          : fallbackCategories;
        setCategories(names);
      } catch (_) {
        if (!isMounted) return;
        setCategories(fallbackCategories);
      }
    };

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

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
