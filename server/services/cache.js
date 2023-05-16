/**
 * @fileoverview Implements a cache.
 */

const { createClient } = require('redis');

class Cache {
  /**
   * @constructor
   * Assumes the following environment variables are available:
   * - `REDIS_TLS_URL`
   * - `REDIS_URL`
   */
  constructor() {
    // Initialize Redis cache
    this.client = createClient({ url: process.env.REDIS_URL });

    // Track connected state
    this.connected = false;

    // Handle Redis errors
    this.client.on('error', (err) => console.log('[Cache] Redis client error', err));
    this.client.on('connect', () => console.log('[Cache] Redis client connected'));
    this.client.on('reconnecting', () => console.log('[Cache] Redis client reconnecting'));
    this.client.on('ready', () => console.log('[Cache] Redis client ready'));
  }

  /**
   * @function connect
   * Ensure client is connected.
   */
  async connect() {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
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
    await this.client.set(key, value);
  }

  /**
   * @function get
   * Retrieves a cache item.
   * @param {string} key - Cache key
   * @returns {string} Cache item value
   */
  async get(key) {
    await this.connect();
    return await this.client.get(key);
  }

  /**
   * @function delete
   * Removes an item from the cache.
   * @param {string} key - Cache key
   */
  async delete(key) {
    await this.connect();
    await this.client.DEL(key);
  }
}

module.exports = Cache;
