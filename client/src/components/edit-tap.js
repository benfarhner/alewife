/**
 * @fileoverview Implements a dialog for editing a tap.
 */

import { useCallback, useEffect, useState } from 'react';

import { HexColorInput, HexColorPicker } from 'react-colorful';

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
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

import getColorFromSrm from '../lib/srm';

export default function EditTap(props) {
  const { batches, index, onClose, onDelete, open, tap } = props;
  const [batchId, setBatchId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [icon, setIcon] = useState('');

  useEffect(() => {
    setBatchId(tap?.batch?.sourceId ?? '');
    setName(tap?.name ?? '');
    setDescription(tap?.description ?? '');
    setColor(tap?.color ?? '#000');
    setIcon(tap?.icon ?? 'mug-empty')
  }, [tap]);

  const handleClose = useCallback(() => {
    const batch = batches.find(batch => batch.sourceId === batchId);
    const newTap = {
      ...tap,
      batch,
      name,
      description,
      color,
      icon
    };
    onClose(newTap);
  }, [batches, batchId, color, description, icon, name, onClose, tap]);

  const handleBatchChange = useCallback(event => {
    const batch = batches.find(batch => batch.sourceId === event.target.value);
    setBatchId(event.target.value);
    setName(batch?.name ?? '');
    setDescription(batch?.summary ?? '');
    setColor(getColorFromSrm(batch?.srm));
    setIcon(batch ? 'mug-full' : 'mug-empty');
  }, [batches]);

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
                  {batch.name}
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
            id="edit-tap-name"
            label="Tap description"
            minRows={3}
            multiline
            onChange={handleDescriptionChange}
            value={description}
          />
          <HexColorPicker color={color} onChange={handleColorChange} />
          <TextField
            id="edit-tap-name"
            label="Custom color"
            onChange={handleColorChange}
            value={color}
          />
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
          <Button color="error" onClick={onDelete}>
            Delete tap
          </Button>
        </Stack>
      </Box>
    </Dialog>
  )
}
