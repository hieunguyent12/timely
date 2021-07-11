import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

interface Props {
  title: string;
  renderBody: () => JSX.Element;
  renderFooter: () => JSX.Element;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function ModalComponent({
  isOpen,
  onClose,
  title,
  renderBody,
  renderFooter,
}: Props) {
  return (
    <Modal isOpen onClose={onClose as () => void}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{renderBody()}</ModalBody>

        <ModalFooter>{renderFooter()}</ModalFooter>
      </ModalContent>
    </Modal>
  );
}
