/**
 * @fileoverview Implements a view for displaying taps.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';

import Api from '../lib/api';
import debounce from '../lib/debounce';
import EditTap from './edit-tap';
import Tap from './tap';
import Settings from './settings';

export default function TapList() {
  const [batches, setBatches] = useState([]);
  const [taps, setTaps] = useState([]);
  const [editingTap, setEditingTap] = useState(null);
  const [editingTapIndex, setEditingTapIndex] = useState(-1);
  const [settings, setSettings] = useState(null);
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

  useEffect(() => {
    const api = new Api();

    api.getBatches().then(newBatches => setBatches(newBatches));
    api.getTaps().then(newTaps => setTaps(newTaps));
    api.getSettings().then(newSettings => setSettings(newSettings));
  }, []);

  const handleSettingsClick = useCallback(() => setEditingSettings(true), []);

  const handleSettingsClose = useCallback(newSettings => {
    const api = new Api();

    api.saveSettings(newSettings).then(() => {
      setSettings(newSettings);
      setEditingSettings(false);
    });
  }, []);

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

  return (
    <div style={{ flexGrow: 1 }}>
      <div style={{ display: 'flex', flexDirection: settings?.layout === 'horizontal' ? 'column' : 'row', gap: '16px', height: '100%' }}>
        {taps?.map((tap, index) =>
          <div
            key={`tap-${tap.id}`}
            style={{ flexBasis: (100 / taps.length) + '%', flexGrow: 1 }}
          >
            <Tap
              horizontal={settings?.layout === 'horizontal'}
              index={index}
              onEdit={handleEditTap(tap, index)}
              onMove={handleMoveTap}
              onMoved={handleMovedTap}
              tap={tap}
            />
          </div>
        )}
      </div>
      <IconButton
        className="settings"
        onClick={handleSettingsClick}
        size="small"
      >
        <SettingsIcon />
      </IconButton>
      <IconButton
        className="add-tap"
        onClick={handleAddTapClick}
        size="small"
      >
        <AddIcon />
      </IconButton>
      <EditTap
        batches={batches}
        onClose={handleEditTapClose}
        onDelete={handleEditTapDelete}
        open={Boolean(editingTap)}
        tap={editingTap}
        index={editingTapIndex}
      />
      <Settings
        onClose={handleSettingsClose}
        open={editingSettings}
        settings={settings}
      />
    </div>
  )
}
