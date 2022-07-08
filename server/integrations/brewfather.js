/**
 * @fileoverview Implements an integration with the Brewfather API.
 */

const fetch = require('node-fetch');

/**
 * Brewfather API root URL.
 */
const API_ROOT = 'https://api.brewfather.app/v1';

/**
 * API resource for batches.
 */
const BATCHES_RESOURCE = 'batches';

class Brewfather {
  /**
   * @constructor
   * Assumes the following environment variables are available:
   * - `BREWFATHER_USER_ID`
   * - `BREWFATHER_API_KEY`
   */
  constructor() {
    this.userId = process.env.BREWFATHER_USER_ID;
    this.apiKey = process.env.BREWFATHER_API_KEY;
  }

  /**
   * @function getBatches
   * Retrieves batches.
   * @param {string} status - Batch status to fetch
   * @returns {Promise<Array<object>>} List of batches
   */
  async getBatches(status) {
    const include = [
      'measuredAbv',
      'measuredFg',
      'status',
      'brewDate',
      'measuredOg',
      'bottlingDate',
      'recipe.color',
      'recipe.abv',
      'recipe.name',
      'recipe.ibu',
      'recipe.fg',
      'recipe.og',
      'recipe.rbRatio',
      'recipe.style.name',
      'measuredBatchSize',
      'fermentationStartDate',
      'estimatedBuGuRatio',
      'estimatedColor',
      'batchNo',
      'estimatedIbu',
      'name',
      '_id',
      'estimatedRbRatio',
      'estimatedOg',
    ];

    //"Brewing", "Fermenting", "Conditioning", "Completed"
    const params = new URLSearchParams();
    params.append('status', status);
    params.append('include', include.join(','));

    const url = this.getUrl(BATCHES_RESOURCE, null, params);

    return await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${this.getAuthKey()}`,
      },
    })
      .then(response => response.json());
  }

  /**
   * @function getUrl
   * Builds an API URL for the given resource and optional ID.
   * @param {string} resource - API resource
   * @param {string} [id] - Optional resource ID
   * @param {object} [params] - Optional query params object
   */
  getUrl(resource, id, params) {
    let url = `${API_ROOT}/${resource}`;

    if (id) {
      url += '/' + id;
    }

    if (params) {
      url += '?' + params.toString();
    }

    return url;
  }

  /**
   * @function getAuthKey
   * Builds the authentication key to send with each request.
   * @returns {string} Authentication key
   */
  getAuthKey() {
    return Buffer
      .from(`${this.userId}:${this.apiKey}`)
      .toString('base64');
  }
}

module.exports = Brewfather;
