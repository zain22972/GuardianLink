import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Matcher from './pages/Matcher';
import Directory from './pages/Directory';
import Inventory from './pages/Inventory';

// Volunteer Pages
import VolunteerLayout from './components/VolunteerLayout';
import VolunteerOCR from './pages/VolunteerOCR';
import VolunteerMissions from './pages/VolunteerMissions';
import VolunteerChat from './pages/VolunteerChat';

function App() {
  const [role, setRole] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={
          role ? <Navigate to={role === 'admin' ? "/admin/dashboard" : "/volunteer/missions"} replace /> 
               : <Login setRole={setRole} isDark={isDark} toggleTheme={toggleTheme} />
        } />
        
        {/* Admin Flow */}
        <Route path="/admin/*" element={
          role === 'admin' ? (
            <AdminLayout setRole={setRole} isDark={isDark} toggleTheme={toggleTheme}>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="matcher" element={<Matcher />} />
                <Route path="directory" element={<Directory />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </AdminLayout>
          ) : <Navigate to="/login" replace />
        } />

        {/* Volunteer Flow */}
        <Route path="/volunteer/*" element={
          role === 'volunteer' ? (
            <VolunteerLayout setRole={setRole} isDark={isDark} toggleTheme={toggleTheme}>
              <Routes>
                <Route path="missions" element={<VolunteerMissions />} />
                <Route path="ocr" element={<VolunteerOCR />} />
                <Route path="chat" element={<VolunteerChat />} />
                <Route path="*" element={<Navigate to="missions" replace />} />
              </Routes>
            </VolunteerLayout>
          ) : <Navigate to="/login" replace />
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
