import { createContext, useMemo, useState, useCallback, PropsWithChildren } from 'react';

import { Modal } from '../components/modal';

type ModalContentProps = {
  title: string;
  body: any;
};

export type ModalContextProps = {
  readonly modalVisible: boolean;
  readonly modalContent: ModalContentProps;
  handleModal: (content: ModalContentProps) => void;
  closeModal: () => void,
};

export const ModalContext = createContext<ModalContextProps>({} as ModalContextProps);

const useComposeModal = () => {
  const [modalVisible, showModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: null });

  const handleModal = useCallback(
    ({ title, body }: ModalContentProps) => {
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

export const ModalContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const values = useComposeModal();

  return (
    <ModalContext.Provider value={values}>
      <Modal />
      {children}
    </ModalContext.Provider>
  );
};
