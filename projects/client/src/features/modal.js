export const initModal = () => {
  const dialog = document.querySelector('dialog');
  dialog.addEventListener('close', e => {
    e.target.innerHTML = '';
  });
  dialog.addEventListener('click', e => {
    const dialogDimensions = dialog.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      dialog.close();
    }
  });
};

export const showModal = modal => {
  const dialog = document.querySelector('dialog');
  dialog.innerText = '';
  dialog.appendChild(modal);
  dialog.showModal();
};

export const hideModal = () => {
  const dialog = document.querySelector('dialog');
  dialog.innerText = '';
  dialog.close();
};
