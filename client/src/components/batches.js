/**
 * @fileoverview Implements a view of batches.
 */

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
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
        setDrinking(newBatches.filter(batch => batch.status === 'drinking'));
        setBrewing(newBatches.filter(batch => batch.status === 'brewing'));
        setUpcoming(newBatches.filter(batch => batch.status === 'upcoming'));
      });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Box p={2}>
      {drinking.length > 0 &&
        <>
          <Typography variant="h3">
            Drinking
          </Typography>
          <Grid container spacing={2} py={2}>
            {drinking.map(batch =>
              <Grid item key={batch.sourceId} xs={12} sm={4} md={3} lg={2}>
                <Batch batch={batch} />
              </Grid>
            )}
          </Grid>
        </>
      }
      {brewing.length > 0 &&
        <>
          <Typography variant="h3">
            Brewing
          </Typography>
          <Grid container spacing={2} py={2}>
            {brewing.map(batch =>
              <Grid item key={batch.sourceId} xs={12} sm={4} md={3} lg={2}>
                <Batch batch={batch} />
              </Grid>
            )}
          </Grid>
        </>
      }
      {upcoming.length > 0 &&
        <>
          <Typography variant="h3">
            Upcoming
          </Typography>
          <Grid container spacing={2} py={2}>
            {upcoming.map(batch =>
              <Grid item key={batch.sourceId} xs={12} sm={4} md={3} lg={2}>
                <Batch batch={batch} />
              </Grid>
            )}
          </Grid>
        </>
      }
    </Box>
  )
}
