import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'donor',
    organizationName: ''
  });

  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // ✅ UPDATED HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const user = await register(form);

      toast.success('Account created!');

      // 🔍 Debug
      console.log('User after register:', user);

      if (user.role === 'donor') {
        navigate('/donor');
      } 
      else if (user.role === 'volunteer') {
        navigate('/volunteer');
      } 
      else if (user.role === 'admin') {
        navigate('/admin');
      } 
      else {
        navigate('/donor'); // fallback
      }

    } catch (err) {

      console.error('Register error:', err);

      toast.error(
        err.response?.data?.message || 'Registration failed'
      );

    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg,#052e16,#14532d)',
      padding: '20px'
    }}>

      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
      }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🌱</div>
          <h1 style={{
            fontFamily: 'Sora,sans-serif',
            fontSize: '24px',
            fontWeight: '800'
          }}>
            Create Account
          </h1>

          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Join the FoodShare community
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ROLE SELECTOR */}

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '16px'
          }}>

            {['donor', 'volunteer'].map(r => (

              <button
                type="button"
                key={r}
                onClick={() => setForm({ ...form, role: r })}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid',
                  borderColor: form.role === r ? '#16a34a' : '#e2e8f0',
                  background: form.role === r ? '#f0fdf4' : 'white',
                  color: form.role === r ? '#15803d' : '#64748b',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontSize: '14px'
                }}
              >

                {r === 'donor' ? '🏪 Donor' : '🚚 Volunteer'}

              </button>

            ))}

          </div>

          <div style={{ marginBottom: '14px' }}>
            <input
              required
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              style={inp}
            />
          </div>

          {form.role === 'donor' && (

            <div style={{ marginBottom: '14px' }}>
              <input
                placeholder="Organization / Restaurant Name"
                value={form.organizationName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    organizationName: e.target.value
                  })
                }
                style={inp}
              />
            </div>

          )}

          <div style={{ marginBottom: '14px' }}>
            <input
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              style={inp}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <input
              type="tel"
              required
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              style={inp}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <input
              type="password"
              required
              placeholder="Password (min 6 chars)"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              style={inp}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              background: 'linear-gradient(135deg,#16a34a,#15803d)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'Sora,sans-serif'
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '16px',
          fontSize: '14px',
          color: '#64748b'
        }}>
          Already have account?{' '}
          <Link
            to="/login"
            style={{ color: '#16a34a', fontWeight: '600' }}
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}