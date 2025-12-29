import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/admin/login');
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      const res = await axios.get('http://127.0.0.1:8000/admin-api/orders/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Handle the new object response format
      if (res.data.orders) {
        setOrders(res.data.orders);
        setRestaurantName(res.data.restaurant_name);
      } else {
        // Fallback for old list response format (if any)
        setOrders(res.data);
      }
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/admin/login');
      } else {
        console.error("Error Fetching Orders...", err);
        setError("Failed to fetch orders. Please try again.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(`http://127.0.0.1:8000/admin-api/orders/${orderId}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="min-h-screen bg-black text-white p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-1">
              {restaurantName ? `Managing orders for: ${restaurantName}` : 'Manage restaurant orders and status'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-black px-5 py-2 rounded-lg font-bold text-sm hover:bg-zinc-200"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((o) => (
            <div key={o.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded font-mono">#{o.id}</span>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border ${o.status === 'completed' ? 'border-zinc-500 text-zinc-300' :
                  o.status === 'preparing' ? 'border-white text-white' : 'border-zinc-700 text-zinc-500'
                  }`}>
                  {o.status}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-4">Table {o.table_no || 'N/A'}</h3>

              <div className="grow space-y-3 mb-6">
                {o.ordered_items && o.ordered_items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-zinc-400">
                    <span>{item.qty}x {item.item ? item.item.name : 'Unknown Item'}</span>
                    <span>₹{item.item ? item.item.price * item.qty : 0}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-5 mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-zinc-500 text-sm">Total</span>
                  <span className="text-xl font-bold">₹{o.total}</span>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                  className="w-full bg-black border border-zinc-700 text-white p-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-white"
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500">No active orders found for {restaurantName || 'this restaurant'}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
