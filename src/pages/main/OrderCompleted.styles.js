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

import { Backdrop } from "../../components/common/header/HeaderSeller.styles";

export {
  PageContainer,
  Content,
  OpenStatusSection,
  OpenStatusText,
  SectionTitleWrapper,
  SectionTitle,
  StatusButtons,
  Backdrop,
};

export const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const DateSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const DateHeader = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 4px;
`;
