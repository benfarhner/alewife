const dotenv = require('dotenv');
dotenv.config();

const Koa = require('koa');
const _ = require('koa-route');
const cors = require('@koa/cors');

const BatchService = require('./services/batch.js');
const jobs = require('./jobs/jobs.js');
const { BatchStatuses } = require('./lib/batch-statuses.js');

const app = new Koa();

// Allow frontend to query the API on a different port
app.use(cors({ origin: '*' }));

app.use(_.get('/api/batches', async (ctx) => {
  const batchService = new BatchService.BatchService();
  const drinking = await batchService.getBatches(BatchStatuses.DRINKING);
  const brewing = await batchService.getBatches(BatchStatuses.BREWING);
  const upcoming = await batchService.getBatches(BatchStatuses.UPCOMING);

  const batches = drinking.concat(brewing).concat(upcoming);

  ctx.status = 200;
  ctx.body = batches;
}));

// Start all jobs
(async () => {
  await jobs.start();
})();

app.listen(5001);
