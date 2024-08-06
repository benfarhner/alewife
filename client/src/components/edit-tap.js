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
  const [flavorDescriptor, setFlavorDescriptor] = useState('');
  const [icon, setIcon] = useState('');
  const [rbr, setRbr] = useState(0);
  const [srm, setSrm] = useState(0);

  useEffect(() => {
    setAbv(tap?.abv ?? tap?.batch?.abv ?? 5);
    setBatchId(tap?.batch?.sourceId ?? '');
    setName(tap?.name ?? '');
    setDescription(tap?.description ?? '');
    setColor(tap?.color ?? 'var(--text-color)');
    setFlavorDescriptor(tap?.flavorDescriptor ?? '');
    setIcon(tap?.icon ?? 'mug-full');
    setRbr(tap?.rbr ?? tap?.batch?.rbr ?? 0.5);
    setSrm(tap?.srm ?? tap?.batch?.srm ?? 10);
  }, [tap]);

  const getFlavorDescriptor = useCallback(rbr => {
    if (rbr < 0.2) {
      return 'Sweet';
    } else if (rbr < 0.4) {
      return 'Semi-sweet';
    } else if (rbr < 0.6) {
      return 'Balanced';
    } else if (rbr < 0.8) {
      return 'Semi-bitter';
    } else if (rbr >= 0.8) {
      return 'Bitter';
    }
  }, []);

  const handleClose = useCallback(() => {
    const batch = batches.find(batch => batch.sourceId === batchId);
    const newTap = {
      ...tap,
      batch,
      name,
      abv,
      description,
      color,
      flavorDescriptor,
      icon,
      rbr,
      srm
    };
    onClose(newTap);
  }, [abv, batches, batchId, color, description, flavorDescriptor, icon, name,
    onClose, rbr, srm, tap]);

  const handleBatchChange = useCallback(event => {
    const batch = batches.find(batch => batch.sourceId === event.target.value);
    setAbv(batch?.abv ?? 0);
    setBatchId(event.target.value);
    setName(batch?.name ?? '');
    setDescription(batch?.summary ?? '');
    setColor(getColorFromSrm(batch?.srm));
    setFlavorDescriptor(getFlavorDescriptor(batch?.rbr ?? 0));
    setIcon(batch ? 'mug-full' : 'mug-empty');
    setRbr(batch?.rbr ?? 0);
    setSrm(batch?.srm ?? 10);
  }, [batches]);

  const handleAbvChange = event => setAbv(Number(event.target.value) ?? 0);
  const handleNameChange = event => setName(event.target.value);
  const handleDescriptionChange = event => setDescription(event.target.value);
  const handleColorChange = event => setColor(event?.target?.value ?? event);
  const handleFlavorDescriptorChange = event =>
    setFlavorDescriptor(event.target.value);
  const handleIconChange = (_, value) => value !== null && setIcon(value);
  
  const handleRbrChange = event => {
    const newRbr = Number(event.target.value) ?? 0;
    setRbr(newRbr);
    setFlavorDescriptor(getFlavorDescriptor(newRbr));
  }
  
  const handleSrmChange = event => {
    const newSrm = Number(event.target.value) ?? 0;
    setSrm(newSrm);
    setColor(getColorFromSrm(newSrm));
  }

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
            id="edit-tap-name"
            label="Tap description"
            minRows={3}
            multiline
            onChange={handleDescriptionChange}
            value={description}
          />
          <TextField
            id="edit-tap-flavor-descriptor"
            label="Flavor descriptor"
            onChange={handleFlavorDescriptorChange}
            value={flavorDescriptor}
          />
          <Stack justifyContent="stretch" direction="row" spacing={2}>
            <TextField
              id="edit-tap-abv"
              inputProps={{
                max: 20,
                min: 0,
                step: 0.1
              }}
              label="ABV"
              onChange={handleAbvChange}
              sx={{ flexGrow: 1 }}
              type="number"
              value={abv}
            />
            <TextField
              helperText="0 = Sweet, 1 = Bitter"
              id="edit-tap-rbr"
              inputProps={{
                max: 3,
                min: 0,
                step: 0.1
              }}
              label="RBR"
              onChange={handleRbrChange}
              sx={{ flexGrow: 1 }}
              type="number"
              value={rbr}
            />
            <TextField
              helperText="0 = Light, 40 = Dark"
              id="edit-tap-srm"
              inputProps={{
                max: 60,
                min: 0,
                step: 1
              }}
              label="SRM"
              onChange={handleSrmChange}
              sx={{ flexGrow: 1 }}
              type="number"
              value={srm}
            />
          </Stack>
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
