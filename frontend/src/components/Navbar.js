import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{ background:'white', borderBottom:'1px solid #fde68a', padding:'0 32px',
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  height:'64px', position:'sticky', top:0, zIndex:100,
                  boxShadow:'0 1px 8px rgba(0,0,0,0.06)' }}>
      {/* Logo */}
      <Link to="/" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }}>
        <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#f59e0b,#ef4444)',
                      borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'18px' }}>🍲</div>
        <span style={{ fontFamily:'Inter,sans-serif', fontWeight:'800', fontSize:'18px', color:'#1c1917' }}>
          FoodShare
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
        <Link to="/" style={navLink}>Home</Link>
        <Link to="/donor" style={navLink}>Donor</Link>
        <Link to="/volunteer" style={navLink}>Volunteer</Link>
        <Link to="/admin" style={navLink}>Admin</Link>
      </div>

      {/* Auth buttons */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
        {user ? (
          <>
            <span style={{ fontSize:'14px', color:'#78716c', fontWeight:'500' }}>
              👋 {user.name}
            </span>
            <button onClick={handleLogout}
              style={{ padding:'8px 20px', background:'linear-gradient(135deg,#f59e0b,#f97316)',
                       color:'white', border:'none', borderRadius:'8px', fontWeight:'700',
                       fontSize:'14px', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"
              style={{ padding:'8px 18px', color:'#1c1917', textDecoration:'none',
                       fontWeight:'600', fontSize:'14px' }}>
              Log in
            </Link>
            <Link to="/register"
              style={{ padding:'8px 20px', background:'linear-gradient(135deg,#f59e0b,#f97316)',
                       color:'white', borderRadius:'8px', fontWeight:'700',
                       fontSize:'14px', textDecoration:'none' }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const navLink = {
  padding:'8px 16px', color:'#57534e', textDecoration:'none',
  fontWeight:'600', fontSize:'14px', borderRadius:'8px',
  fontFamily:'Inter,sans-serif', transition:'all 0.2s'
};