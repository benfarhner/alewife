/**
 * @fileoverview Implements a job to update batch data from Brewfather.
 */

const { parentPort } = require('worker_threads');

const { BatchService } = require('../services/batch.js');
const { BatchStatuses } = require('../lib/batch-statuses.js');

// Store boolean if the job is cancelled
let cancelled = false;

const update = async () => {
  // Bail if the job was cancelled
  if (cancelled) {
    return;
  }

  const batchService = new BatchService();

  // First invalidate the cache
  await batchService.invalidateCache(BatchStatuses.DRINKING);
  await batchService.invalidateCache(BatchStatuses.BREWING);
  await batchService.invalidateCache(BatchStatuses.UPCOMING);

  // Then fetch from the API and discard the result
  await batchService.getBatches(BatchStatuses.DRINKING);
  await batchService.getBatches(BatchStatuses.BREWING);
  await batchService.getBatches(BatchStatuses.UPCOMING);
};

// Handle cancellation (this is a very simple example)
if (parentPort) {
  parentPort.once('message', message => {
    if (message === 'cancel') {
      cancelled = true;
    }
  });
}

(async () => {
  const t1 = performance.now();

  await update();

  const t2 = performance.now();
  console.log(`[jobs:update] Took ${t2 - t1} ms`);

  // Signal to parent that the job is done
  if (parentPort) {
    parentPort.postMessage('done');
  } else {
    process.exit(0);
  }
})();
