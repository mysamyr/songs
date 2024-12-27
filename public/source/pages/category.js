import { showFlashErr } from "../helpers.js";
import modal from "../modal.js";

const search = () => {
	const searchField = document.querySelector('#search');
	const songsContainer = document.querySelector('.songs');
	const songs = document.querySelectorAll('.song');
	const makeSongsContainer = song => {
		const songCard = document.createElement('div');
		songCard.classList.add('card');
		songCard.append(song);

		return songCard;
	};
	if (searchField) {
		searchField.addEventListener('input', () => {
			if (songs.length) {
				const searchValue = searchField.value.toLowerCase();
				const filteredSongs = [];
				songs.forEach(song => {
					if (song.text.toLowerCase().includes(searchValue)) {
						filteredSongs.push(song);
					}
				});
				if (!filteredSongs.length) {
					songsContainer.innerHTML = 'Пісень не знайдено';
				} else if (!searchValue.length) {
					songsContainer.innerHTML = '';
					songs.forEach(song => {
						const songCard = makeSongsContainer(song);
						songsContainer.appendChild(songCard);
					});
				} else {
					songsContainer.innerHTML = '';
					filteredSongs.forEach(song => {
						const songCard = makeSongsContainer(song);
						songsContainer.appendChild(songCard);
					});
				}
			}
		});
	}
};

const rename = () => {
	const header = document.querySelector('h1');
	const editBtn = document.querySelector('.rename');
	const editForm = document.querySelector('.category-edit');
	const close = document.getElementById('edit-close');

	if (editBtn) {
		editBtn.addEventListener('click', () => {
			header.classList.add('hide');
			editForm.classList.remove('hide');
		});
		editForm.addEventListener('submit', e => {
			e.preventDefault();
			if (editForm.newValue.value === editForm.prevValue.value) {
				showFlashErr('Назви категорії співпадають', 'h1');
			} else {
				editForm.submit();
			}
		});
		close.addEventListener('click', () => {
			header.classList.remove('hide');
			editForm.classList.add('hide');
		});
	}
};

export default () => {
	search();
	rename();
	modal();
};
