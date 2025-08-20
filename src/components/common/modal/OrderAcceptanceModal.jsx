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
  const { showAcceptanceModal, acceptedOrder, closeModal } =
    useOrderAcceptance();

  if (!showAcceptanceModal || !acceptedOrder) return null;

  const store = acceptedOrder.storeName || "상점";

  return (
    <Overlay onClick={closeModal}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <Title>주문수락</Title>
          <Message>{store} 사장님이 주문 요청을 수락했습니다!</Message>
          <Notice>예약 수락 후 30분 내 픽업 필수입니다</Notice>
          <Button onClick={closeModal}>확인</Button>
        </ModalContent>
        <Image src={modalLogo} alt="modalLogo" />
      </Modal>
    </Overlay>
  );
};

export default OrderAcceptanceModal;
