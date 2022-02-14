import M from "materialize-css";
import {lit, pan} from "./text";

document.addEventListener('DOMContentLoaded', function () {
  // tabs for auth
  M.Tabs.init(document.querySelectorAll(".tabs"));

  // beauty select view
  M.FormSelect.init(document.querySelectorAll('select'));

  // sidebar for mobile
  M.Sidenav.init(document.querySelectorAll('.sidenav'));

  // flash events
  const flashAlert = document.querySelector(".alert"),
    flashMsg = document.querySelector(".msg");
  if (flashAlert) {
    setTimeout(function () {
      flashAlert.remove();
    }, 3000);
  }
  if (flashMsg) {
    setTimeout(function () {
      flashMsg.remove();
    }, 3000);
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

    const over = document.createElement("div");
    over.classList.add("screen");
    const btn = document.createElement("i");
    btn.classList.add("material-icons", "arr_top");
    btn.innerHTML = "arrow_upward";
    over.append(btn);
    window.addEventListener("scroll", function () {
      if (document.documentElement.scrollTop > 1) {
        document.body.prepend(over);
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

  modalTrigger.addEventListener("click", function () {
    modal.classList.toggle("show");
    document.body.style.overflow = "hidden";
  });
  modalClose.forEach(function (c) {
    c.addEventListener("click", function () {
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
});
