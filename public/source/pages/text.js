import modal from "../modal.js";

const arrow = () => {
	const btn = document.querySelector('.arr_top');
	window.addEventListener('scroll', () => {
		if (document.documentElement.scrollTop > 1) {
			document.body.prepend(btn);
			btn.classList.add('show');
		} else {
			btn.classList.remove('show');
		}
	});
	btn.addEventListener('click', () => {
		document.documentElement.scrollTop = 0;
	});
};

export default () => {
	arrow();
	modal();
};
