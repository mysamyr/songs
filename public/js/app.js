import {lit, pan} from "./text";

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
const makeSongsContainer = (song) => {
  const songCard = document.createElement("div");
  songCard.classList.add("card");
  songCard.append(song);

  return songCard;
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
const auth = () => {
  const tabHeaders = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab_content");

  const hideTabs = () => {
    tabContents.forEach(tab => {
      tab.classList.add("hide");
    });
    tabHeaders.forEach(header => {
      header.classList.remove("tab_active");
    });
  };
  const showTab = (i = 0) => {
    tabContents[i].classList.remove("hide");
    tabHeaders[i].classList.add("tab_active");
  };

  hideTabs();
  showTab();

  tabHeaders.forEach((header, index) => {
    header.addEventListener("click", () => {
      if (!header.classList.contains("tab_active")) {
        hideTabs();
        showTab(index);
      }
    });
  });
};
const text = (text) => {
  const container = document.querySelector(".container");
  container.innerHTML = text;
};
const cabinet = () => {
  const emailForm = document.querySelector("#email-form");
  const email = document.querySelector("#email");
  const currentEmail = email.defaultValue;
  emailForm.addEventListener("submit", e => {
    if (email.value === currentEmail) {
      e.preventDefault();
    }
  });
  const emailReset = document.querySelector("#email-reset");
  emailReset.addEventListener("click", e => {
    e.preventDefault();
    email.value = currentEmail;
  });

  const passwordForm = document.querySelector("#password-form");
  const passwordReset = document.querySelector("#password-reset");
  const [
    oldPass,
    newPass,
    confirmPass
  ] = passwordForm.getElementsByTagName("input");

  oldPass.addEventListener("keyup", () => {
    if (oldPass.value === newPass.value) {
      newPass.classList.add("invalid");
    } else {
      newPass.classList.remove("invalid");
    }
  });
  newPass.addEventListener("keyup", () => {
    if (newPass.value.trim().length < 8 || oldPass.value === newPass.value) {
      newPass.classList.add("invalid");
    } else {
      newPass.classList.remove("invalid");
    }
  });
  confirmPass.addEventListener("keyup", () => {
    if (confirmPass.value !== newPass.value) {
      confirmPass.classList.add("invalid");
    } else {
      confirmPass.classList.remove("invalid");
    }
  });

  passwordReset.addEventListener("click", e => {
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
  trigger.addEventListener("click", () => {
    toggleNavbar();
  });
  sidebarCover.addEventListener("click", e => {
    if(!sidebar.classList.contains("close") && e.target !== sidebar) {
      toggleNavbar();
    }
  });
};
document.addEventListener("DOMContentLoaded", () => {
  const pageName = location.pathname.split("/");

  switch (pageName[1]) {
    case "lit":
      text(lit);
      arrow();
      break;
    case "pan":
      text(pan);
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
      }
      break;
  }

  sideNav();
  modal();
  flash();
});
