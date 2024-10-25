import { memo } from 'react';

import { Dialog, DialogTitle, DialogContent, IconButton, styled } from '@mui/material';
import Close from '@mui/icons-material/Close';

import useModal from '../../hooks/useModal';

const StyledDialog = styled(Dialog)({
  '& .MuiDialogTitle-root + .MuiDialogContent-root, & .MuiDialogContent-root': {
    padding: '1.25rem',
  },
});

export const Modal: React.FC = memo(() => {
  const { closeModal, modalVisible, modalContent } = useModal();

  return (
    <StyledDialog open={modalVisible} onClose={closeModal}>
      {modalContent?.title ? (
        <DialogTitle sx={{ p: 1.5, pb: 0, minHeight: '2rem', minWidth: '20rem' }}>
          {modalContent.title}
          <IconButton sx={{ position: 'absolute', right: 8, top: 3 }} onClick={closeModal}>
            <Close />
          </IconButton>
        </DialogTitle>
      ) : null}
      <DialogContent dividers={Boolean(modalContent.title)}>{modalContent.body}</DialogContent>
    </StyledDialog>
  );
});
