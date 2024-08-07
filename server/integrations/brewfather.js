/**
 * @fileoverview Implements an integration with the Brewfather API.
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const { BatchStatuses } = require('../lib/batch-statuses');

/**
 * Brewfather API root URL.
 */
const API_ROOT = 'https://api.brewfather.app/v2';

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
      '_id',
      'batchNo',
      'bottlingDate',
      'brewDate',
      'brewer',
      'carbonationType',
      'estimatedBuGuRatio',
      'estimatedColor',
      'estimatedFg',
      'estimatedIbu',
      'estimatedOg',
      'estimatedRbRatio',
      'fermentationStartDate',
      'measuredAbv',
      'measuredFg',
      'measuredOg',
      'name',
      'recipe.abv',
      'recipe.buGuRatio',
      'recipe.color',
      'recipe.fg',
      'recipe.fgEstimated',
      'recipe.ibu',
      'recipe.name',
      'recipe.nutrition.calories.kJ',
      'recipe.og',
      'recipe.rbRatio',
      'recipe.style.name',
      'recipe.teaser',
      'status',
    ];

    // Normalize status for Brewfather API
    const brewfatherStatuses = [];

    switch (status) {
      case BatchStatuses.UPCOMING:
        brewfatherStatuses.push(BrewfatherStatuses.PLANNING);
        break;
      case BatchStatuses.BREWING:
        brewfatherStatuses.push(BrewfatherStatuses.BREWING);
        brewfatherStatuses.push(BrewfatherStatuses.FERMENTING);
        brewfatherStatuses.push(BrewfatherStatuses.CONDITIONING);
        break;
      case BatchStatuses.DRINKING:
        brewfatherStatuses.push(BrewfatherStatuses.COMPLETED);
        break;
      case BatchStatuses.ARCHIVED:
        brewfatherStatuses.push(BrewfatherStatuses.ARCHIVED);
        break;
    }

    let allBatches = []

    for (const brewfatherStatus of brewfatherStatuses) {
      const params = new URLSearchParams();
      params.append('status', brewfatherStatus);
      params.append('include', include.join(','));
      // params.append('complete', 'true');

      const url = this.getUrl(BATCHES_RESOURCE, null, params);
      const batches = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${this.getAuthKey()}`,
        },
      })
        // .then(response => { console.log(response);  return response; })
        .then(response => response.json())
        .then(batches => batches.map(batch => this.getModel(batch)));

      allBatches = allBatches.concat(batches);
    }

    return allBatches;
  }

  /**
   * @function getModel
   * Gets an Alewife batch model from the given Brewfather batch object.
   * @param {object} batch - Brewfather batch object
   * @returns {object} Alewife batch model
   */
  getModel(batch) {
    console.log(batch)
    // Normalize the status
    let status = 'unknown';

    switch (batch.status) {
      case BrewfatherStatuses.PLANNING:
        status = BatchStatuses.UPCOMING;
        break;
      case BrewfatherStatuses.BREWING:
      case BrewfatherStatuses.FERMENTING:
      case BrewfatherStatuses.CONDITIONING:
        status = BatchStatuses.BREWING;
        break;
      case BrewfatherStatuses.COMPLETED:
        status = BatchStatuses.DRINKING;
        break;
      case BrewfatherStatuses.ARCHIVED:
        status = BatchStatuses.ARCHIVED;
        break;
      default:
        status = BatchStatuses.UNKNOWN;
        break;
    }

    // Normalize package
    var pkg = null;

    switch (batch.carbonationType) {
      case BrewfatherCarbonationTypes.SUGAR:
        pkg = 'bottle';
        break;
      case BrewfatherCarbonationTypes.KEG_FORCE:
      case BrewfatherCarbonationTypes.KEG_SUGAR:
        pkg = 'keg';
        break;
      default:
        pkg = null;
        break;
    }

    let batchName = 'Batch'

    // Determine batch name. If it has the default batch name "Batch", then use
    // the recipe name instead.
    if (batch.name != null && batch.name.length > 0 &&
      batch.name.toLowerCase().trim() != 'batch') {
      batchName = batch.name
    } else if (batch.recipe?.name != null && batch.recipe.name.length > 0) {
      batchName = batch.recipe.name
    } else if (batch.batchNo != null) {
      // No batch name or recipe name, so use the batch number
      batchName = `Batch #${batch.batchNo}`
    }

    // Build a normalized model
    return {
      abv: batch.measuredAbv ?? batch.recipe?.abv,
      brewed: batch.brewDate,
      brewer: batch.brewer,
      buGu: batch.estimatedBuGuRatio ?? batch.recipe?.buGuRatio,
      calories: batch.recipe?.nutrition?.calories?.kJ,
      fg: batch.measuredFg ?? batch.estimatedFg ?? batch.recipe?.fg
        ?? batch.recipe?.fgEstimated,
      ibu: batch.estimatedIbu ?? batch.recipe?.ibu,
      name: batchName,
      number: batch.batchNo,
      og: batch.measuredOg ?? batch.estimatedOg ?? batch.recipe?.og,
      package: pkg,
      packaged: batch.bottlingDate,
      pitched: batch.fermentationStartDate,
      rbr: batch.estimatedRbRatio ?? batch.recipe?.rbRatio,
      source: 'brewfather',
      sourceId: batch._id,
      srm: batch.estimatedColor ?? batch.recipe?.color,
      status,
      style: batch.recipe?.style?.name,
      summary: batch.recipe?.teaser ?? batch.recipe?.style?.name,
      tap: null,
    };
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

const BrewfatherStatuses = Object.freeze({
  PLANNING: 'Planning',
  BREWING: 'Brewing',
  FERMENTING: 'Fermenting',
  CONDITIONING: 'Conditioning',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
});

const BrewfatherCarbonationTypes = Object.freeze({
  SUGAR: 'Sugar',
  KEG_FORCE: 'Keg (Force)',
  KEG_SUGAR: 'Keg (Sugar)',
});

module.exports = {
  BrewfatherCarbonationTypes,
  BrewfatherStatuses,
  Brewfather,
};
