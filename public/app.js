M.Tabs.init(document.querySelectorAll(".tabs"));

document.addEventListener('DOMContentLoaded', function() {
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

  const elems = document.querySelectorAll('select');
  M.FormSelect.init(elems);

  const sidebar = document.querySelectorAll('.sidenav');
  M.Sidenav.init(sidebar);
});
