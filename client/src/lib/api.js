/**
 * @fileoverview Implements a class for handling API calls.
 */

const API_ROOT = `${process.env.REACT_APP_API_URL}/api`;
const BATCHES_RESOURCE = 'batches';
const TAPS_RESOURCE = 'taps';
const SETTINGS_RESOURCE = 'settings';

export default class Api {
  /**
   * @function getBatches
   * Retrieves the current batches.
   * @returns {Promise<Array<object>>} List of batches
   */
  async getBatches() {
    return this._getJson(BATCHES_RESOURCE);
  }

  /**
   * @function getTaps
   * Retrieves the current taps.
   * @returns {Promise<Array<object>>} List of taps
   */
  async getTaps() {
    return this._getJson(TAPS_RESOURCE);
  }

  /**
   * @function saveTaps
   * Saves the given list of taps.
   * @param {Array<object>} taps - List of taps to save
   * @returns {Promise}
   */
  async saveTaps(taps) {
    return this._postJson(taps, TAPS_RESOURCE);
  }
  
  /**
   * @function getSettings
   * Retrieves the settings.
   * @returns {Promise<object>} Settings object
   */
  async getSettings() {
    return this._getJson(SETTINGS_RESOURCE);
  }

  /**
   * @function saveSettings
   * Saves the given settings.
   * @param {object} settings - Settings object to save
   * @returns {Promise}
   */
  async saveSettings(settings) {
    return this._postJson(settings, SETTINGS_RESOURCE);
  }

  /**
   * @function _getUrl
   * Builds a URL for the given API resource and optional ID.
   * @param {string} resource - API resource
   * @param {string} [id] - Optional resource ID
   * @returns {string} URL
   */
  _getUrl(resource, id) {
    let url = `${API_ROOT}/${resource}`;

    if (id) {
      url = `${url}/${id}`;
    }

    return url;
  }

  /**
   * @function _getJson
   * Fetches the given resource with optional resource ID as JSON data.
   * @param {string} resource - API resource
   * @param {string} [id] - Optional resource ID
   * @returns {Promise} Promise with JSON response
   */
  _getJson(resource, id) {
    const url = this._getUrl(resource, id);

    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json());
  }

  /**
   * @function _postJson
   * Posts the given data to the given resource with optional resource ID as
   * JSON.
   * @param {any} payload - Payload to send as JSON
   * @param {string} resource - API resource
   * @param {string} [id] - Optional resource ID
   * @returns {Promise} Promise with JSON response
   */
  _postJson(payload, resource, id) {
    const url = this._getUrl(resource, id);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  }
}
