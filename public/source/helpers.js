export const flashTimer = () => {
	const flashAlert = document.querySelector('.alert'),
		flashMsg = document.querySelector('.msg');
	if (flashAlert) {
		setTimeout(() => {
			flashAlert.remove();
		}, 5000);
	}
	if (flashMsg) {
		setTimeout(() => {
			flashMsg.remove();
		}, 5000);
	}
};

export const showFlashErr = (msg, elemSelector) => {
	const p = document.createElement('p');
	p.classList.add('msg', 'alert');
	p.innerHTML = msg;
	document.querySelector('.container').insertBefore(p, document.querySelector(elemSelector));
	flashTimer();
};

export const passwordValidate = (form, pass, conf, elemId) => {
	form.addEventListener('submit', e => {
		e.preventDefault();
		const password = form.elements[pass].value;
		const confirm = form.elements[conf].value;
		if (password === confirm) {
			form.submit();
		} else {
			showFlashErr('Паролі мають співпадати', elemId);
		}
	});
};

export const sideNav = () => {
	const navigation = document.querySelector('nav');
	const trigger = document.querySelector('.sidenav-trigger');
	const sidebar = document.querySelector('.sidenav');
	const sidebarCover = document.querySelector('#sidenav-cover');
	const toggleNavbar = () => {
		sidebar.classList.toggle('close');
		trigger.classList.toggle('open');
		sidebarCover.classList.toggle('show');
	};
	window.addEventListener('scroll', () => {
		if (!sidebarCover.classList.contains('show')) {
			if (document.documentElement.scrollTop > 64) {
				trigger.classList.add('hide');
				navigation.classList.add('hide');
			} else {
				trigger.classList.remove('hide');
				navigation.classList.remove('hide');
			}
		}
	});
	trigger.addEventListener('click', () => {
		toggleNavbar();
	});
	sidebarCover.addEventListener('click', e => {
		if (!sidebar.classList.contains('close') && e.target !== sidebar) {
			toggleNavbar();
		}
	});
};

export const define = schema => {
	const urlParts = location.pathname.split('/').filter(Boolean);
	const schemaParts = schema.split('/').filter(Boolean);

	if (urlParts.length !== schemaParts.length) {
		return false;
	}

	return schemaParts.every(
		(part, index) => part.startsWith(':') || part === urlParts[index]
	);
};