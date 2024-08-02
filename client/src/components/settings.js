/**
 * @fileoverview Implements a dialog for editing settings.
 */

import { useCallback, useEffect, useState } from 'react';

import {
  Box,
  Dialog,
  DialogTitle,
  FormControl,
  FormLabel,
  Stack,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ColorPicker from './color-picker';

const DEFAULT_COLORS = {
  background: '#6750A4',
  tap: '#EADDFF',
  text: '#21005E'
};

export default function Settings(props) {
  const { onClose, open, settings } = props;
  const [colors, setColors] = useState(DEFAULT_COLORS);

  useEffect(() => {
    setColors(settings?.colors ?? DEFAULT_COLORS);
  }, [settings]);

  const handleClose = useCallback(() => {
    const newSettings = {
      ...settings,
      colors
    };
    onClose(newSettings);
  }, [colors, onClose, settings]);

  const handleColorChange = useCallback(property => value => {
    const newColors = { ...colors };
    newColors[property] = value;
    setColors(newColors);
  }, [colors]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={handleClose}
      open={open}
    >
      <DialogTitle>
        Settings
      </DialogTitle>
      <Box pb={3} px={3}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            {Object.keys(DEFAULT_COLORS).map(key =>
              <FormControl key={key}>
                <FormLabel>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </FormLabel>
                <ColorPicker color={colors[key]} onChange={handleColorChange(key)} />
              </FormControl>
            )}
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  )
}
