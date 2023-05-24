/**
 * @fileoverview Implements a service for handling settings data.
 */

const Cache = require('./cache.js');

/**
 * Cache key
 */
const KEY = 'settings';

class SettingsService {
  /**
   * @constructor
   */
  constructor() {
    this.cache = new Cache();
  }

  /**
   * @function get
   * Retrieves settings.
   * @returns {Promise<object>} Settings object
   */
  async get() {
    // Try to fetch from cache first
    const rawSettings = await this.cache.get(KEY);
    const settings = JSON.parse(rawSettings ?? '{}');
    console.log(`[SettingsService] Fetched settings from cache`);

    return settings;
  }

  /**
   * @function set
   * Saves the given settings to the cache.
   * @param {object} settings - Settings object to save
   */
  async set(settings) {
    await this.cache.set(KEY, JSON.stringify(settings ?? {}));
    console.log(`[SettingsService] Saved settings to cache`);
  }
}

module.exports = {
  SettingsService
};
