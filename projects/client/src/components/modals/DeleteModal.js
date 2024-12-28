import { SubmitModal } from '../';

export default ({ onSubmit }) =>
  SubmitModal({
    onConfirm: onSubmit,
    question: 'Are you sure you want to delete the item?',
    confirmText: 'Delete',
  });
