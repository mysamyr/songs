import { passwordValidate } from "../helpers.js";

export default () => {
	const tabHeaders = document.querySelectorAll('.tab');
	const tabContents = document.querySelectorAll('.tab_content');
	const registerForm = document.getElementById('register-form');
	const [, , password, confirm] = registerForm.elements;
	const isRegister = location.hash === '#register' ? 1 : 0;

	const hideTabs = () => {
		tabContents.forEach(tab => {
			tab.classList.add('hide');
		});
		tabHeaders.forEach(header => {
			header.classList.remove('tab_active');
		});
	};
	const showTab = (i = 0) => {
		tabContents[i].classList.remove('hide');
		tabHeaders[i].classList.add('tab_active');
	};

	hideTabs();
	showTab(isRegister);

	tabHeaders.forEach((header, index) => {
		header.addEventListener('click', () => {
			if (!header.classList.contains('tab_active')) {
				hideTabs();
				showTab(index);
			}
		});
	});

	password.addEventListener('keyup', () => {
		if (confirm.value !== password.value) {
			password.setCustomValidity('Паролі мають співпадати');
		} else {
			password.setCustomValidity('');
			confirm.setCustomValidity('');
		}
	});
	confirm.addEventListener('keyup', () => {
		if (confirm.value !== password.value) {
			confirm.setCustomValidity('Паролі мають співпадати');
		} else {
			password.setCustomValidity('');
			confirm.setCustomValidity('');
		}
	});
	passwordValidate(registerForm, 'password', 'confirm', '#login');
};
