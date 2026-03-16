import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : user.role === 'donor' ? '/donor' : '/volunteer');
    } catch {
      toast.error('Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
                  background:'linear-gradient(135deg,#052e16,#14532d)', padding:'20px' }}>
      <div style={{ background:'white', borderRadius:'20px', padding:'40px', width:'100%', maxWidth:'420px',
                    boxShadow:'0 25px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ fontSize:'48px', marginBottom:'8px' }}>🍲</div>
          <h1 style={{ fontFamily:'Sora,sans-serif', fontSize:'24px', fontWeight:'800', color:'#0f172a' }}>
            Welcome Back
          </h1>
          <p style={{ color:'#64748b', fontSize:'14px', marginTop:'4px' }}>Sign in to FoodShare</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', fontSize:'13px', fontWeight:'600', marginBottom:'6px' }}>Email</label>
            <input type="email" required value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              placeholder="you@example.com"
              style={{ width:'100%', padding:'11px 14px', borderRadius:'8px', border:'1.5px solid #e2e8f0',
                       fontSize:'14px', outline:'none', boxSizing:'border-box' }} />
          </div>
          <div style={{ marginBottom:'24px' }}>
            <label style={{ display:'block', fontSize:'13px', fontWeight:'600', marginBottom:'6px' }}>Password</label>
            <input type="password" required value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              placeholder="••••••••"
              style={{ width:'100%', padding:'11px 14px', borderRadius:'8px', border:'1.5px solid #e2e8f0',
                       fontSize:'14px', outline:'none', boxSizing:'border-box' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'13px', background:'linear-gradient(135deg,#16a34a,#15803d)',
                     color:'white', border:'none', borderRadius:'8px', fontSize:'15px', fontWeight:'700',
                     cursor:'pointer', fontFamily:'Sora,sans-serif' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'20px', fontSize:'14px', color:'#64748b' }}>
          No account? <Link to="/register" style={{ color:'#16a34a', fontWeight:'600' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}