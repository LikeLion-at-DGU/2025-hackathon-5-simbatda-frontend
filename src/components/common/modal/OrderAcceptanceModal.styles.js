import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background-color: #EAE7E3;
  border-radius: 15px;
  width: 315px;
  padding: 30px 0;
  position: relative;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  position: absolute;
  bottom: -75px;
  right: 0;
  width: 104px;
  height: 100%;
`;

const Title = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: #775C4A;
  margin-bottom: 25px;
`;

const Message = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #775C4A;
  margin-bottom: 12px;
  margin-top: 0;
`;

const Notice = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #37CA79;
  margin-bottom: 30px;
  margin-top: 0;
`;

const Button = styled.button`
  height: 40px;
  width: 107px;
  background-color: #775C4A;
  color: white;
  padding: 10px 0;
  border-radius: 10px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

export {
  Overlay,
  Modal,
  ModalContent,
  Image,
  Title,
  Message,
  Notice,
  Button,
};