M.Tabs.init(document.querySelectorAll(".tabs"));

document.addEventListener('DOMContentLoaded', function() {

  const elems = document.querySelectorAll('select');
  const inst = M.FormSelect.init(elems);

  const sidebar = document.querySelectorAll('.sidenav');
  const inst1 = M.Sidenav.init(sidebar);
});