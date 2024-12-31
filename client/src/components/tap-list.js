/**
 * @fileoverview Implements a view for displaying taps.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';

import Api from '../lib/api';
import ComingSoon from './coming-soon';
import debounce from '../lib/debounce';
import EditTap from './edit-tap';
import Settings from './settings';
import Tap from './tap';

import '../styles/tap-list.css';

const REFRESH_INTERVAL = 900000; // 15 minutes

export default function TapList(props) {
  const { setSettings, settings } = props;
  const [batches, setBatches] = useState([]);
  const [taps, setTaps] = useState([]);
  const [editingTap, setEditingTap] = useState(null);
  const [editingTapIndex, setEditingTapIndex] = useState(-1);
  const [editingSettings, setEditingSettings] = useState(false);

  const saveTaps_impl = useMemo(() => debounce(newTaps => {
    const api = new Api();
    api.saveTaps(newTaps).then(() => {});
  }, 1000), []);

  const saveTaps = useCallback(newTaps => {
    setTaps(newTaps);
    setEditingTap(null);
    setEditingTapIndex(-1);
    saveTaps_impl(newTaps);
  }, [saveTaps_impl]);

  const loadData = useCallback(() => {
    const api = new Api();

    api.getBatches().then(newBatches => setBatches(newBatches));
    api.getTaps().then(newTaps => setTaps(newTaps));
    api.getSettings().then(newSettings => setSettings(newSettings));
  }, []);

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleAddTapClick = useCallback(() => {
    const newTap = { id: crypto.randomUUID() };
    setEditingTap(newTap);
    setEditingTapIndex(taps.length);
  }, [taps]);

  const handleEditTap = useCallback((tap, index) => () => {
    setEditingTap(tap);
    setEditingTapIndex(index);
  }, []);

  const handleEditTapClose = useCallback(editedTap => {
    const newTaps = [...taps];
    newTaps[editingTapIndex] = editedTap;
    saveTaps(newTaps);
  }, [editingTapIndex, saveTaps, taps]);

  const handleEditTapDelete = useCallback(() => {
    const newTaps = [...taps];
    newTaps.splice(editingTapIndex, 1);
    saveTaps(newTaps);
  }, [editingTapIndex, saveTaps, taps]);

  const handleMoveTap = useCallback((tapId, newIndex) => {
    const newTaps = [...taps];
    const oldIndex = newTaps.findIndex(tap => tap.id === tapId);
    const item = newTaps.splice(oldIndex, 1)[0];
    newTaps.splice(newIndex, 0, item);

    // Moving taps updates the array but doesn't save it to the API yet
    setTaps(newTaps);
  }, [taps]);

  const handleMovedTap = useCallback(() => {
    // Once the move is complete, save updated taps list to API
    saveTaps(taps);
  }, [saveTaps, taps])

  const handleSettingsClick = useCallback(() => setEditingSettings(true), []);
  const handleSettingsClose = useCallback(newSettings => {
    const api = new Api();

    api.saveSettings(newSettings).then(() => {
      setSettings(newSettings);
      setEditingSettings(false);
    });
  }, []);

  return (
    <>
      <Box sx={{
        display: 'grid',
        gap: theme => theme.spacing(8),
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'min-content 1fr min-content',
        height: '100%'
      }}>
        <Box pt={4} px={4} sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          '& img': {
            height: '128px',
            width: 'auto'
          }
        }}>
          <img alt="logo" src="/images/logo.png" />
        </Box>
        <Box px={8} sx={{
          display: 'grid',
          columnGap: '8vmin',
          rowGap: '1vmin',
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(0, 1fr)',
          gridTemplateRows: 'repeat(auto-fit, minmax(0, 1fr))'
        }}>
          {taps?.map((tap, index) =>
            <div key={`tap-${tap.id}`}>
              <Tap
                index={index}
                onEdit={handleEditTap(tap, index)}
                onMove={handleMoveTap}
                onMoved={handleMovedTap}
                tap={tap}
              />
            </div>
          )}
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}>
          <IconButton
            onClick={handleSettingsClick}
            size="small"
            sx={{
              backgroundColor: 'transparent',
              color: 'rgba(0, 0, 0, 0.2)',
            }}
          >
            <SettingsIcon />
          </IconButton>
          <ComingSoon batches={batches} />
          <IconButton
            onClick={handleAddTapClick}
            size="small"
            sx={{
              backgroundColor: 'transparent',
              color: 'rgba(0, 0, 0, 0.2)',
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>
      <Settings
        onClose={handleSettingsClose}
        open={editingSettings}
        settings={settings}
      />
      <EditTap
        batches={batches}
        onClose={handleEditTapClose}
        onDelete={handleEditTapDelete}
        open={Boolean(editingTap)}
        tap={editingTap}
        index={editingTapIndex}
      />
    </>
  )
}
