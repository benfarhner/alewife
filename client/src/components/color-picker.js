/**
 * @fileoverview Implements a color picker popup.
 */

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Box, Popover, Stack, TextField } from '@mui/material';

export default function ColorPicker(props) {
  const { color, onChange } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpenPopover = event => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleColorChange = event => onChange(event?.target?.value ?? event);

  return (
    <div>
      <div
        className="swatch"
        style={{ backgroundColor: color }}
        onClick={handleOpenPopover}
      />
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom'
        }}
        onClose={handleClosePopover}
        open={open}
      >
        <Box p={2}>
          <Stack spacing={2}>
            <HexColorPicker color={color} onChange={handleColorChange} />
            <TextField
              id="settings-primary-color"
              label="Hex code"
              onChange={handleColorChange}
              value={color}
            />
          </Stack>
        </Box>
      </Popover>
    </div>
  )
}
