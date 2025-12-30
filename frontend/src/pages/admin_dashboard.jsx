import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [newTableNo, setNewTableNo] = useState('');
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

      if (res.data.orders) {
        setOrders(res.data.orders);
        setRestaurantName(res.data.restaurant_name);
      } else {
        setOrders(res.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/admin/login');
      } else {
        console.error("Error Fetching Orders...", err);
        setError("Failed to fetch orders. Please try again.");
      }
    }
  };

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://127.0.0.1:8000/admin-api/tables/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTables(res.data.tables);
      setRestaurantName(res.data.restaurant_name);
    } catch (err) {
      console.error("Error Fetching Tables...", err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchTables()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
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

  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!newTableNo) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(`http://127.0.0.1:8000/admin-api/tables/`,
        { table_no: newTableNo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTableNo('');
      fetchTables();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add table");
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
          <div className="flex items-center gap-4">
            <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('tables')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'tables' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                Tables
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-black px-5 py-2 rounded-lg font-bold text-sm hover:bg-zinc-200"
            >
              Logout
            </button>
          </div>
        </div>

        {activeTab === 'orders' ? (
          <>
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
          </>
        ) : (
          <div className="space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Add New Table</h3>
              <form onSubmit={handleAddTable} className="flex gap-4">
                <input
                  type="number"
                  placeholder="Table Number"
                  value={newTableNo}
                  onChange={(e) => setNewTableNo(e.target.value)}
                  className="bg-black border border-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-white w-40"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-zinc-200 transition-colors"
                >
                  Add Table
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tables.map((t) => (
                <div key={t.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center">
                  <h3 className="text-2xl font-bold mb-4 text-center text-white">Table {t.table_no}</h3>
                  <div className="bg-white p-4 rounded-xl mb-4">
                    <QRCodeCanvas
                      id={`qr-table-${t.table_no}`}
                      value={`${window.location.origin}/?qr=${t.qr_code_token}`}
                      size={160}
                      level={"H"}
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-zinc-500 text-xs mb-4 text-center break-all">
                    Token: <span className="text-zinc-400">{t.qr_code_token}</span>
                  </p>
                  <button
                    onClick={() => {
                      const canvas = document.getElementById(`qr-table-${t.table_no}`);
                      const pngUrl = canvas
                        .toDataURL("image/png")
                        .replace("image/png", "image/octet-stream");
                      let downloadLink = document.createElement("a");
                      downloadLink.href = pngUrl;
                      downloadLink.download = `Table_${t.table_no}_QR.png`;
                      document.body.appendChild(downloadLink);
                      downloadLink.click();
                      document.body.removeChild(downloadLink);
                    }}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    Download PNG
                  </button>
                </div>
              ))}
            </div>

            {tables.length === 0 && (
              <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                <p className="text-zinc-500">No tables found for {restaurantName || 'this restaurant'}.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
