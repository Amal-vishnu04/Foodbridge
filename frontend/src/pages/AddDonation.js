import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function AddDonation() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    foodType:'',
    description:'',
    quantity:'',
    expiryTime:'',
    category:'cooked',
    servings:'',
    location: { address:'', lat:'', lng:'' }
  });

  const [loading, setLoading] = useState(false);

  const inp = {
    width:'100%',
    padding:'11px 14px',
    borderRadius:'8px',
    border:'1.5px solid #e2e8f0',
    fontSize:'14px',
    outline:'none',
    boxSizing:'border-box'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const payload = {
        foodType: form.foodType,
        description: form.description,
        quantity: form.quantity,
        expiryTime: form.expiryTime,
        category: form.category,
        servings: form.servings,
        location: {
          address: form.location.address,
          lat: 0,
          lng: 0
        }
      };

      await API.post('/api/donations', payload);

      toast.success('Donation posted! Volunteers notified 🎉');

      navigate('/donor');

    } catch (err) {

      console.error('Donation error:', err.response?.data);

      toast.error(
        err.response?.data?.message || 'Failed to post donation'
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div style={{ maxWidth:'600px', margin:'40px auto', padding:'0 20px' }}>
      <div style={{ background:'white', borderRadius:'20px', padding:'36px',
                    boxShadow:'0 4px 20px rgba(0,0,0,0.08)' }}>

        <h2 style={{ fontFamily:'Sora,sans-serif', fontSize:'22px', fontWeight:'800', marginBottom:'24px' }}>
          🍱 Post Food Donation
        </h2>

        <form onSubmit={handleSubmit}>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px' }}>

            <div>
              <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'5px' }}>
                Food Type *
              </label>
              <input
                required
                placeholder="e.g. Rice & Curry"
                value={form.foodType}
                onChange={e=>setForm({...form,foodType:e.target.value})}
                style={inp}
              />
            </div>

            <div>
              <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'5px' }}>
                Quantity *
              </label>
              <input
                required
                placeholder="e.g. 50 plates"
                value={form.quantity}
                onChange={e=>setForm({...form,quantity:e.target.value})}
                style={inp}
              />
            </div>

          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px' }}>

            <div>
              <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'5px' }}>
                Category
              </label>
              <select
                value={form.category}
                onChange={e=>setForm({...form,category:e.target.value})}
                style={inp}
              >
                <option value="cooked">Cooked Food</option>
                <option value="raw">Raw Food</option>
                <option value="packaged">Packaged</option>
                <option value="bakery">Bakery</option>
                <option value="fruits-vegetables">Fruits/Vegetables</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'5px' }}>
                No. of Servings
              </label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={form.servings}
                onChange={e=>setForm({...form,servings:e.target.value})}
                style={inp}
              />
            </div>

          </div>

          <div style={{ marginBottom:'14px' }}>
            <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'5px' }}>
              Expiry Time *
            </label>
            <input
              type="datetime-local"
              required
              value={form.expiryTime}
              onChange={e=>setForm({...form,expiryTime:e.target.value})}
              style={inp}
            />
          </div>

          <div style={{ marginBottom:'14px' }}>
            <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'5px' }}>
              Pickup Address *
            </label>
            <input
              required
              placeholder="Full address"
              value={form.location.address}
              onChange={e=>setForm({
                ...form,
                location:{...form.location,address:e.target.value}
              })}
              style={inp}
            />
          </div>

          <div style={{ marginBottom:'20px' }}>
            <label style={{ fontSize:'13px', fontWeight:'600', display:'block', marginBottom:'5px' }}>
              Description
            </label>
            <textarea
              rows="3"
              placeholder="Any details about the food..."
              value={form.description}
              onChange={e=>setForm({...form,description:e.target.value})}
              style={{...inp, resize:'vertical'}}
            />
          </div>

          <div style={{ display:'flex', gap:'12px' }}>

            <button
              type="button"
              onClick={()=>navigate('/donor')}
              style={{
                flex:1,
                padding:'12px',
                border:'2px solid #e2e8f0',
                borderRadius:'8px',
                background:'white',
                fontSize:'14px',
                fontWeight:'600',
                cursor:'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                flex:2,
                padding:'12px',
                background:'linear-gradient(135deg,#16a34a,#15803d)',
                color:'white',
                border:'none',
                borderRadius:'8px',
                fontSize:'15px',
                fontWeight:'700',
                cursor:'pointer'
              }}
            >
              {loading ? 'Posting...' : '🚀 Post Donation'}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}