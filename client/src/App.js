import './App.css';
import { useEffect, useState } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Box } from '@mui/material';
import Api from './lib/api';
import TapList from './components/tap-list';
import Theme from './components/theme';

function App() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const api = new Api();
    api.getSettings().then(newSettings => setSettings(newSettings));
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Theme settings={settings} />
      <Box sx={{
        height: '100vh',
        overflow: 'hidden',
        width: '100vw'
      }}>
        <TapList setSettings={setSettings} settings={settings} />
      </Box>
    </DndProvider>
  );
}

export default App;
