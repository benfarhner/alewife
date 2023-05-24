/**
 * @fileoverview Implements a cache.
 * 
 * Assumes the following environment variables are available:
 * - `REDIS_URL`
 */

const { createClient } = require('redis');

/**
 * Static reference to the client, used across instances of Cache.
 */
let _client = null;

class Cache {
  /**
   * @function connect
   * Ensure client is connected. Always call this before any further actions.
   */
  async connect() {
    if (!_client) {
      // Initialize Redis cache
      _client = createClient({ url: process.env.REDIS_URL });
  
      // Handle Redis errors
      _client.on('error', (err) => console.log('[Cache] Redis client error', err));
      _client.on('connect', () => console.log('[Cache] Redis client connected'));
      _client.on('reconnecting', () => console.log('[Cache] Redis client reconnecting'));
      _client.on('ready', () => console.log('[Cache] Redis client ready'));
      
      // Connect to the Redis cache
      await _client.connect();
    }
  }

  /**
   * @function set
   * Sets a value in the cache.
   * @param {string} key - Cache key
   * @param {string} value - Value to cache
   */
  async set(key, value) {
    await this.connect();
    await _client.set(key, value);
  }

  /**
   * @function get
   * Retrieves a cache item.
   * @param {string} key - Cache key
   * @returns {string} Cache item value
   */
  async get(key) {
    await this.connect();
    return await _client.get(key);
  }

  /**
   * @function delete
   * Removes an item from the cache.
   * @param {string} key - Cache key
   */
  async delete(key) {
    await this.connect();
    await _client.DEL(key);
  }
}

module.exports = Cache;
