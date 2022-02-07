import M from "materialize-css"

document.addEventListener('DOMContentLoaded', function () {
  try {
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
      setTimeout(function() {
        flashAlert.remove();
      }, 3000);
    }
    if (flashMsg) {
      setTimeout(function() {
        flashMsg.remove();
      }, 3000);
    }

    // Templates view
    const liturgyText = document.querySelector("#template");
    if (liturgyText) {
      const container = document.querySelector(".container");
      container.innerHTML = liturgyText.getAttribute("data-text");
      liturgyText.remove();

      const buttonWrapper = document.createElement("div");
      buttonWrapper.className = "buttons";
      buttonWrapper.innerHTML = '<form action="/" method="GET"><button class="btn goHome">На головну</button></form>';

      container.append(buttonWrapper)
    }

    // Modal
    const modalTrigger = document.querySelector("[data-modal]"),
      modal = document.querySelector(".mod"),
      modalClose = document.querySelectorAll("[data-close]");

    modalTrigger.addEventListener("click", function() {
      modal.classList.toggle("show");
      document.body.style.overflow = "hidden";
    });

    modalClose.forEach(function(c) {
      c.addEventListener("click", function() {
        modal.classList.toggle("show");
        document.body.style.overflow = "";
      });
    });

    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        modal.classList.toggle("show");
        document.body.style.overflow = "";
      }
    });
  } catch (e) {
    console.log(e);
  }
});
