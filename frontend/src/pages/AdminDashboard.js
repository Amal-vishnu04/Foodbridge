import { useEffect, useState } from 'react';
import API from '../utils/api';
import Navbar from '../components/Navbar';
import { Bar, Doughnut } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats]         = useState(null);
  const [users, setUsers]         = useState([]);
  const [donations, setDonations] = useState([]);
  const [tab, setTab]             = useState('overview');

  useEffect(() => {
    API.get('/api/admin/stats').then(r => setStats(r.data));
    API.get('/api/admin/users').then(r => setUsers(r.data.users || r.data));
    API.get('/api/admin/donations').then(r => setDonations(r.data.donations || r.data));
  }, []);

  const toggleUser = async (id) => {
    const { data } = await API.put(`/api/admin/users/${id}/toggle`);
    setUsers(users.map(u => u._id === id ? data : u));
    toast.success('User status updated');
  };

  const markFake = async (id) => {
    await API.put(`/api/admin/donations/${id}/fake`);
    setDonations(donations.map(d => d._id === id ? {...d, isFake:true, status:'cancelled'} : d));
    toast.success('Marked as fake');
  };

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const barData = stats ? {
    labels: (stats.monthlyData||[]).map(m => `${MONTHS[m._id.month-1]}`),
    datasets: [
      { label:'Donations', data:(stats.monthlyData||[]).map(m => m.count),
        backgroundColor:'#f59e0b', borderRadius:6 },
      { label:'Delivered', data:(stats.monthlyData||[]).map(m => m.delivered),
        backgroundColor:'#10b981', borderRadius:6 },
    ]
  } : null;

  const donutData = stats ? {
    labels: (stats.categoryData||[]).map(c => c._id),
    datasets: [{ data:(stats.categoryData||[]).map(c => c.count),
      backgroundColor:['#f59e0b','#10b981','#3b82f6','#ef4444','#8b5cf6','#ec4899'] }]
  } : null;

  const statCards = stats ? [
    { label:'Total Donations', val: stats.totalDonations,  icon:'📦' },
    { label:'Meals Served',    val: stats.delivered * 30,  icon:'🍽️' },
    { label:'Active Donors',   val: stats.totalDonors,     icon:'🏪' },
    { label:'Volunteers',      val: stats.totalVolunteers, icon:'🚚' },
  ] : [];

  return (
    <div style={{ minHeight:'100vh', background:'#fffbf5', fontFamily:'Inter,sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'32px' }}>

        {/* Header */}
        <div style={{ marginBottom:'28px' }}>
          <h1 style={{ fontSize:'28px', fontWeight:'800', color:'#1c1917', marginBottom:'4px' }}>
            Admin Dashboard
          </h1>
          <p style={{ color:'#78716c', fontSize:'15px' }}>System overview and management</p>
        </div>

        {/* Stat cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px' }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background:'white', borderRadius:'14px', padding:'20px 24px',
                                         border:'1px solid #f5f5f4',
                                         boxShadow:'0 1px 8px rgba(0,0,0,0.05)',
                                         display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ fontSize:'13px', color:'#78716c', fontWeight:'500', marginBottom:'6px' }}>
                  {s.label}
                </p>
                <p style={{ fontSize:'28px', fontWeight:'800', color:'#1c1917' }}>
                  {s.val?.toLocaleString()}
                </p>
              </div>
              <span style={{ fontSize:'28px' }}>{s.icon}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'4px', background:'white', borderRadius:'12px', padding:'4px',
                       marginBottom:'24px', border:'1px solid #f5f5f4', width:'fit-content' }}>
          {[['overview','📊 Overview'],['donations','📦 All Donations'],['users','👥 Users']].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{ padding:'9px 18px', borderRadius:'9px', border:'none', cursor:'pointer',
                       fontWeight:'600', fontSize:'13px',
                       background: tab===k ? 'linear-gradient(135deg,#f59e0b,#f97316)' : 'transparent',
                       color: tab===k ? 'white' : '#78716c' }}>
              {l}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === 'overview' && barData && (
          <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:'20px' }}>

            {/* Bar chart */}
            <div style={{ background:'white', borderRadius:'16px', padding:'24px',
                           border:'1px solid #f5f5f4', boxShadow:'0 1px 8px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontWeight:'700', fontSize:'16px', marginBottom:'20px', color:'#1c1917' }}>
                Monthly Donations & Delivered
              </h3>
              <Bar data={barData} options={{
                responsive: true,
                plugins: { legend: { position:'top' } },
                scales: { y: { beginAtZero:true } }
              }} />
            </div>

            {/* Right column */}
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

              {/* Doughnut chart */}
              {donutData && (
                <div style={{ background:'white', borderRadius:'16px', padding:'24px',
                               border:'1px solid #f5f5f4', boxShadow:'0 1px 8px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontWeight:'700', fontSize:'16px', marginBottom:'16px', color:'#1c1917' }}>
                    Food by Category
                  </h3>
                  <Doughnut data={donutData} options={{
                    responsive: true,
                    plugins: { legend: { position:'bottom' } }
                  }} />
                </div>
              )}

              {/* Top volunteers */}
              <div style={{ background:'white', borderRadius:'16px', padding:'24px',
                             border:'1px solid #f5f5f4', boxShadow:'0 1px 8px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontWeight:'700', fontSize:'16px', marginBottom:'16px', color:'#1c1917' }}>
                  🏆 Top Volunteers
                </h3>
                {(stats?.topVolunteers || []).length === 0 ? (
                  <p style={{ color:'#78716c', fontSize:'14px' }}>No volunteers yet</p>
                ) : (
                  (stats?.topVolunteers || []).map((v, i) => (
                    <div key={v._id} style={{ display:'flex', alignItems:'center', gap:'12px',
                                               padding:'10px 0',
                                               borderBottom: i < 4 ? '1px solid #f5f5f4' : 'none' }}>
                      <span style={{ fontSize:'18px' }}>
                        {['🥇','🥈','🥉','4️⃣','5️⃣'][i]}
                      </span>
                      <div style={{ flex:1 }}>
                        <p style={{ fontWeight:'700', fontSize:'14px', color:'#1c1917' }}>{v.name}</p>
                        <p style={{ fontSize:'12px', color:'#78716c' }}>{v.totalDeliveries} deliveries</p>
                      </div>
                      <span style={{ fontWeight:'700', color:'#f59e0b', fontSize:'14px' }}>
                        ⭐ {v.reputationScore}
                      </span>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        )}

        {/* All Donations table */}
        {tab === 'donations' && (
          <div style={{ background:'white', borderRadius:'16px', border:'1px solid #f5f5f4',
                         boxShadow:'0 1px 8px rgba(0,0,0,0.05)', overflow:'hidden' }}>
            {donations.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px' }}>
                <div style={{ fontSize:'56px', marginBottom:'16px' }}>📦</div>
                <h3 style={{ color:'#1c1917' }}>No donations yet</h3>
              </div>
            ) : (
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'14px' }}>
                <thead>
                  <tr style={{ background:'#fffbf5' }}>
                    {['Food','Donor','Quantity','Location','Status','Action'].map(h => (
                      <th key={h} style={{ padding:'13px 18px', textAlign:'left', fontSize:'12px',
                                            fontWeight:'700', textTransform:'uppercase', color:'#78716c',
                                            borderBottom:'1px solid #f5f5f4' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d, i) => (
                    <tr key={d._id}
                      style={{ borderBottom: i < donations.length-1 ? '1px solid #f5f5f4' : 'none',
                                opacity: d.isFake ? 0.5 : 1 }}>
                      <td style={{ padding:'13px 18px', fontWeight:'600', color:'#1c1917' }}>
                        {d.foodType}
                      </td>
                      <td style={{ padding:'13px 18px', color:'#78716c' }}>
                        {d.donorId?.name || d.donorId?.organizationName}
                      </td>
                      <td style={{ padding:'13px 18px' }}>{d.quantity}</td>
                      <td style={{ padding:'13px 18px', color:'#78716c', maxWidth:'140px',
                                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {d.location?.address}
                      </td>
                      <td style={{ padding:'13px 18px' }}>
                        <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700',
                                        background: d.isFake ? '#fee2e2'
                                          : d.status==='available' ? '#dcfce7'
                                          : d.status==='delivered' ? '#dbeafe' : '#fef3c7',
                                        color: d.isFake ? '#991b1b'
                                          : d.status==='available' ? '#15803d'
                                          : d.status==='delivered' ? '#1d4ed8' : '#92400e' }}>
                          {d.isFake ? 'FAKE' : d.status}
                        </span>
                      </td>
                      <td style={{ padding:'13px 18px' }}>
                        {!d.isFake && d.status !== 'delivered' && (
                          <button onClick={() => markFake(d._id)}
                            style={{ padding:'6px 12px', background:'#fee2e2', color:'#991b1b',
                                     border:'none', borderRadius:'6px', fontSize:'12px',
                                     fontWeight:'600', cursor:'pointer' }}>
                            🗑 Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Users table */}
        {tab === 'users' && (
          <div style={{ background:'white', borderRadius:'16px', border:'1px solid #f5f5f4',
                         boxShadow:'0 1px 8px rgba(0,0,0,0.05)', overflow:'hidden' }}>
            {users.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px' }}>
                <div style={{ fontSize:'56px', marginBottom:'16px' }}>👥</div>
                <h3 style={{ color:'#1c1917' }}>No users yet</h3>
              </div>
            ) : (
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'14px' }}>
                <thead>
                  <tr style={{ background:'#fffbf5' }}>
                    {['Name','Email','Role','Phone','Status','Action'].map(h => (
                      <th key={h} style={{ padding:'13px 18px', textAlign:'left', fontSize:'12px',
                                            fontWeight:'700', textTransform:'uppercase', color:'#78716c',
                                            borderBottom:'1px solid #f5f5f4' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id}
                      style={{ borderBottom: i < users.length-1 ? '1px solid #f5f5f4' : 'none' }}>
                      <td style={{ padding:'13px 18px', fontWeight:'600', color:'#1c1917' }}>
                        {u.name}
                      </td>
                      <td style={{ padding:'13px 18px', color:'#78716c' }}>{u.email}</td>
                      <td style={{ padding:'13px 18px' }}>
                        <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700',
                                        background: u.role==='donor' ? '#dbeafe'
                                          : u.role==='volunteer' ? '#dcfce7' : '#fce7f3',
                                        color: u.role==='donor' ? '#1e40af'
                                          : u.role==='volunteer' ? '#166534' : '#9d174d' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding:'13px 18px', color:'#78716c' }}>{u.phone}</td>
                      <td style={{ padding:'13px 18px' }}>
                        <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700',
                                        background: u.isActive ? '#dcfce7' : '#fee2e2',
                                        color: u.isActive ? '#15803d' : '#991b1b' }}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding:'13px 18px' }}>
                        <button onClick={() => toggleUser(u._id)}
                          style={{ padding:'6px 14px', border:'none', borderRadius:'7px', fontSize:'12px',
                                    fontWeight:'600', cursor:'pointer',
                                    background: u.isActive ? '#fee2e2' : '#dcfce7',
                                    color: u.isActive ? '#991b1b' : '#15803d' }}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
}