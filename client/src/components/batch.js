/**
 * @fileoverview Implements a view for a single batch.
 */

import { useEffect, useState } from 'react';

import moment from 'moment';
import srm2hex from 'srm2hex';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import Typography from '@mui/material/Typography';

export default function Batch(props) {
  const { batch } = props;
  const [color, setColor] = useState('');

  useEffect(() => {
    if (batch) {
      if (batch.estimatedColor) {
        setColor(srm2hex(batch.estimatedColor));
      } else if (batch.recipe.color) {
        setColor(srm2hex(batch.recipe.color));
      } else {
        setColor('');
      }
    }
  }, [batch]);

  if (!batch) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <SportsBarIcon style={{ color }} />
        <Typography variant="h5" gutterBottom>
          {batch.recipe.name}
        </Typography>
        {batch.recipe.style?.name &&
          <Typography variant="body1" gutterBottom>
            {batch.recipe.style.name}
          </Typography>
        }
        <Typography variant="body2" gutterBottom>
          Brewed {moment(batch.brewDate).fromNow()}
        </Typography>
        <Typography variant="body2">
          {batch.measuredAbv ?? batch.recipe.abv}
          % ABV •
          {' '}
          {batch.estimatedIbu ?? batch.recipe.ibu}
          {' '}
          IBU •
          {' '}
          {batch.estimatedRbRatio ?? batch.recipe.rbRatio}
          {' '}
          RBR •
          {' '}
          {batch.estimatedColor ?? batch.recipe.color}
          {' '}
          SRM
        </Typography>
      </CardContent>
    </Card>
  )
}
