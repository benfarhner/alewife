/**
 * @fileoverview Implements a service for handling tap data.
 */

const Cache = require('./cache.js');

/**
 * Cache key
 */
const KEY = 'taps';

class TapService {
  /**
   * @constructor
   */
  constructor() {
    this.cache = new Cache();
  }

  /**
   * @function getTaps
   * Retrieves taps.
   * @returns {Promise<Array<object>>} List of taps
   */
  async get() {
    // Try to fetch from cache first
    const rawTaps = await this.cache.get(KEY);
    const taps = JSON.parse(rawTaps ?? '[]');
    console.log(`[TapService] Fetched taps from cache`);

    return taps;
  }

  /**
   * @function setTaps
   * Saves the given taps to the cache.
   * @param {Array<object>} taps - List of taps to save
   */
  async set(taps) {
    await this.cache.set(KEY, JSON.stringify(taps ?? []));
    console.log(`[TapService] Saved taps to cache`);
  }
}

module.exports = {
  TapService
};
