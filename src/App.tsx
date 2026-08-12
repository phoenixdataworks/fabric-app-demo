import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { MigrationPulsePage } from '@/pages/MigrationPulsePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MigrationPulsePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
