import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CrimeMapPage from './pages/CrimeMapPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import PredictionPage from './pages/PredictionPage';
import EmergencyPage from './pages/EmergencyPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<CrimeMapPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        {/* Protected general routes (must be logged in) */}
        <Route path="/prediction" element={<PredictionPage />} />

        {/* Protected admin/police routes */}
        <Route element={<ProtectedRoute allowedRoles={['Police', 'Admin']} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Routes>
    </>
  );
}
