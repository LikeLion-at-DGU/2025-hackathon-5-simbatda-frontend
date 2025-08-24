import React from "react";
import { useOrderAcceptance } from "../../../contexts/OrderAcceptanceContext";
import {
  Overlay,
  Modal,
  ModalContent,
  Image,
  Title,
  Message,
  Notice,
  Button,
} from "./OrderAcceptanceModal.styles";
import modalLogo from "../../../assets/images/modal-logo.svg";

const OrderAcceptanceModal = () => {
  const { showAcceptanceModal, acceptedOrder, closeModal, modalType } =
    useOrderAcceptance();

  if (!showAcceptanceModal || !acceptedOrder) return null;

  const store = acceptedOrder.storeName || "상점";

  // 모달 타입에 따라 다른 내용 표시
  const getModalContent = () => {
    if (modalType === "rejected") {
      return {
        title: "주문거절",
        message: `${store} 사장님이 주문 요청을 거절했습니다.`,
        notice: "다른 상점을 이용해보세요.",
      };
    }

    if (modalType === "completed") {
      return {
        title: "심봤다!",
        message: `${store}에서 픽업이 완료되었습니다!`,
        notice: "즐거운 식사 되세요!",
      };
    }

    // 기본값: 주문수락
    return {
      title: "주문수락",
      message: `${store} 사장님이 주문 요청을 수락했습니다!`,
      notice: "예약 수락 후 30분 내 픽업 필수입니다",
    };
  };

  const content = getModalContent();

  return (
    <Overlay onClick={closeModal}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <Title>{content.title}</Title>
          <Message>{content.message}</Message>
          <Notice>{content.notice}</Notice>
          <Button onClick={closeModal}>확인</Button>
        </ModalContent>
        <Image src={modalLogo} alt="modalLogo" />
      </Modal>
    </Overlay>
  );
};

export default OrderAcceptanceModal;
