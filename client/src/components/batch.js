/**
 * @fileoverview Implements a view for a single batch.
 */

import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import Typography from '@mui/material/Typography';

import '../styles/batch.css';

dayjs.extend(relativeTime)

const srmMap = [
  '#FFE699',
  '#FFD878',
  '#FFCA5A',
  '#FFBF42',
  '#FBB123',
  '#F8A600',
  '#F39C00',
  '#EA8F00',
  '#E58500',
  '#DE7C00',
  '#D77200',
  '#CF6900',
  '#CB6200',
  '#C35900',
  '#BB5100',
  '#B54C00',
  '#B04500',
  '#A63E00',
  '#A13700',
  '#9B3200',
  '#952D00',
  '#8E2900',
  '#882300',
  '#821E00',
  '#7B1A00',
  '#771900',
  '#701400',
  '#6A0E00',
  '#660D00',
  '#5E0B00',
  '#5A0A02',
  '#600903',
  '#520907',
  '#4C0505',
  '#470606',
  '#440607',
  '#3F0708',
  '#3B0607',
  '#3A070B',
  '#36080A'
];

export default function Batch(props) {
  const { batch } = props;
  const [color, setColor] = useState('');

  useEffect(() => {
    if (batch) {
      let newColor = '';
      let srm = batch.srm;

      if (srm) {
        srm = Number(srm);
        srm = Math.max(srm, 1);
        srm = Math.min(srm, 40);
        srm = Math.round(srm);
        newColor = srmMap[srm];
      }

      setColor(newColor);
    }
  }, [batch]);

  if (!batch) {
    return null;
  }

  return (
    <Card className="batch-root" elevation={0}>
      <CardContent className="batch-content">
        <Typography variant="h5" gutterBottom>
          {batch.name}
        </Typography>
        {batch.summary &&
          <Typography variant="body2" gutterBottom>
            {batch.summary}
          </Typography>
        }
        <div className="grow" />
        <Typography variant="body2" sx={{ color: '#558b2f' }}>
          Brewed {dayjs(batch.brewed).fromNow()}
        </Typography>
      </CardContent>
      <Box className="batch-stats" py={2} pr={2}>
        <SportsBarIcon fontSize="large" style={{ color }} />
        <Typography variant="body2">
          {batch.abv}
          % ABV
        </Typography>
        <Typography variant="body2">
          {batch.ibu}
          {' '}
          IBU
        </Typography>
        <Typography variant="body2">
          {batch.rbr}
          {' '}
          RBR
        </Typography>
      </Box>
    </Card>
  )
}
