/**
 * @fileoverview Implements a service for handling batch data.
 */

const { BrewfatherStatuses, Brewfather } = require('../integrations/brewfather.js');
const { BatchStatuses } = require('../lib/batch-statuses.js');
const Cache = require('./cache.js');

class BatchService {
  /**
   * @constructor
   */
  constructor() {
    this.brewfather = new Brewfather();
    this.cache = new Cache();
  }

  /**
   * @function getAllBatches
   * Retrieves all batches
   * @returns {Promise<Array<object>>} List of batches
   */
  async getAllBatches() {
    // Retrieve batches in each status
    const planning = await this.getBatches(BatchStatuses.PLANNING);
    const brewing = await this.getBatches(BatchStatuses.BREWING);
    const fermenting = await this.getBatches(BatchStatuses.FERMENTING);
    const conditioning = await this.getBatches(BatchStatuses.CONDITIONING);
    const completed = await this.getBatches(BatchStatuses.COMPLETED);
    
    // Return all batches together in a single list
    return [
      ...planning,
      ...brewing,
      ...fermenting,
      ...conditioning,
      ...completed
    ];
  }

  /**
   * @function getBatches
   * Retrieves batches in the given status.
   * @param {string} status - Batch status
   * @returns {Promise<Array<object>>} List of batches
   */
  async getBatches(status) {
    // Try to fetch from cache first
    const key = `batches:${status.toLowerCase()}`;
    let batches = [];
    let rawBatches = await this.cache.get(key);

    if (rawBatches) {
      console.log(`[BatchService] Fetched ${status} from cache`);
      batches = JSON.parse(rawBatches);
    } else {
      // Not found in cache, so fetch directly from API
      /** @todo Transform status here */
      batches = await this.brewfather.getBatches(status);
      console.log(`[BatchService] Fetched ${status} from API`);

      // Cache the results
      if (batches) {
        await this.cache.set(key, JSON.stringify(batches));
      }
    }

    if (!batches) {
      // Default to empty array
      batches = [];
    }

    return batches;
  }

  /**
   * @function invalidateAllCaches
   * Invalidates all batch caches to force fresh fetches from the API.
   */
  async invalidateAllCaches() {
    await this.invalidateCache(BatchStatuses.UPCOMING);
    await this.invalidateCache(BatchStatuses.BREWING);
    await this.invalidateCache(BatchStatuses.DRINKING);
    await this.invalidateCache(BatchStatuses.ARCHIVED);
    await this.invalidateCache(BatchStatuses.UNKNOWN);
  }

  /**
   * @function invalidateCache
   * Invalidates the cache for the given batch status.
   * @param {string} status - Batch status
   */
  async invalidateCache(status) {
    const key = `batches:${status.toLowerCase()}`;
    await this.cache.delete(key);
  }
}

module.exports = {
  BatchService
};
