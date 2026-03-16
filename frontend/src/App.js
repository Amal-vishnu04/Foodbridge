import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage        from './pages/LandingPage';
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import DonorDashboard     from './pages/DonorDashboard';
import AddDonation        from './pages/AddDonation';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard     from './pages/AdminDashboard';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
                  height:'100vh', background:'#fffbf5' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'40px', marginBottom:'12px' }}>🍲</div>
        <p style={{ color:'#92400e', fontWeight:'600' }}>Loading FoodShare...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    if (user.role === 'donor')     return <Navigate to="/donor" replace />;
    if (user.role === 'volunteer') return <Navigate to="/volunteer" replace />;
    if (user.role === 'admin')     return <Navigate to="/admin" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius:'10px', fontFamily:'Inter,sans-serif', fontSize:'14px' }
      }}/>
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/register"  element={<RegisterPage />} />
          <Route path="/donor"     element={<PrivateRoute role="donor"><DonorDashboard /></PrivateRoute>} />
          <Route path="/add-donation" element={<PrivateRoute role="donor"><AddDonation /></PrivateRoute>} />
          <Route path="/volunteer" element={<PrivateRoute role="volunteer"><VolunteerDashboard /></PrivateRoute>} />
          <Route path="/admin"     element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;