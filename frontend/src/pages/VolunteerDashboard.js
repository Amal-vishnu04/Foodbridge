import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [donations, setDonations]     = useState([]);
  const [myRequests, setMyRequests]   = useState([]);
  const [tab, setTab]                 = useState('available');

  useEffect(() => {
    loadDonations();
    loadMyRequests();
    const socket = io('http://localhost:4000');
    socket.emit('join', user._id);
    socket.on('new_donation', () => {
      toast('🔔 New food donation available!', { icon:'🍱', duration:5000 });
      loadDonations();
    });
    return () => socket.disconnect();
  }, [user._id]);

  const loadDonations  = () => API.get('/api/donations?status=available').then(r => setDonations(r.data.donations || r.data));
  const loadMyRequests = () => API.get('/api/requests/my').then(r => setMyRequests(r.data));

  const requestPickup = async (donationId) => {
    try {
      await API.post(`/api/requests/${donationId}`);
      toast.success('Pickup requested! 🚚');
      loadDonations();
      loadMyRequests();
      setTab('my');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed');
    }
  };

  const updateStatus = async (requestId, status) => {
    await API.put(`/api/requests/${requestId}/status`, { status });
    toast.success(status === 'delivered' ? 'Marked as delivered! 🎉' : 'Status updated');
    loadMyRequests();
  };

  return (
    <div style={{ minHeight:'100vh', background:'#fffbf5', fontFamily:'Inter,sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'32px' }}>

        {/* Header */}
        <div style={{ marginBottom:'28px' }}>
          <h1 style={{ fontSize:'28px', fontWeight:'800', color:'#1c1917', marginBottom:'4px' }}>
            Volunteer Dashboard
          </h1>
          <p style={{ color:'#78716c', fontSize:'15px' }}>Find and deliver food donations nearby</p>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'32px' }}>
          {[
            { label:'Available Nearby', val: donations.length, icon:'📦' },
            { label:'My Pickups',       val: myRequests.filter(r=>r.status==='picked').length, icon:'🚚' },
            { label:'Delivered',        val: user?.totalDeliveries || 0, icon:'✅' },
          ].map(s => (
            <div key={s.label} style={{ background:'white', borderRadius:'14px', padding:'20px',
                                         border:'1px solid #f5f5f4',
                                         boxShadow:'0 1px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize:'28px', marginBottom:'10px' }}>{s.icon}</div>
              <div style={{ fontSize:'28px', fontWeight:'800', color:'#1c1917' }}>{s.val}</div>
              <div style={{ fontSize:'13px', color:'#78716c', fontWeight:'500' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'4px', background:'white', borderRadius:'12px', padding:'4px',
                       marginBottom:'24px', border:'1px solid #f5f5f4', width:'fit-content' }}>
          {[['available','🍱 Available Donations'],['my','📋 My Requests']].map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ padding:'9px 20px', borderRadius:'9px', border:'none', cursor:'pointer',
                       fontWeight:'600', fontSize:'13px',
                       background: tab===key ? 'linear-gradient(135deg,#f59e0b,#f97316)' : 'transparent',
                       color: tab===key ? 'white' : '#78716c' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Available donations */}
        {tab === 'available' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'16px' }}>
            {donations.length === 0 ? (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'60px',
                             background:'white', borderRadius:'16px', border:'1px solid #f5f5f4' }}>
                <div style={{ fontSize:'56px', marginBottom:'16px' }}>✅</div>
                <h3 style={{ color:'#1c1917' }}>No donations available right now</h3>
              </div>
            ) : donations.map(d => (
              <div key={d._id} style={{ background:'white', borderRadius:'16px',
                                         border:'1px solid #f5f5f4',
                                         boxShadow:'0 1px 8px rgba(0,0,0,0.05)',
                                         overflow:'hidden' }}>
                <div style={{ background:'#fffbf5', padding:'16px 18px',
                               borderBottom:'1px solid #fef3c7' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <h3 style={{ fontWeight:'700', fontSize:'16px', color:'#1c1917' }}>{d.foodType}</h3>
                    <span style={{ background:'#dcfce7', color:'#15803d', padding:'3px 10px',
                                   borderRadius:'20px', fontSize:'11px', fontWeight:'700' }}>
                      Available
                    </span>
                  </div>
                  <p style={{ fontSize:'13px', color:'#78716c', marginTop:'4px' }}>
                    {d.donorId?.organizationName || d.donorId?.name}
                  </p>
                </div>
                <div style={{ padding:'14px 18px' }}>
                  <p style={{ fontSize:'13px', color:'#57534e', marginBottom:'5px' }}>
                    📦 {d.quantity}
                  </p>
                  <p style={{ fontSize:'13px', color: new Date(d.expiryTime) < new Date(Date.now()+3600000) ? '#ef4444' : '#57534e', marginBottom:'5px' }}>
                    ⏰ {new Date(d.expiryTime).toLocaleString()}
                  </p>
                  <p style={{ fontSize:'13px', color:'#57534e', marginBottom:'14px' }}>
                    📍 {d.location?.address}
                  </p>
                  <button onClick={() => requestPickup(d._id)}
                    style={{ width:'100%', padding:'11px',
                             background:'linear-gradient(135deg,#f59e0b,#f97316)',
                             color:'white', border:'none', borderRadius:'9px',
                             fontWeight:'700', fontSize:'14px', cursor:'pointer' }}>
                    Accept Pickup
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My requests */}
        {tab === 'my' && (
          <div style={{ background:'white', borderRadius:'16px', border:'1px solid #f5f5f4',
                         boxShadow:'0 1px 8px rgba(0,0,0,0.05)' }}>
            {myRequests.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px' }}>
                <div style={{ fontSize:'56px', marginBottom:'16px' }}>📋</div>
                <h3 style={{ color:'#1c1917' }}>No requests yet</h3>
                <p style={{ color:'#78716c', marginTop:'8px' }}>Accept a pickup from the Available tab</p>
              </div>
            ) : myRequests.map((r, i) => (
              <div key={r._id} style={{ padding:'18px 24px', display:'flex', alignItems:'center',
                                         justifyContent:'space-between', flexWrap:'wrap', gap:'12px',
                                         borderBottom: i < myRequests.length-1 ? '1px solid #f5f5f4' : 'none' }}>
                <div>
                  <p style={{ fontWeight:'700', fontSize:'15px', color:'#1c1917', marginBottom:'4px' }}>
                    {r.donationId?.foodType}
                  </p>
                  <p style={{ fontSize:'13px', color:'#78716c', marginBottom:'2px' }}>
                    📍 {r.donationId?.location?.address}
                  </p>
                  <p style={{ fontSize:'13px', color:'#78716c' }}>
                    📞 {r.donationId?.donorId?.phone}
                  </p>
                </div>
                <div style={{ display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap' }}>
                  <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'700',
                                  background: r.status==='delivered'?'#dcfce7':r.status==='picked'?'#dbeafe':'#fef3c7',
                                  color: r.status==='delivered'?'#15803d':r.status==='picked'?'#1d4ed8':'#92400e' }}>
                    {r.status.toUpperCase()}
                  </span>
                  {r.status === 'pending' && (
                    <button onClick={() => updateStatus(r._id, 'picked')}
                      style={{ padding:'8px 16px', background:'#dbeafe', color:'#1d4ed8',
                               border:'none', borderRadius:'8px', fontWeight:'700',
                               fontSize:'13px', cursor:'pointer' }}>
                      Mark Picked Up
                    </button>
                  )}
                  {r.status === 'picked' && (
                    <button onClick={() => updateStatus(r._id, 'delivered')}
                      style={{ padding:'8px 16px', background:'#dcfce7', color:'#15803d',
                               border:'none', borderRadius:'8px', fontWeight:'700',
                               fontSize:'13px', cursor:'pointer' }}>
                      Mark Delivered ✅
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}