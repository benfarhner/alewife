/**
 * @fileoverview Implements a view for a single tap.
 */

import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useDrag, useDrop } from 'react-dnd';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import SportsBarOutlinedIcon from '@mui/icons-material/SportsBarOutlined';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

import '../styles/tap.css';

dayjs.extend(relativeTime);

export default function Tap(props) {
  const { index, onEdit, onMove, onMoved, tap } = props;
  const ref = useRef();
  const [empty, setEmpty] = useState(false);
  const [Icon, setIcon] = useState(SportsBarIcon);
  const [abv, setAbv] = useState(null);

  useEffect(() => {
    let newAbv = null;
    const newEmpty = tap?.name?.trim().length === 0;
    let newIcon = HighlightOffIcon;

    if (!newEmpty) {
      switch (tap?.icon) {
        case 'mug-full':
        default:
          newIcon = SportsBarIcon;
          break;
        case 'mug-empty':
          newIcon = SportsBarOutlinedIcon;
          break;
        case 'water':
          newIcon = WaterDropIcon;
          break;
      }
    }

    let abv = tap.abv ?? tap.batch?.abv;

    if (abv != null && abv !== '' && abv > 0) {
      newAbv = Number(abv).toFixed(1) + '% ABV';
    }

    setAbv(newAbv);
    setEmpty(newEmpty);
    setIcon(newIcon);
  }, [tap]);

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
          empty && 'tap-root-empty')
      }
      onDoubleClick={onEdit}
      ref={ref}
    >
      <div className="tap-number">
        {index + 1}
      </div>
      <div className="tap-content">
        <h2 className="tap-name">
          {empty ? "(Empty)" : tap.name}
        </h2>
        {!empty && tap.description?.length > 0 &&
          <p className="tap-description">
            {tap.description}
          </p>
        }
      </div>
      <div className="tap-stats">
        {abv && <span>{abv}</span>}
        {abv && tap.flavorDescriptor !== '' &&
          <span> | </span>
        }
        {tap.flavorDescriptor && tap.flavorDescriptor !== '' &&
          <span>
            {tap.flavorDescriptor}
          </span>
        }
      </div>
      <div className="tap-icon">
        <Icon className="tap-icon" style={{ color: !empty && tap.color }} />
      </div>
    </div>
  )
}
