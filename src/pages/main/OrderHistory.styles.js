import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 0 25px;
  margin-top: 100px;
`;

const OrderList = styled.div`
  margin-top: 20px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const OrderItem = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const OrderDate = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
`;

const OrderStatus = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.color};
  padding: 4px 12px;
  background: ${(props) => props.color}15;
  border-radius: 20px;
  display: inline-block;
`;

const OrderDetails = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
`;

const OrderProducts = styled.div`
  margin-bottom: 20px;
`;

const OrderProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const OrderProductImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  background-color: #f3f4f6;
`;

const OrderProductInfo = styled.div`
  flex: 1;
`;

const OrderProductName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const OrderProductQuantity = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const OrderSummary = styled.div`
  background: #f9fafb;
  border-radius: 10px;
  padding: 16px;
  font-size: 14px;
  color: #374151;
  line-height: 1.6;

  > div {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  height: 100vh;
`;

const EmptyText = styled.div`
  font-size: 16px;
  color: #6b7280;
  text-align: center;
`;

// 진행 상황 관련 스타일
const ProgressSection = styled.div`
  margin-bottom: 20px;
`;

const ProgressStep = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
`;

const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const StepStoreName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
`;

const StepStatus = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.color};
  padding: 4px 12px;
  background: ${(props) => props.color}15;
  border-radius: 20px;
  display: inline-block;
`;

const StepProducts = styled.div`
  margin-bottom: 12px;
`;

const StepProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
`;

const StepProductInfo = styled.div`
  flex: 1;
`;

const StepProductName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const StepProductQuantity = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const StepSummary = styled.div`
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;

  > div {
    margin-bottom: 4px;
  }
`;

// 진행 바 관련 스타일
const ProgressBar = styled.div`
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
`;

const ProgressSteps = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  overflow-x: auto;
`;

const ProgressStepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex-shrink: 0;
  min-width: 70px;
  gap: 5px;
`;

const StepLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  font-weight: 500;
`;

const StepLine = styled.div`
  position: absolute;
  top: 16px;
  left: 100%;
  width: 20px;
  height: 2px;
  background: ${(props) => (props.isCompleted ? "#37ca79" : "#e5e7eb")};
  z-index: -1;
`;

// 픽업 정보 스타일
const PickupInfo = styled.div`
  margin: 10px 0;
  padding: 15px;
  background: #fefefe;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
`;

const PickupTime = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
`;

const PickupMessage = styled.div`
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
`;

export {
  Container,
  OrderList,
  OrderItem,
  OrderHeader,
  OrderInfo,
  OrderStatus,
  OrderDetails,
  OrderProducts,
  OrderProduct,
  OrderProductImage,
  OrderProductInfo,
  OrderProductName,
  OrderProductQuantity,
  OrderSummary,
  OrderDate,
  EmptyState,
  EmptyText,
  ProgressSection,
  ProgressStep,
  StepHeader,
  StepStoreName,
  StepStatus,
  StepProducts,
  StepProduct,
  StepProductInfo,
  StepProductName,
  StepProductQuantity,
  StepSummary,
  ProgressBar,
  ProgressSteps,
  ProgressStepItem,
  StepLabel,
  StepLine,
  PickupInfo,
  PickupTime,
  PickupMessage,
};
