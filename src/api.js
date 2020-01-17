const BASE_URL = 'https://thinkful-list-api.herokuapp.com/matthewW';

/**
 * A Wrapper function for `fetch` to easily handle errors
 * 
 * @param  {String} BASE_URL
 * @param {Object} options
 * @returns {Promise} 
 */
function apiFetch(...args) {
  let error;
  return fetch(...args)
    .then(res => {
      // if response is not a success, build error object
      if(!res.ok) {
        error = { code: res.status };
      }

      // if response is okay, return JSON
      return res.json();
    })
    .then(data => {
      // if error exists, place message into error object and
      // reject the Promise with error object
      if(error) {
        error.message = data.message;
        return Promise.reject(error);
      }

      // if error is null, return the JSON
      return data;
    });
}

/**
 * Get the list of bookmarks from the server
 */
function getBookmarks() {
  return apiFetch(`${BASE_URL}/bookmarks`);
}

/**
 * Create a bookmark on the server
 * @param {String} title Name of website
 * @param {String} url Link to website(include protocol)
 * @param {String} desc Description of website
 * @param {String} rating Rating out of 5
 */
function createBookmark(title, url, desc, rating) {
  let newBookmark = JSON.stringify({ title, url, desc, rating });
  return apiFetch(`${BASE_URL}/bookmarks`, {
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    body: newBookmark
  });
}

/**
 * Update a bookmark by its id
 * @param {String} id ID of bookmark to update
 * @param {Object} updateData Data to update
 */
function updateBookmark(id, updateData) {
  let newData = JSON.stringify(updateData);
  return apiFetch(`${BASE_URL}/bookmarks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: newData
  });
}

/**
 * Remove a bookmark from the server
 * @param {String} id ID of bookmark to remove
 */
function deleteBookmark(id) {
  return apiFetch(`${BASE_URL}/bookmarks/${id}`, {
    method: 'DELETE'
  });
}

export default {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark
};