import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

export default function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    API.get('/api/donations/my')
      .then(r => setDonations(r.data))
      .catch(() => toast.error('Failed to load donations'))
      .finally(() => setLoading(false));
  }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this donation?')) return;
    await API.delete(`/api/donations/${id}`);
    setDonations(donations.map(d => d._id===id ? {...d, status:'cancelled'} : d));
    toast.success('Donation cancelled');
  };

  const stats = [
    { label:'Total Donations', val: donations.length,                                    icon:'📦' },
    { label:'Available',       val: donations.filter(d=>d.status==='available').length,  icon:'🟢' },
    { label:'Delivered',       val: donations.filter(d=>d.status==='delivered').length,  icon:'✅' },
    { label:'Cancelled',       val: donations.filter(d=>d.status==='cancelled').length,  icon:'❌' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#fffbf5', fontFamily:'Inter,sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'32px' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start',
                      marginBottom:'28px' }}>
          <div>
            <h1 style={{ fontSize:'28px', fontWeight:'800', color:'#1c1917', marginBottom:'4px' }}>
              Donor Dashboard
            </h1>
            <p style={{ color:'#78716c', fontSize:'15px' }}>Manage your food donations</p>
          </div>
          <Link to="/add-donation"
            style={{ display:'flex', alignItems:'center', gap:'8px',
                     padding:'11px 24px', background:'linear-gradient(135deg,#f59e0b,#f97316)',
                     color:'white', borderRadius:'10px', textDecoration:'none',
                     fontWeight:'700', fontSize:'14px',
                     boxShadow:'0 4px 14px rgba(245,158,11,0.35)' }}>
            + Add Donation
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'32px' }}>
          {stats.map(s => (
            <div key={s.label} style={{ background:'white', borderRadius:'14px', padding:'20px',
                                         border:'1px solid #f5f5f4',
                                         boxShadow:'0 1px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize:'28px', marginBottom:'10px' }}>{s.icon}</div>
              <div style={{ fontSize:'28px', fontWeight:'800', color:'#1c1917' }}>{s.val}</div>
              <div style={{ fontSize:'13px', color:'#78716c', fontWeight:'500' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Donations list */}
        <div style={{ background:'white', borderRadius:'16px', border:'1px solid #f5f5f4',
                      boxShadow:'0 1px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid #f5f5f4' }}>
            <h2 style={{ fontSize:'18px', fontWeight:'700', color:'#1c1917' }}>Your Donations</h2>
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:'60px', color:'#78716c' }}>
              Loading...
            </div>
          ) : donations.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px' }}>
              <div style={{ fontSize:'56px', marginBottom:'16px' }}>🍽️</div>
              <h3 style={{ color:'#1c1917', marginBottom:'8px' }}>No donations yet</h3>
              <p style={{ color:'#78716c', marginBottom:'20px' }}>Post your first donation!</p>
              <Link to="/add-donation"
                style={{ padding:'10px 24px', background:'#f59e0b', color:'white',
                         borderRadius:'8px', textDecoration:'none', fontWeight:'700' }}>
                Add Donation
              </Link>
            </div>
          ) : (
            donations.map((d, i) => (
              <div key={d._id}
                style={{ padding:'18px 24px', display:'flex', alignItems:'center',
                         justifyContent:'space-between', flexWrap:'wrap', gap:'12px',
                         borderBottom: i < donations.length-1 ? '1px solid #f5f5f4' : 'none' }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'5px' }}>
                    <span style={{ fontWeight:'700', fontSize:'15px', color:'#1c1917' }}>
                      {d.foodType}
                    </span>
                    <StatusBadge status={d.status} />
                  </div>
                  <p style={{ fontSize:'13px', color:'#78716c', marginBottom:'2px' }}>
                    📦 {d.quantity} &nbsp;•&nbsp; ⏰ Expires {new Date(d.expiryTime).toLocaleString()}
                  </p>
                  <p style={{ fontSize:'13px', color:'#78716c' }}>
                    📍 {d.location?.address}
                  </p>
                </div>
                {d.status === 'available' && (
                  <button onClick={() => cancel(d._id)}
                    style={{ padding:'8px 16px', background:'#fee2e2', color:'#991b1b',
                             border:'none', borderRadius:'8px', fontWeight:'600',
                             fontSize:'13px', cursor:'pointer' }}>
                    Cancel
                  </button>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    available: { bg:'#dcfce7', color:'#15803d' },
    requested: { bg:'#fef3c7', color:'#92400e' },
    delivered: { bg:'#dbeafe', color:'#1d4ed8' },
    cancelled: { bg:'#f5f5f4', color:'#57534e' },
    expired:   { bg:'#fee2e2', color:'#991b1b' },
  };
  const s = styles[status] || styles.cancelled;
  return (
    <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700',
                   background:s.bg, color:s.color, textTransform:'uppercase' }}>
      {status}
    </span>
  );
}