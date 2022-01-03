/* eslint-disable no-undef */

const showFlashErr = (msg, elemSelector) => {
	const elem = document.querySelector(elemSelector);
	const p = document.createElement("p");
	p.classList.add("msg", "alert");
	p.innerHTML = msg;
	document.querySelector(".container").insertBefore(p, elem);
	flash();
};
const passwordValidate = (form, pass, conf, elemId) => {
	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		const password = form.elements[pass].value;
		const confirm = form.elements[conf].value;
		if (password === confirm) {
			form.submit();
		} else {
			showFlashErr("Паролі мають співпадати", elemId);
		}
	});
};
const flash = () => {
	const flashAlert = document.querySelector(".alert"),
		flashMsg = document.querySelector(".msg");
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
const modal = () => {
	const modalTrigger = document.querySelector("[data-modal]");
	const modal = document.querySelector(".modal");
	const modalClose = document.querySelectorAll("[data-close]");
	const applyButton = document.querySelector("#apply");

	if (modalTrigger) {
		modalTrigger.addEventListener("click", () => {
			if (modalTrigger.dataset.modal && applyButton) {
				applyButton.href = modalTrigger.dataset.modal;
			}
			modal.classList.toggle("show");
			document.body.style.overflow = "hidden";
		});
		modalClose.forEach((close) => {
			close.addEventListener("click", () => {
				modal.classList.toggle("show");
				document.body.style.overflow = "";
			});
		});
		modal.addEventListener("click", (e) => {
			if (e.target === modal) {
				modal.classList.toggle("show");
				document.body.style.overflow = "";
			}
		});
	}
};
const search = () => {
	const searchField = document.querySelector("#search");
	const songsContainer = document.querySelector(".songs");
	const songs = document.querySelectorAll(".song");
	const makeSongsContainer = (song) => {
		const songCard = document.createElement("div");
		songCard.classList.add("card");
		songCard.append(song);

		return songCard;
	};
	if (searchField) {
		searchField.addEventListener("input", () => {
			if (songs.length) {
				const searchValue = searchField.value.toLowerCase();
				const filteredSongs = [];
				songs.forEach((song) => {
					if (song.text.toLowerCase().includes(searchValue)) {
						filteredSongs.push(song);
					}
				});
				if (!filteredSongs.length) {
					songsContainer.innerHTML = "Пісень не знайдено";
				} else if (!searchValue.length) {
					songsContainer.innerHTML = "";
					songs.forEach((song) => {
						const songCard = makeSongsContainer(song);
						songsContainer.appendChild(songCard);
					});
				} else {
					songsContainer.innerHTML = "";
					filteredSongs.forEach((song) => {
						const songCard = makeSongsContainer(song);
						songsContainer.appendChild(songCard);
					});
				}
			}
		});
	}
};
const edit = () => {
	const header = document.querySelector("h1");
	const editBtn = document.querySelector(".edit");
	const editForm = document.querySelector(".category-edit");
	const close = document.getElementById("edit-close");

	if (editBtn) {
		editBtn.addEventListener("click", () => {
			header.classList.add("hide");
			editForm.classList.remove("hide");
		});
		editForm.addEventListener("submit", (e) => {
			e.preventDefault();
			if (editForm.newValue.value === editForm.prevValue.value) {
				showFlashErr("Назви категорії співпадають", "h1");
			} else {
				editForm.submit();
			}
		});
		close.addEventListener("click", () => {
			header.classList.remove("hide");
			editForm.classList.add("hide");
		});
	}
};
const arrow = () => {
	const btn = document.querySelector(".arr_top");
	window.addEventListener("scroll", () => {
		if (document.documentElement.scrollTop > 1) {
			document.body.prepend(btn);
			btn.classList.add("show");
		} else {
			btn.classList.remove("show");
		}
	});
	btn.addEventListener("click", () => {
		document.documentElement.scrollTop = 0;
	});
};
const auth = () => {
	const tabHeaders = document.querySelectorAll(".tab");
	const tabContents = document.querySelectorAll(".tab_content");
	const registerForm = document.getElementById("register-form");
	const [, , password, confirm] = registerForm.elements;
	const isRegister = location.hash === "#register" ? 1 : 0;

	const hideTabs = () => {
		tabContents.forEach((tab) => {
			tab.classList.add("hide");
		});
		tabHeaders.forEach((header) => {
			header.classList.remove("tab_active");
		});
	};
	const showTab = (i = 0) => {
		tabContents[i].classList.remove("hide");
		tabHeaders[i].classList.add("tab_active");
	};

	hideTabs();
	showTab(isRegister);

	tabHeaders.forEach((header, index) => {
		header.addEventListener("click", () => {
			if (!header.classList.contains("tab_active")) {
				hideTabs();
				showTab(index);
			}
		});
	});

	password.addEventListener("keyup", () => {
		if (confirm.value !== password.value) {
			password.setCustomValidity("Паролі мають співпадати");
		} else {
			password.setCustomValidity("");
			confirm.setCustomValidity("");
		}
	});
	confirm.addEventListener("keyup", () => {
		if (confirm.value !== password.value) {
			confirm.setCustomValidity("Паролі мають співпадати");
		} else {
			password.setCustomValidity("");
			confirm.setCustomValidity("");
		}
	});
	passwordValidate(registerForm, "password", "confirm", "#login");
};
const cabinet = () => {
	const emailForm = document.getElementById("email-form");
	const email = document.getElementById("email");
	const currentEmail = email.defaultValue;
	emailForm.addEventListener("submit", (e) => {
		if (email.value === currentEmail) {
			e.preventDefault();
		}
	});
	const emailReset = document.getElementById("email-reset");
	emailReset.addEventListener("click", (e) => {
		e.preventDefault();
		email.value = currentEmail;
	});

	const passwordForm = document.getElementById("password-form");
	const passwordReset = document.getElementById("password-reset");
	const [oldPass, newPass, confirmPass] =
		passwordForm.getElementsByTagName("input");
	passwordValidate(passwordForm, "newPassword", "confirm", "#change-password");
	newPass.addEventListener("keyup", () => {
		if (oldPass.value === newPass.value) {
			newPass.setCustomValidity("Старий і новий паролі не мають співпадати");
		} else if (confirmPass.value !== newPass.value) {
			newPass.setCustomValidity(
				"Новий пароль і підтвердження мають співпадати",
			);
		} else {
			newPass.setCustomValidity("");
			confirmPass.setCustomValidity("");
		}
	});
	confirmPass.addEventListener("keyup", () => {
		if (confirmPass.value !== newPass.value) {
			confirmPass.setCustomValidity(
				"Новий пароль і підтвердження мають співпадати",
			);
		} else {
			if (oldPass.value !== newPass.value) {
				newPass.setCustomValidity("");
			}
			confirmPass.setCustomValidity("");
		}
	});

	passwordReset.addEventListener("click", (e) => {
		e.preventDefault();
		passwordForm.reset();
	});
};
const sideNav = () => {
	const trigger = document.querySelector(".sidenav-trigger");
	const sidebar = document.querySelector(".sidenav");
	const sidebarCover = document.querySelector("#sidenav-cover");
	const toggleNavbar = () => {
		sidebar.classList.toggle("close");
		trigger.classList.toggle("open");
		sidebarCover.classList.toggle("show");
	};
	window.addEventListener("scroll", () => {
		if (!sidebarCover.classList.contains("show")) {
			if (document.documentElement.scrollTop > 1) {
				trigger.classList.add("hide");
			} else {
				trigger.classList.remove("hide");
			}
		}
	});
	trigger.addEventListener("click", () => {
		toggleNavbar();
	});
	sidebarCover.addEventListener("click", (e) => {
		if (!sidebar.classList.contains("close") && e.target !== sidebar) {
			toggleNavbar();
		}
	});
};
document.addEventListener("DOMContentLoaded", () => {
	const pageName = location.pathname.split("/");

	switch (pageName[1]) {
		case "lit":
		case "pan":
			arrow();
			break;
		case "auth":
			// avoid email verification
			if (!pageName[3]) auth();
			break;
		case "cabinet":
			cabinet();
			break;
		case "category":
			// for single category
			if (pageName.length === 3) {
				search();
				edit(pageName[2]);
			}
			break;
	}

	sideNav();
	modal();
	flash();
});
