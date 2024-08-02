const dotenv = require('dotenv');
dotenv.config();

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const _ = require('koa-route');
const cors = require('@koa/cors');

const BatchService = require('./services/batch.js');
const jobs = require('./jobs/jobs.js');
const { BatchStatuses } = require('./lib/batch-statuses.js');
const { TapService } = require('./services/tap.js');
const { SettingsService } = require('./services/settings.js');

const app = new Koa();

// Allow frontend to query the API on a different port
app.use(cors({ origin: '*' }));

app.use(bodyParser());

app.use(_.get('/api/batches', async (ctx) => {
  const batchService = new BatchService.BatchService();
  const drinking = await batchService.getBatches(BatchStatuses.DRINKING);
  const brewing = await batchService.getBatches(BatchStatuses.BREWING);
  const upcoming = await batchService.getBatches(BatchStatuses.UPCOMING);

  const batches = drinking.concat(brewing).concat(upcoming);

  ctx.status = 200;
  ctx.body = batches;
}));

app.use(_.get('/api/taps', async (ctx) => {
  const tapService = new TapService();
  const taps = await tapService.get();

  ctx.status = 200;
  ctx.body = taps;
}));

app.use(_.post('/api/taps', async (ctx) => {
  const tapService = new TapService();
  await tapService.set(ctx.request.body);

  ctx.status = 200;
}));

app.use(_.get('/api/settings', async (ctx) => {
  const settingsService = new SettingsService();
  const settings = await settingsService.get();

  ctx.status = 200;
  ctx.body = settings;
}));

app.use(_.post('/api/settings', async (ctx) => {
  const settingsService = new SettingsService();
  await settingsService.set(ctx.request.body);

  ctx.status = 200;
}));

// Start all jobs
(async () => {
  await jobs.start();
})();

app.listen(process.env.PORT);
