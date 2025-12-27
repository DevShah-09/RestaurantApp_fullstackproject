import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/admin-api/auth/login/",
        { username, password }
      );
      localStorage.setItem('accessToken', res.data.access);
      localStorage.setItem('refreshToken', res.data.refresh);
      navigate('/admin/dashboard');
    } catch (err) {
      setError("Invalid Credentials!");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 p-3 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 p-3 rounded-xl"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black font-bold p-3 rounded-xl mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );

}

export default AdminLogin;
