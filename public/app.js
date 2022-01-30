M.Tabs.init(document.querySelectorAll(".tabs"));

document.addEventListener('DOMContentLoaded', function() {
  // flash events
  const flashAlert = document.querySelector(".alert");
  const flashMsg = document.querySelector(".msg");
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
  // liturgy
  const liturgyText = document.querySelector("#lit");
   if (liturgyText) {
     const container = document.querySelector(".container");

     container.innerHTML = liturgyText.getAttribute("data-text");

     liturgyText.remove();

     const button = document.createElement("div");
     button.className = "buttons";
     button.innerHTML = `<form action="/" method="GET">
        <button class="btn goHome">На головну</button>
    </form>`;

     container.append(button)
   }
  // beauty select view
  const elems = document.querySelectorAll('select');
  M.FormSelect.init(elems);

  // sidebar for mobile
  const sidebar = document.querySelectorAll('.sidenav');
  M.Sidenav.init(sidebar);
});
