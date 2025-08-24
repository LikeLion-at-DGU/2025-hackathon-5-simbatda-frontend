import styled from "styled-components";

const MapContainer = styled.div`
  width: 100%;
  height: ${(props) => (props.$size === "full" ? "100%" : "328px")};
  border-radius: ${(props) => (props.$size === "full" ? "0" : "15px")};
  margin: ${(props) => (props.$size === "full" ? "0" : "20px auto")};
  overflow: hidden;
  box-shadow: ${(props) =>
    props.$size === "full" ? "none" : "0 4px 12px rgba(0, 0, 0, 0.1)"};
  position: relative;
  transition: all 0.3s ease;

  ${(props) =>
    props.$size !== "full" &&
    `
    &:hover {
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
  `}
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 500;
  z-index: 10;
  pointer-events: none;
  border-radius: 15px;
`;

const MapInfo = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: #374151;
  text-align: center;
  z-index: 5;
  pointer-events: none;
`;

const MapControls = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 5;
`;

const ControlButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: white;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export {
  MapContainer,
  MapWrapper,
  MapOverlay,
  MapInfo,
  MapControls,
  ControlButton,
};