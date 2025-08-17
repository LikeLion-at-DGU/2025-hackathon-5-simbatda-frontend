import React from "react";
import styled from "styled-components";

const PlaceholderContainer = styled.div`
  width: 328px;
  height: 328px;
  border-radius: 15px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px dashed #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    border-color: #37ca79;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const PlaceholderContent = styled.div`
  text-align: center;
  color: #6b7280;
`;

const PlaceholderIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.7;
`;

const PlaceholderTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
`;

const PlaceholderSubtitle = styled.div`
  font-size: 14px;
  color: #9ca3af;
`;

const MapPlaceholder = ({ onClick }) => {
  return (
    <PlaceholderContainer
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <PlaceholderContent>
        <PlaceholderIcon>🗺️</PlaceholderIcon>
        <PlaceholderTitle>지도 영역</PlaceholderTitle>
        <PlaceholderSubtitle>카카오맵 API 연동 예정</PlaceholderSubtitle>
        {onClick && (
          <div style={{ fontSize: "12px", color: "#37ca79", marginTop: "8px" }}>
            클릭하여 테스트
          </div>
        )}
      </PlaceholderContent>
    </PlaceholderContainer>
  );
};

export default MapPlaceholder;
