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
    setTimeout(() => {
      flashAlert.remove();
    }, 3000);
  }
  if (flashMsg) {
    setTimeout(() => {
      flashMsg.remove();
    }, 3000);
  }

  // liturgy view
  const liturgyText = document.querySelector("#lit");
  if (liturgyText) {
    const container = document.querySelector(".container");

    container.innerHTML = liturgyText.getAttribute("data-text");

    liturgyText.remove();

    const buttonWrapper = document.createElement("div");
    buttonWrapper.className = "buttons";
    buttonWrapper.innerHTML = `
        <form action="/" method="GET">
            <button class="btn goHome">На головну</button>
        </form>
    `;

    container.append(buttonWrapper)
  }
});
