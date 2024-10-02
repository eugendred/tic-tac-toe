import { createContext, useMemo, useState, useCallback } from 'react';

import { Modal } from '../components/modal';

export const ModalContext = createContext({
  modalVisible: false,
  modalContent: {
    title: '',
    body: null,
  },
  handleModal: (content: any) => null,
  closeModal: () => null,
});

const useComposeModal = () => {
  const [modalVisible, showModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: null });

  const handleModal = useCallback(
    ({ title, body }) => {
      showModal((prev) => !prev);
      setModalContent((prev) => ({
        ...prev,
        title: title ?? prev.title,
        body: body ?? prev.body,
      }));
    },
    [],
  );

  const closeModal = useCallback(() => showModal(false), []);

  const memoedValues = useMemo(
    () => ({
      modalVisible,
      modalContent,
      handleModal,
      closeModal,
    }),
    [
      modalVisible,
      modalContent,
      handleModal,
      closeModal,
    ],
  );

  return memoedValues;
};

export const ModalContextProvider = ({ children }: any) => {
  const values = useComposeModal();

  return (
    <ModalContext.Provider value={values}>
      <Modal />
      {children}
    </ModalContext.Provider>
  );
};
