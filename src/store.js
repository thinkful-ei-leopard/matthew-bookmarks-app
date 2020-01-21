const bookmarks = [];
let adding = false;
let filter = 0;
let error = null;

/**
 * Find a bookmark from the local store by its id
 * @param {String} id ID of Bookmark Object to find
 */
function findById(id) {
  return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
}

/**
 * Add a bookmark to the local store
 * @param {Object} bookmark Bookmark Object to add
 */
function addBookmark(bookmark) {
  this.bookmarks.push(bookmark);
}

/**
 * Update a bookmark's data in the local store
 * @param {String} id ID of bookmark object to update
 * @param {Object} newData Set of data to update
 */
function updateBookmark(id, newData) {
  const currentBookmark = this.findById(id);
  Object.assign(currentBookmark, newData);
}

/**
 * Remove a bookmark from the local store
 * @param {String} id ID of bookmark Object to remove
 */
function deleteBookmark(id) {
  this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id !== id);
}

/**
 * Toggle a bookmark to expand/contract
 * @param {String} id 
 */
function toggleExpandBookmark(id) {
  let bookmark = this.findById(id);
  bookmark.expanded = !bookmark.expanded;
}

/**
 * Toggle the 'adding' Boolean
 */
function toggleAdding() {
  this.adding = !this.adding;
}

/**
 * Set the filter
 * @param {Number} num 
 */
function setFilter(num) {
  this.filter = num;
}

/**
 * Set the error
 * @param {Object} error 
 */
function setError(error) {
  this.error = error;
}

export default {
  bookmarks,
  adding,
  filter,
  error,
  findById,
  addBookmark,
  updateBookmark,
  deleteBookmark,
  toggleExpandBookmark,
  toggleAdding,
  setFilter,
  setError
}