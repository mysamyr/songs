const hideModal = (modal) => {
	modal.classList.toggle('show');
	document.body.style.overflow = '';
};

// todo modal tooltip

export default () => {
	const modalTrigger = document.querySelector('[data-modal]');
	const modal = document.querySelector('.modal');
	const modalClose = document.querySelectorAll('[data-close]');
	const applyButton = document.querySelector('#apply');

	if (modalTrigger) {
		modalTrigger.addEventListener('click', () => {
			if (modalTrigger.dataset.modal && applyButton) {
				applyButton.href = modalTrigger.dataset.modal;
			}
			modal.classList.toggle('show');
			document.body.style.overflow = 'hidden';
		});
		modalClose.forEach(close => {
			close.addEventListener('click', () => hideModal(modal));
		});
		modal.addEventListener('click', e => {
			if (e.target === modal) hideModal(modal);
		});
	}
};