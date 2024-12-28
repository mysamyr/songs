import { SubmitModal } from '../';

export default ({ onSubmit }) =>
  SubmitModal({
    onConfirm: onSubmit,
    question:
      'This action will delete all completed list items inside this list. Are you sure?',
    confirmText: 'Clear',
  });
