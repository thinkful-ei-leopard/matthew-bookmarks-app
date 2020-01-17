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
          <h3 class="title">Title5</h3>
          <div>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star"></span>
              <span class="fa fa-star"></span>
          </div>
      </div>`;

  let bookmarkBody = '<div class="bookmark-body hidden">';

  if(bookmark.expanded) {
    bookmarkBody = '<div class="bookmark-body">';
  }

  bookmarkBody += `
        <button class="site-button button">Visit Site</button>
        <p class="description">${bookmark.description}</p>
        <button class="delete-button button">Delete</button>
      </div>`;

  return `<div class="bookmark" data-bookmark-id="${bookmark.id}">
            ${bookmarkHead}
            ${bookmarkBody}
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
      <input type="text" name="title" size="35" placeholder="Google" required>

      <label for="link">Link:</label>
      <input type="text" name="link" size="35" placeholder="https://www.google.com" required>

      <label for="rating">Rating:</label>
      <div class="rating" name="rating">
          <input id="star5" name="star" type="radio" value="5" class="radio-btn hidden" required />
          <label class="fa-star" for="star5">☆</label class="fa-star">
          <input id="star4" name="star" type="radio" value="4" class="radio-btn hidden" required/>
          <label class="fa-star" for="star4">☆</label class="fa-star">
          <input id="star3" name="star" type="radio" value="3" class="radio-btn hidden" required/>
          <label class="fa-star" for="star3">☆</label class="fa-star">
          <input id="star2" name="star" type="radio" value="2" class="radio-btn hidden" required/>
          <label class="fa-star" for="star2">☆</label class="fa-star">
          <input id="star1" name="star" type="radio" value="1" class="radio-btn hidden" required/>
          <label class="fa-star" for="star1">☆</label>
          <div class="clear"></div>
      </div>

      <label for="description">Description:</label>
      <textarea form="add-bookmark" rows="4" cols="30" name="description" placeholder="A wonderful site used to search to the ends of the internet for anything you need." required></textarea>
  
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

/**
 * Renders the Application to the browser window
 */
function render() {
  let html = '';

  // Check if the user is adding a Bookmark
  if(store.adding) {
    // Generate the HTML
    html = generateAddingString();
  } else {
    // Filter the bookmarks if the rating filter is set. Rating must be >= the filter
    let bookmarks = [...store.bookmarks];
    if(store.bookmarks > 0) {
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
    render();
  });
}

/**
 * Handles when the 'Filter' has been set
 */
function handleFilterSubmit() {
  $('.filter').submit(event => {
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

}

/**
 * Handles when the 'Delete' Button is clicked
 */
function handleDeleteBookmarkClicked() {
  const id = getIdFromElement(event.currentTarget);

  $('.bookmark-container').on('click', '.delete-button', event => {
    api.deleteBookmark(id)
      .then(() => {
        store.deleteBookmark(id);
        render();
      })
      .catch(error => {
        store.setError(error);
      // renderError();
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
    render();
  });
}

/**
 * Handles when the 'Add Bookmark' form is submitted
 */
function handleAddBookmarkSubmit() {

}

/**
 * Runs all Event Listener functions to start Listening
 */
function bindEventListeners() {
  handleAddBookmarkClicked();
  handleFilterSubmit();
  handleBookmarkClick();
  handleVisitSiteClicked();
  handleDeleteBookmarkClicked();
  handleCancelButtonClicked();
  handleAddBookmarkSubmit();
}

export default {
  render,
  bindEventListeners
};