import './App.css';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import { Box, Stack } from '@mui/material';

import TapList from './components/tap-list';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Box p={4}>
        <Stack spacing={4} style={{ height: 'calc(100vh - 64px)' }}>
          <div className="logo">
            <img alt="logo" src="/images/logo.png" />
          </div>
          <TapList />
        </Stack>
      </Box>
    </DndProvider>
  );
}

export default App;
