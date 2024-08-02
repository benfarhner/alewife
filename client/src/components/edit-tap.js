/**
 * @fileoverview Implements a dialog for editing a tap.
 */

import { useCallback, useEffect, useState } from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import SportsBarOutlinedIcon from '@mui/icons-material/SportsBarOutlined';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

import ColorPicker from './color-picker';
import getColorFromSrm from '../lib/srm';

export default function EditTap(props) {
  const { batches, index, onClose, onDelete, open, tap } = props;
  const [abv, setAbv] = useState(0);
  const [batchId, setBatchId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [icon, setIcon] = useState('');

  useEffect(() => {
    setAbv(tap?.abv ?? tap?.batch?.abv ?? 0);
    setBatchId(tap?.batch?.sourceId ?? '');
    setName(tap?.name ?? '');
    setDescription(tap?.description ?? '');
    setColor(tap?.color ?? 'var(--text-color)');
    setIcon(tap?.icon ?? 'mug-empty')
  }, [tap]);

  const handleClose = useCallback(() => {
    const batch = batches.find(batch => batch.sourceId === batchId);
    const newTap = {
      ...tap,
      batch,
      name,
      abv,
      description,
      color,
      icon
    };
    onClose(newTap);
  }, [abv, batches, batchId, color, description, icon, name, onClose, tap]);

  const handleBatchChange = useCallback(event => {
    const batch = batches.find(batch => batch.sourceId === event.target.value);
    setAbv(batch?.abv ?? 0);
    setBatchId(event.target.value);
    setName(batch?.name ?? '');
    setDescription(batch?.summary ?? '');
    setColor(getColorFromSrm(batch?.srm));
    setIcon(batch ? 'mug-full' : 'mug-empty');
  }, [batches]);

  const handleAbvChange = event => setAbv(event.target.value);
  const handleNameChange = event => setName(event.target.value);
  const handleDescriptionChange = event => setDescription(event.target.value);
  const handleColorChange = event => setColor(event?.target?.value ?? event);
  const handleIconChange = (_, value) => value !== null && setIcon(value);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={handleClose}
      open={open}
    >
      <DialogTitle>
        Tap #{index + 1}
      </DialogTitle>
      <Box pb={3} px={3}>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="edit-tap-batch-label">
              Batch
            </InputLabel>
            <Select
              id="edit-tap-batch"
              labelId="edit-tap-batch-label"
              label="Batch"
              onChange={handleBatchChange}
              value={batchId}
            >
              <MenuItem value={''}>
                (None)
              </MenuItem>
              {batches.map(batch =>
                <MenuItem key={batch.sourceId} value={batch.sourceId}>
                  {batch.name} ({batch.status})
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <TextField
            id="edit-tap-name"
            label="Tap name"
            onChange={handleNameChange}
            value={name}
          />
          <TextField
            id="edit-tap-abc"
            label="ABV"
            onChange={handleAbvChange}
            type="number"
            value={abv}
          />
          <TextField
            id="edit-tap-name"
            label="Tap description"
            minRows={3}
            multiline
            onChange={handleDescriptionChange}
            value={description}
          />
          <Stack direction="row" spacing={2}>
            <FormControl>
              <FormLabel>
                Icon
              </FormLabel>
              <ToggleButtonGroup
                exclusive
                onChange={handleIconChange}
                value={icon}
              >
                <ToggleButton value="mug-full">
                  <SportsBarIcon fontSize="large" style={{ color }} />
                </ToggleButton>
                <ToggleButton value="mug-empty">
                  <SportsBarOutlinedIcon fontSize="large" style={{ color }} />
                </ToggleButton>
                <ToggleButton value="water">
                  <WaterDropIcon fontSize="large" style={{ color }} />
                </ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
            <FormControl>
              <FormLabel>
                Color
              </FormLabel>
              <ColorPicker color={color} onChange={handleColorChange} />
            </FormControl>
          </Stack>
          <Button color="error" onClick={onDelete}>
            Delete tap
          </Button>
        </Stack>
      </Box>
    </Dialog>
  )
}
