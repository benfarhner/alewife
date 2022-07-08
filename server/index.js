const dotenv = require('dotenv');
dotenv.config();

const Koa = require('koa');
const _ = require('koa-route');
const cors = require('@koa/cors');

const Brewfather = require('./integrations/brewfather.js');

const app = new Koa();

// Allow frontend to query the API on a different port
app.use(cors({ origin: '*' }));

app.use(_.get('/api/batches', async (ctx) => {
  const brewfather = new Brewfather();
  const planning = await brewfather.getBatches('Planning');
  const brewing = await brewfather.getBatches('Brewing');
  const fermenting = await brewfather.getBatches('Fermenting');
  const conditioning = await brewfather.getBatches('Conditioning');
  const completed = await brewfather.getBatches('Completed');
  
  const batches = [
    ...planning,
    ...brewing,
    ...fermenting,
    ...conditioning,
    ...completed
  ];

  ctx.status = 200;
  ctx.body = batches;
}));

app.listen(5000);
