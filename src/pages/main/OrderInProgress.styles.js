import styled from "styled-components";
import {
  PageContainer,
  Content,
  OpenStatusSection,
  OpenStatusText,
  SectionTitleWrapper,
  SectionTitle,
  StatusButtons,
} from "./MainPageSeller.styles";

export {
  PageContainer,
  Content,
  OpenStatusSection,
  OpenStatusText,
  SectionTitleWrapper,
  SectionTitle,
  StatusButtons,
};

export const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 16px;
`;
