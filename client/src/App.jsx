import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CrimeMapPage from './pages/CrimeMapPage';
import DashboardPage from './pages/DashboardPage';
import PredictionPage from './pages/PredictionPage';
import EmergencyPage from './pages/EmergencyPage';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<CrimeMapPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/prediction" element={<PredictionPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
      </Routes>
    </>
  );
}
