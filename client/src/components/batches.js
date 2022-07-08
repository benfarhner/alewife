/**
 * @fileoverview Implements a view of batches.
 */

import { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Api from '../lib/api';
import Batch from './batch';

export default function Batches() {
  const [drinking, setDrinking] = useState([]);
  const [brewing, setBrewing] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const load = () => {
    const api = new Api();

    api.getBatches()
      .then(newBatches => {
        setDrinking(newBatches.filter(batch => batch.status === 'Completed'));
        setBrewing(newBatches.filter(batch => batch.status === 'Fermenting' || batch.status === 'Conditioning'));
        setUpcoming(newBatches.filter(batch => batch.status === 'Planning'));
      });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Typography variant="h2">
        Drinking
      </Typography>
      <Grid container spacing={2}>
        {drinking.map(batch =>
          <Grid item key={batch._id} xs={12} sm={4} md={3} lg={2}>
            <Batch batch={batch} />
          </Grid>
        )}
      </Grid>
      <Typography variant="h2">
        Brewing
      </Typography>
      <Grid container spacing={2}>
        {brewing.map(batch =>
          <Grid item key={batch._id} xs={12} sm={4} md={3} lg={2}>
            <Batch batch={batch} />
          </Grid>
        )}
      </Grid>
      <Typography variant="h2">
        Upcoming
      </Typography>
      <Grid container spacing={2}>
        {upcoming.map(batch =>
          <Grid item key={batch._id} xs={12} sm={4} md={3} lg={2}>
            <Batch batch={batch} />
          </Grid>
        )}
      </Grid>
    </>
  )
}
