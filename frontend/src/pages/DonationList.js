import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function DonationList() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('available');

  useEffect(() => {
    axios.get(`/api/donations?status=${filter}`)
      .then(r => setDonations(r.data.donations || r.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div style={{ minHeight:'100vh', background:'#f0fdf4', padding:'28px' }}>
      <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
        <h1 style={{ fontFamily:'Sora,sans-serif', fontSize:'26px', fontWeight:'800', marginBottom:'6px' }}>
          📦 All Donations
        </h1>
        <p style={{ color:'#64748b', marginBottom:'24px' }}>Browse available food donations near you</p>

        {/* Filter tabs */}
        <div style={{ display:'flex', gap:'4px', background:'white', borderRadius:'12px', padding:'4px',
                       marginBottom:'24px', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', width:'fit-content' }}>
          {['available','requested','delivered'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding:'9px 18px', borderRadius:'9px', border:'none', cursor:'pointer',
                       fontWeight:'600', fontSize:'13px', textTransform:'capitalize',
                       background: filter===s ? '#16a34a' : 'transparent',
                       color: filter===s ? 'white' : '#64748b' }}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'60px' }}>
            <div style={{ width:'40px', height:'40px', border:'3px solid #dcfce7',
                           borderTop:'3px solid #16a34a', borderRadius:'50%',
                           animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
            <p style={{ color:'#94a3b8' }}>Loading donations...</p>
          </div>
        ) : donations.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px', background:'white', borderRadius:'20px' }}>
            <div style={{ fontSize:'64px', marginBottom:'16px' }}>🍽️</div>
            <h3 style={{ fontFamily:'Sora,sans-serif', marginBottom:'8px' }}>No donations found</h3>
            <p style={{ color:'#64748b' }}>No {filter} donations at the moment</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'16px' }}>
            {donations.map(d => (
              <div key={d._id} style={{ background:'white', borderRadius:'16px', overflow:'hidden',
                                         boxShadow:'0 2px 12px rgba(0,0,0,0.06)',
                                         transition:'all 0.2s' }}>
                <div style={{ background:'#f0fdf4', padding:'14px 18px',
                               borderBottom:'1px solid #dcfce7',
                               display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <h3 style={{ fontFamily:'Sora,sans-serif', fontSize:'15px', fontWeight:'700' }}>
                    {d.foodType}
                  </h3>
                  <span style={{ fontSize:'11px', fontWeight:'700', padding:'3px 10px',
                                  borderRadius:'20px', textTransform:'uppercase',
                                  background: d.status==='available'?'#dcfce7':d.status==='delivered'?'#dbeafe':'#fef3c7',
                                  color: d.status==='available'?'#15803d':d.status==='delivered'?'#1d4ed8':'#92400e' }}>
                    {d.status}
                  </span>
                </div>
                <div style={{ padding:'16px 18px' }}>
                  <p style={{ fontSize:'13px', color:'#475569', marginBottom:'5px' }}>📦 {d.quantity}</p>
                  <p style={{ fontSize:'13px', color:'#475569', marginBottom:'5px' }}>
                    🏪 {d.donorId?.organizationName || d.donorId?.name}
                  </p>
                  <p style={{ fontSize:'13px', color:'#475569', marginBottom:'5px' }}>📍 {d.location?.address}</p>
                  <p style={{ fontSize:'12px', color:'#94a3b8' }}>
                    ⏰ {new Date(d.expiryTime).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}