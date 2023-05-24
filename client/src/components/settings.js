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

export default function Settings(props) {
  const { onClose, open, settings } = props;
  const [layout, setLayout] = useState('');

  useEffect(() => {
    setLayout(settings?.layout ?? 'vertical');
  }, [settings]);

  const handleClose = useCallback(() => {
    const newSettings = {
      ...settings,
      layout
    };
    onClose(newSettings);
  }, [layout, onClose, settings]);

  const handleLayoutChange = (_, value) => value !== null && setLayout(value);

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
          <FormControl fullWidth>
            <FormLabel>
              Layout
            </FormLabel>
            <ToggleButtonGroup
              exclusive
              onChange={handleLayoutChange}
              value={layout}
            >
              <ToggleButton value="vertical">
                <ViewColumnIcon fontSize="large" />
              </ToggleButton>
              <ToggleButton value="horizontal">
                <TableRowsIcon fontSize="large" />
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </Stack>
      </Box>
    </Dialog>
  )
}
