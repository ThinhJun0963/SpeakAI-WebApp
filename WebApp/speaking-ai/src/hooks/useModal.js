import { useState } from "react";
import { Modal } from "antd";

const useModal = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const showSuccess = (title, content, onOk) => {
    Modal.success({
      title,
      content,
      centered: true,
      okButtonProps: {
        style: { background: "#52c41a", borderColor: "#52c41a" },
      },
      onOk,
    });
  };

  const showError = (title, content) => {
    Modal.error({
      title,
      content,
      centered: true,
    });
  };

  return {
    visible,
    loading,
    setLoading,
    showModal,
    hideModal,
    showSuccess,
    showError,
  };
};

export default useModal;
