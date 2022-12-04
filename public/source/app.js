import M from "materialize-css";
import {lit, pan} from "./text";

const makeSongsContainer = (song) => {
  const songCard = document.createElement("div");
  songCard.classList.add("card");
  songCard.append(song);

  return songCard;
};
const modal = () => {
  const modalTrigger = document.querySelector("[data-modal]");
  const modal = document.querySelector(".mod");
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
const arrow = () => {
  const btn = document.createElement("i");
  btn.classList.add("material-icons", "arr_top");
  btn.innerHTML = "arrow_upward";
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

const liturgy = () => {
  const text = document.querySelector("#template");
  text.innerHTML = lit;

  arrow();

  const modalTrigger = document.querySelector("[data-modal]"),
    modal = document.querySelector(".mod"),
    modalClose = document.querySelectorAll("[data-close]");

  modalTrigger.addEventListener("click", () => {
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
};
const panachyda = () => {
  const text = document.querySelector("#template");
  text.innerHTML = pan;

  arrow();
};
const cabinet = () => {
  const email = document.querySelector("#email");
  const currentEmail = email.defaultValue;
  const emailReset = document.querySelector("#email-reset");
  emailReset.addEventListener("click", e => {
    e.preventDefault();
    email.value = currentEmail;
  });

  const passwordForm = document.querySelector("#password");
  const passwordReset = document.querySelector("#password-reset");
  const [
    ,
    newPass,
    confirmPass
  ] = passwordForm.getElementsByTagName("input");

  newPass.addEventListener("focusout", e => {
    if (e.target.value.trim().length < 8) {
      e.target.classList.remove("valid");
      e.target.classList.add("invalid");
    }
    if (e.target.value !== confirmPass.value) {
      confirmPass.classList.remove("valid");
      confirmPass.classList.add("invalid");
    } else {
      confirmPass.classList.remove("invalid");
      confirmPass.classList.add("valid");
    }
  });
  confirmPass.addEventListener("keyup", e => {
    if (e.target.value !== newPass.value) {
      e.target.classList.remove("valid");
      e.target.classList.add("invalid");
    } else {
      e.target.classList.remove("invalid");
      e.target.classList.add("valid");
    }
  });

  passwordReset.addEventListener("click", e => {
    e.preventDefault();
    passwordForm.reset();
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const pageName = location.pathname.split("/");

  // sidebar for mobile
  M.Sidenav.init(document.querySelectorAll(".sidenav"));

  // flash events
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

  switch (pageName[1]) {
    case "lit":
      liturgy();
      break;
    case "pan":
      panachyda();
      break;
    case "auth":
      M.Tabs.init(document.querySelectorAll(".tabs"));
      break;
    case "cabinet":
      cabinet();
      break;
    case "category":
      // for single category
      if (pageName.length === 3) {
        search();
        modal();
      }
      break;
    case "song":
      if (pageName[2] === "add" || pageName[2] === "edit") {
        M.FormSelect.init(document.querySelectorAll("select"));
      } else {
        modal();
      }
      break;
  }
});
