/**
 * @fileoverview Implements a class for handling API calls.
 */

const API_ROOT = 'http://localhost:5000/api';
const BATCHES_RESOURCE = 'batches';

export default class Api {
  /**
   * @constructor
   */
  constructor() { }

  /**
   * @function getBatches
   * Retrieves the current batches.
   * @returns {Promise<Array<object>>} List of batches
   */
  async getBatches() {
    const url = this.getUrl(BATCHES_RESOURCE);

    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
      .then(response => response.json());
  }

  /**
   * @function getUrl
   * Builds a URL for the given API resource and optional ID.
   * @param {string} resource - API resource
   * @param {string} [id] - Optional resource ID
   * @returns {string} URL
   */
  getUrl(resource, id) {
    let url = `${API_ROOT}/${resource}`;

    if (id) {
      url = `${url}/${id}`;
    }

    return url;
  }
}
