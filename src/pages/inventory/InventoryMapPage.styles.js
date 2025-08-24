import styled from "styled-components";

const PageContainer = styled.div`
  height: 100vh;
  background-color: #f8f9fa;
  overflow: hidden;
`;

const Content = styled.div`
  padding: 0;
  height: 100vh;
  margin-top: 0;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
`;

const PageTitle = styled.h1`
  display: none; /* 제목 숨기기 */
`;

export { PageContainer, Content, MapContainer, PageTitle };