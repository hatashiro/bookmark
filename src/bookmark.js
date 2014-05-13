/* Copyright (c) 2014 Hyeonje Alex Jun and other contributors
 * Licensed under the MIT License
 */
(function (exports) {
exports.Bookmark = function (opts) {
  if (!(this instanceof exports.Bookmark)) {
    return new exports.Bookmark(opts);
  }
  var self = this;

  /*
    Helper functions
  */
  function setCookie(cname,cvalue,exdays) {var d=new Date();d.setTime(d.getTime()+(exdays*24*60*60*1000));var expires="expires="+d.toGMTString();document.cookie=cname+"="+cvalue+"; "+expires;}
  function getCookie(cname) {var name=cname+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i].trim();if(c.indexOf(name)===0) return c.substring(name.length,c.length);}return "";}
  function extend(target, source) {
    var sourceKeys = Object.keys(source);
    var result = target ? JSON.parse(JSON.stringify(target)) : {}; // object copy
    for (var i = 0; i < sourceKeys.length; i++) {
      var key = sourceKeys[i];
      if (!(key in result)) {
        result[key] = source[key];
      }
    }
    return result;
  }
  function hasClass(el, className) {
    return el.className.indexOf(className) >= 0;
  }
  function addClass(el, className) {
    if (!hasClass(el, className)) {
      el.className += ' ' + className;
    }
  }
  function removeClass(el, className) {
    if (hasClass(el, className)) {
      el.className = el.className.replace(className, '').replace('  ', ' ').replace(/ $/, '');
    }
  }
  function getElementScrollTop(el) {
    var scrollTop = 0;
    while (el) {
        scrollTop += el.offsetTop;
        el = el.offsetParent;
    }
    return scrollTop;
  }

  /*
    Bookmark
  */
  var defaultOpts = {
    useCookie: true,
    cookieName: 'bookmarks',
    className: 'bookmarked',
  };
  opts = extend(opts, defaultOpts);

  bookmarks = [];
  self.updateBookmarks = function (newBookmark) {
    var i;

    if (newBookmark !== undefined) {
      bookmarks = newBookmark;
    }

    var bookmarkedElements = document.getElementsByClassName(opts.className);
    for (i = 0; i < bookmarkedElements.length; i++) {
      removeClass(bookmarkedElements[i], arg.className);
    }

    for (i = 0; i < bookmarks.length; i++) {
      var bookmark = bookmarks[i];
      addClass(document.getElementsByTagName(bookmark.tagName)[bookmark.index], opts.className);
    }
  };
  function findBookmarkIndex(bookmarkToFind) {
    var i;
    for (i = 0; i < bookmarks.length; i++) {
      var bookmark = bookmarks[i];
      if (bookmarkToFind.tagName === bookmark.tagName && bookmarkToFind.index === bookmark.index) {
        return i;
      }
    }
    return -1;
  }

  function updateBookmarksToCookie() {
    setCookie('bookmarks', JSON.stringify(bookmarks), 30);
  }
  function getBookmarksFromCookie() {
    var bookmarkString = getCookie(opts.cookieName);
    if (bookmarkString.length) {
      bookmarks = JSON.parse(bookmarkString);
    }
  }

  var onBookmarkUpdate = null;
  self.update = function (handler) {
    onBookmarkUpdate = handler;
  };
  function callBookmarkUpdateHandler() {
    if (onBookmarkUpdate) {
      onBookmarkUpdate(bookmarks);
    }
  }

  if (opts.useCookie) {
    getBookmarksFromCookie();
  }
  self.updateBookmarks();

  var isInBookmarkMode = false;
  self.activate = function () {
    isInBookmarkMode = true;
  };
  self.deactivate = function () {
    isInBookmarkMode = false;
  };

  function markBookmarkFromPoint(x, y) {
    var el = document.elementFromPoint(x, y);

    var bookmark = {
      tagName: el.tagName,
      index: [].indexOf.call(document.getElementsByTagName(el.tagName), el)
    };

    if (bookmark.tagName.toLowerCase() === 'body') {
      return;
    }

    if (hasClass(el, opts.className)) {
      bookmarks.splice(findBookmarkIndex(bookmark), 1);
      removeClass(el, opts.className);
    } else {
      bookmarks.push(bookmark);
      addClass(el, opts.className);
    }

    if (opts.useCookie) {
      updateBookmarksToCookie();
    }
    callBookmarkUpdateHandler();
  }

  window.onclick = function (e) {
    if (isInBookmarkMode) {
      markBookmarkFromPoint(event.clientX, event.clientY);
    }
  };

  var treatAsClick = false;
  var touch = null;
  window.ontouchstart = function (e) {
    treatAsClick = true;
    touch = e.targetTouches[0];
  };
  window.ontouchmove = function (e) {
    treatAsClick = false;
  };
  window.ontouchend = function (e) {
    if (isInBookmarkMode && treatAsClick) {
      markBookmarkFromPoint(touch.clientX, touch.clientY);
      treatAsClick = false;
    }
  };

  self.navigate = function () {
    var currentScrollTop = document.body.scrollTop;

    var bookmarkedElements = document.getElementsByClassName(opts.className);
    if (bookmarkedElements.length === 0) {
      return;
    }

    var minScrollTop = getElementScrollTop(bookmarkedElements[0]);
    for (var i = 0; i < bookmarkedElements.length; i++) {
      var elementScrollTop = getElementScrollTop(bookmarkedElements[i]);
      minScrollTop = elementScrollTop < minScrollTop ? elementScrollTop : minScrollTop;
      if (elementScrollTop > currentScrollTop) {
        document.body.scrollTop = elementScrollTop;
        return;
      }
    }

    document.body.scrollTop = minScrollTop;
  };
};
})(window);
