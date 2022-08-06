import M from "materialize-css";
import {lit, pan} from "./text";

function makeSongsContainer(song) {
  const songContent = document.createElement("div");
  songContent.classList.add("card-content");
  songContent.append(song);
  const songCard = document.createElement("div");
  songCard.classList.add("card");
  songCard.append(songContent);
  return songCard;
}

document.addEventListener("DOMContentLoaded", function () {
  // tabs for auth
  M.Tabs.init(document.querySelectorAll(".tabs"));

  // beauty select view
  M.FormSelect.init(document.querySelectorAll("select"));

  // sidebar for mobile
  M.Sidenav.init(document.querySelectorAll(".sidenav"));

  // flash events
  const flashAlert = document.querySelector(".alert"),
    flashMsg = document.querySelector(".msg");
  if (flashAlert) {
    setTimeout(function () {
      flashAlert.remove();
    }, 5000);
  }
  if (flashMsg) {
    setTimeout(function () {
      flashMsg.remove();
    }, 5000);
  }

  // Templates view
  const text = document.querySelector("#template");
  if (text) {
    switch (text.getAttribute("data-text")) {
      case "lit":
        text.innerHTML = lit;
        break;
      case "pan":
        text.innerHTML = pan;
        break;
    }

    // Arrow
    const btn = document.createElement("i");
    btn.classList.add("material-icons", "arr_top");
    btn.innerHTML = "arrow_upward";
    window.addEventListener("scroll", function () {
      if (document.documentElement.scrollTop > 1) {
        document.body.prepend(btn);
        btn.classList.add("show");
      } else {
        btn.classList.remove("show");
      }
    });
    btn.addEventListener("click", function () {
      document.documentElement.scrollTop = 0;
    });
  }

  // Modal
  const modalTrigger = document.querySelector("[data-modal]"),
    modal = document.querySelector(".mod"),
    modalClose = document.querySelectorAll("[data-close]");

  if (modalTrigger) {
    const applyButton = document.querySelector("#apply");
    modalTrigger.addEventListener("click", function () {
      if (modalTrigger.dataset.modal && applyButton) {
        applyButton.href = modalTrigger.dataset.modal;
      }
      modal.classList.toggle("show");
      document.body.style.overflow = "hidden";
    });
    modalClose.forEach(function (close) {
      close.addEventListener("click", function () {
        modal.classList.toggle("show");
        document.body.style.overflow = "";
      });
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.classList.toggle("show");
        document.body.style.overflow = "";
      }
    });
  }

  // Search
  let searchField = document.querySelector("#search"),
    songsContainer = document.querySelector(".songs"),
    songs = document.querySelectorAll(".song");
  if (searchField) {
    searchField.addEventListener("input", function () {
      if (songs.length) {
        const searchValue = searchField.value.toLowerCase();
        const filteredSongs = [];
        songs.forEach(function (song) {
          if (song.text.toLowerCase().includes(searchValue)) {
            filteredSongs.push(song);
          }
        });
        if (!filteredSongs.length) {
          songsContainer.innerHTML = "Пісень не знайдено";
        } else if (!searchValue.length) {
          songsContainer.innerHTML = "";
          songs.forEach(function (song) {
            const songCard = makeSongsContainer(song);
            songsContainer.appendChild(songCard);
          });
        } else {
          songsContainer.innerHTML = "";
          filteredSongs.forEach(function (song) {
            const songCard = makeSongsContainer(song);
            songsContainer.appendChild(songCard);
          });
        }
      }
    });
  }
});
