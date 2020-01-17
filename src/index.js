import $ from 'jquery';
import './index.css';

import api from './api';
import store from './store';
import bookmark from './bookmark';

function main() {
  api.getBookmarks()
    .then(bookmarks => {
      bookmarks.forEach(bookmark => store.addBookmark(bookmark));
      bookmark.render();
    })
    .catch(error => {
      store.setError(error);
      bookmark.render();
    });

  bookmark.bindEventListeners();
}

$(main);