import logo from './logo.svg';
import './App.css';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import Batches from './components/batches';

function App() {
  return (
    <Box p={2}>
      <Batches />
    </Box>
  );
}

export default App;
