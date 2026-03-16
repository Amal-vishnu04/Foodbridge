import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  return (
    <div style={{ minHeight:'100vh', background:'#fffbf5', fontFamily:'Inter,sans-serif' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'80px 32px 60px', textAlign:'center' }}>
        <div style={{ display:'inline-block', background:'#fef3c7', color:'#92400e',
                      padding:'6px 16px', borderRadius:'20px', fontSize:'13px', fontWeight:'700',
                      marginBottom:'20px' }}>
          🌱 Fighting Hunger, Reducing Waste
        </div>
        <h1 style={{ fontSize:'56px', fontWeight:'800', color:'#1c1917', lineHeight:1.1,
                     marginBottom:'20px', fontFamily:'Inter,sans-serif' }}>
          Share Food,<br/>
          <span style={{ background:'linear-gradient(135deg,#f59e0b,#ef4444)',
                         WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Change Lives
          </span>
        </h1>
        <p style={{ fontSize:'18px', color:'#78716c', maxWidth:'500px', margin:'0 auto 40px',
                    lineHeight:1.7 }}>
          Connect restaurants and hotels with volunteers to feed communities and eliminate food waste.
        </p>
        <div style={{ display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/register"
            style={{ padding:'14px 36px', background:'linear-gradient(135deg,#f59e0b,#f97316)',
                     color:'white', borderRadius:'12px', textDecoration:'none',
                     fontWeight:'800', fontSize:'16px',
                     boxShadow:'0 8px 24px rgba(245,158,11,0.4)' }}>
            Get Started Free
          </Link>
          <Link to="/login"
            style={{ padding:'14px 36px', background:'white', color:'#1c1917',
                     borderRadius:'12px', textDecoration:'none', fontWeight:'700',
                     fontSize:'16px', border:'2px solid #e7e5e4' }}>
            Sign In
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background:'white', borderTop:'1px solid #f5f5f4', borderBottom:'1px solid #f5f5f4',
                    padding:'40px 32px' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto',
                      display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'32px',
                      textAlign:'center' }}>
          {[['45,890+','Meals Saved'],['1,247','Donations Made'],['34','Active Volunteers']].map(([val,label]) => (
            <div key={label}>
              <div style={{ fontSize:'36px', fontWeight:'800', color:'#f59e0b', fontFamily:'Inter,sans-serif' }}>
                {val}
              </div>
              <div style={{ fontSize:'14px', color:'#78716c', fontWeight:'500', marginTop:'4px' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'70px 32px' }}>
        <h2 style={{ textAlign:'center', fontSize:'32px', fontWeight:'800', marginBottom:'48px',
                     color:'#1c1917' }}>
          How It Works
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'24px' }}>
          {[
            { icon:'🏪', title:'Donor Posts Food', desc:'Hotels and restaurants post available food with quantity, location and expiry time', color:'#fef3c7', border:'#fde68a' },
            { icon:'🔔', title:'Volunteers Notified', desc:'Nearby volunteers instantly receive notifications about available donations', color:'#dcfce7', border:'#bbf7d0' },
            { icon:'🚚', title:'Food Delivered', desc:'Volunteer picks up the food and delivers it to people in need in the community', color:'#dbeafe', border:'#bfdbfe' },
          ].map(c => (
            <div key={c.title} style={{ background:c.color, borderRadius:'16px', padding:'28px',
                                         border:`1px solid ${c.border}` }}>
              <div style={{ fontSize:'40px', marginBottom:'16px' }}>{c.icon}</div>
              <h3 style={{ fontSize:'18px', fontWeight:'700', marginBottom:'10px', color:'#1c1917' }}>
                {c.title}
              </h3>
              <p style={{ fontSize:'14px', color:'#57534e', lineHeight:1.7 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background:'linear-gradient(135deg,#f59e0b,#f97316)', padding:'60px 32px',
                    textAlign:'center', color:'white' }}>
        <h2 style={{ fontSize:'32px', fontWeight:'800', marginBottom:'12px' }}>
          Ready to Make a Difference?
        </h2>
        <p style={{ fontSize:'16px', opacity:0.9, marginBottom:'28px' }}>
          Join hundreds of donors and volunteers fighting hunger today.
        </p>
        <Link to="/register"
          style={{ padding:'14px 40px', background:'white', color:'#f59e0b',
                   borderRadius:'12px', textDecoration:'none', fontWeight:'800', fontSize:'16px' }}>
          Join FoodShare Now
        </Link>
      </div>
    </div>
  );
}