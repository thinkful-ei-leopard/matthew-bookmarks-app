import $ from 'jquery';
import api from './api';
import store from './store';

/**
 * Generate HTML String for a Bookmark
 * @param {Object} bookmark 
 */
function generateBookmarkElement(bookmark) {
  let bookmarkHead = `
      <div class="bookmark-head">
          <h2 class="title">${bookmark.title}</h2>
          ${generateStars(bookmark)}
      </div>`;

  let bookmarkBody = '<div class="bookmark-body hidden">';

  if(bookmark.expanded) {
    bookmarkBody = '<div class="bookmark-body">';
  }

  bookmarkBody += `
        <button class="site-button button">Visit Site</button>
        <p class="description">${bookmark.desc}</p>
        <button class="delete-button button">Delete</button>
      </div>`;

  return `<div class="bookmark" data-bookmark-id="${bookmark.id}">
            ${bookmarkHead}
            ${bookmarkBody}
          </div>`;
}

/**
 * Generates the star rating HTML string for a bookmark
 * @param {Object} bookmark
 */
function generateStars(bookmark) {
  let defaultClass = 'fa fa-star';
  let checkedClass = 'fa fa-star checked';
  return `
    <div>
      <span class="${bookmark.rating >= 1 ? checkedClass : defaultClass}"></span>
      <span class="${bookmark.rating >= 2 ? checkedClass : defaultClass}"></span>
      <span class="${bookmark.rating >= 3 ? checkedClass : defaultClass}"></span>
      <span class="${bookmark.rating >= 4 ? checkedClass : defaultClass}"></span>
      <span class="${bookmark.rating >= 5 ? checkedClass : defaultClass}"></span>
    </div>`;
}

/**
 * Generates HTML String for a list of Bookmarks
 * @param {Array} bookmarkList 
 */
function generateBookmarksString(bookmarkList) {
  const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
  return bookmarks.join('');
}

/**
 * Generates the HTML for the 'Add Bookmark' page
 */
function generateAddingString() {
  return `
    <form class="add-bookmark">
      <label for="title">Title:</label>
      <input type="text" name="title" size="35" placeholder="Google">

      <label for="link">URL:</label>
      <input type="text" name="link" size="35" placeholder="https://www.google.com">

      <label for="rating">Rating:</label>
      <div class="rating" name="rating">
          <input id="star5" name="star" type="radio" value="5" class="radio-btn hidden" />
          <label for="star5">&#9733</label>
          <input id="star4" name="star" type="radio" value="4" class="radio-btn hidden"/>
          <label for="star4">&#9733</label>
          <input id="star3" name="star" type="radio" value="3" class="radio-btn hidden"/>
          <label for="star3">&#9733</label>
          <input id="star2" name="star" type="radio" value="2" class="radio-btn hidden"/>
          <label for="star2">&#9733</label>
          <input id="star1" name="star" type="radio" value="1" class="radio-btn hidden"/>
          <label for="star1">&#9733</label>
          <div class="clear"></div>
      </div>

      <label for="description">Description:</label>
      <textarea form="add-bookmark" rows="4" cols="30" name="description" type="text" placeholder="A wonderful site used to search to the ends of the internet for anything you need."></textarea>
  
      <div class="user-controls">
          <button class="cancel-button button">Cancel</button>
          <input type="submit" class="button">
      </div>
    </form>`;
}

/**
 * Gets the Id of the Bookmark element
 * @param {Object} bookmark 
 */
function getIdFromElement(bookmark) {
  return $(bookmark).closest('.bookmark').data('bookmark-id');
}

function generateError(message) {
  return `
    <section class="error-content">
      <button id="close-button">X</button>
      <p>${message}</p>
    </section>
  `;
}

function renderError() {
  if(store.error) {
    $('.error-box').removeClass('hidden');
    $('.error-box').html(generateError(store.error.message));
  } else {
    $('.error-box').addClass('hidden');
  }
}

/**
 * Renders the Application to the browser window
 */
function render() {
  let html = '';

  renderError();

  // Check if the user is adding a Bookmark
  if(store.adding) {
    // Generate the HTML
    html = generateAddingString();
  } else {
    // Filter the bookmarks if the rating filter is set. Rating must be >= the filter
    let bookmarks = [...store.bookmarks];
    if(store.filter > 0) {
      bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.filter);
    }
    // Generate the HTML
    html = generateBookmarksString(bookmarks);
  }

  $('.bookmark-container').html(html);
}

/**
 * EVENT LISTENERS
 */

/**
 * Handles when the 'Add Bookmark' Button is clicked
 */
function handleAddBookmarkClicked() {
  $('.add-button').click(event => {
    store.adding = true;
    $('.user-controls').addClass('hidden');
    render();
  });
}

/**
 * Handles when the 'Filter' has been set
 */
function handleFilterChange() {
  $('.filter').on('change', event => {
    event.preventDefault();
    let filter = $('.filter').val();
    store.filter = filter;
    render();
  });
}

/**
 * Handles when a Bookmark is clicked and
 * expands/contracts the detailed view
 */
function handleBookmarkClick() {
  $('.bookmark-container').on('click', '.bookmark', event => {
    store.toggleExpandBookmark(getIdFromElement(event.currentTarget));
    render();
  });
}

/**
 * Handles when the 'Visit Site' Button is clicked
 */
function handleVisitSiteClicked() {
  $('.bookmark-container').on('click', '.site-button', event => {
    event.preventDefault();
    let bookmark = store.findById(getIdFromElement(event.currentTarget));
    window.open(`${bookmark.url}`, '_blank');
  });
}

/**
 * Handles when the 'Delete' Button is clicked
 */
function handleDeleteBookmarkClicked() {
  $('.bookmark-container').on('click', '.delete-button', event => {
    event.preventDefault();
    const id = getIdFromElement(event.currentTarget);
    api.deleteBookmark(id)
      .then(() => {
        store.deleteBookmark(id);
        render();
      })
      .catch(error => {
        store.setError(error);
        renderError();
      });
  });
}

/**
 * Handles when the 'Cancel' Button is clicked on
 * 'Add Bookmark' page 
 */
function handleCancelButtonClicked() {
  $('.bookmark-container').on('click', '.cancel-button', event => {
    event.preventDefault();
    store.adding = false;
    $('.user-controls').removeClass('hidden');
    render();
  });
}

/**
 * Handles when the 'Add Bookmark' form is submitted
 */
function handleAddBookmarkSubmit() {
  $('.bookmark-container').on('submit', '.add-bookmark', event => {
    event.preventDefault();
    let title = $('input[name="title"]').val();
    let link = $('input[name="link"]').val();
    let rating = $('input[name="star"]:checked').val();
    let description = $('textarea[name="description"]').val();
    api.createBookmark(title, link, description, rating)
      .then((newBookmark) => {
        store.addBookmark(newBookmark);
        store.adding = false;
        $('.user-controls').removeClass('hidden');
        render();
      })
      .catch(error => {
        store.setError(error);
        renderError();
      });
  });
}

function handleErrorClose() {
  $('.error-box').on('click', '#close-button', event => {
    store.setError(null);
    renderError();
  });
}

/**
 * Runs all Event Listener functions to start Listening
 */
function bindEventListeners() {
  handleAddBookmarkClicked();
  handleFilterChange();
  handleBookmarkClick();
  handleVisitSiteClicked();
  handleDeleteBookmarkClicked();
  handleCancelButtonClicked();
  handleAddBookmarkSubmit();
  handleErrorClose();
}

export default {
  render,
  bindEventListeners
};