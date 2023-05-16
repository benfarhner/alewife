/**
 * @fileoverview Implements a view for a single tap.
 */

import { Unstable_Grid2 as Grid } from '@mui/material';

export default function Taps(props) {
  const { taps } = props;

  return (
    <Grid container spacing={2}>
      {taps?.map((tap, index) =>
        <Grid key={`tap-${index}`}>
          <Tap tap={tap} />
        </Grid>
      )}
    </Grid>
  )
}
