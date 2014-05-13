(function () {
  var bookmark = new Bookmark();

  var activateBtn = document.getElementById('activate-btn');
  var isActivated = false;
  activateBtn.onclick = function (e) {
    if (!isActivated) {
      isActivated = true;
      bookmark.activate();
      activateBtn.innerText = 'Deactivate Bookmark!';
    } else {
      bookmark.deactivate();
      activateBtn.innerText = 'Activate Bookmark!';
      isActivated = false;
    }
    e.stopPropagation();
  };

  var navigateBtn = document.getElementById('navigate-btn');
  navigateBtn.onclick = function (e) {
    bookmark.navigate();
    e.stopPropagation();
  };
})();
