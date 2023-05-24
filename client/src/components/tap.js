/**
 * @fileoverview Implements a view for a single tap.
 */

import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useDrag, useDrop } from 'react-dnd';

import { Card, CardContent, Typography } from '@mui/material';


import SportsBarIcon from '@mui/icons-material/SportsBar';
import SportsBarOutlinedIcon from '@mui/icons-material/SportsBarOutlined';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

import '../styles/tap.css';

dayjs.extend(relativeTime);

export default function Tap(props) {
  const { horizontal, index, onEdit, onMove, onMoved, tap } = props;
  const ref = useRef();
  const [empty, setEmpty] = useState(false);
  const [Icon, setIcon] = useState(SportsBarIcon);

  useEffect(() => {
    setEmpty(tap?.name?.trim().length === 0);
  }, [tap]);

  useEffect(() => {
    let newIcon;

    switch (tap?.icon) {
      case 'mug-full':
        newIcon = SportsBarIcon;
        break;
      case 'mug-empty':
        newIcon = SportsBarOutlinedIcon;
        break;
      case 'water':
        newIcon = WaterDropIcon;
        break;
      default:
        newIcon = empty ? SportsBarOutlinedIcon : SportsBarIcon;
        break;
    }

    setIcon(newIcon);
  }, [empty, tap]);

  const [, dropRef] = useDrop(() => ({
    accept: 'tap',
    hover: dragItem => {
      if (!ref.current) {
        return
      }

      if (dragItem.id !== tap.id) {
        onMove(dragItem.id, index);
      }

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			dragItem.index = index;
    }
  }), [onMove]);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'tap',
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
    item: () => ({ id: tap?.id, index }),
    isDragging: monitor => tap?.id === monitor.getItem().id,
    end: (_, monitor) => {
      if (monitor.didDrop()) {
        onMoved();
      }
    }
  }), [index, onMoved, tap])

  if (!tap) {
    return null;
  }

  dragRef(dropRef(ref));

  return (
    <div
      className={
        classNames('tap-root',
          isDragging && 'tap-root-dragging',
          empty && 'tap-root-empty',
          horizontal && 'tap-horizontal')
      }
      ref={ref}
    >
      <Card
        className="tap-card"
        elevation={2}
        onDoubleClick={onEdit}
      >
        <CardContent className="tap-content">
          <Typography variant="h2" textAlign="center">
            {index + 1}
          </Typography>
          <div className="tap-icon">
            <Icon className="tap-icon" style={{ color: tap.color }} />
          </div>
          <Typography className="tap-name" variant="h5">
            {empty ? '(Empty)' : tap.name}
          </Typography>
          {tap.description &&
            <Typography variant="body1" sx={{ flexShrink: 2 }}>
              {tap.description}
            </Typography>
          }
          <div className="grow" />
          {tap.batch &&
            <div className="tap-stats">
              <Typography gutterBottom variant="body1" sx={{ whiteSpace: 'nowrap' }}>
                {tap.batch.abv}
                % ABV
                {' • '}
                {tap.batch.ibu}
                {' '}
                IBU
                {' • '}
                {tap.batch.rbr}
                {' '}
                RBR
              </Typography>
              <Typography variant="body1" sx={{ color: '#558b2f' }}>
                Brewed {dayjs(tap.batch.brewed).fromNow()}
              </Typography>
            </div>
          }
        </CardContent>
      </Card>
    </div>
  )
}
