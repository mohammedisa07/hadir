import React, { useState } from 'react';
import { login, register } from '../lib/api';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.token) {
          localStorage.setItem('user', JSON.stringify(res.user));
          window.location.href = '/';
        } else {
          setError(res.message || 'Login failed');
        }
      } else {
        const res = await register(name, email, password);
        if (res.message === 'User registered successfully.') {
          setIsLogin(true);
        } else {
          setError(res.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required disabled={loading} className="input" />
          </div>
        )}
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} className="input" />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} className="input" />
        </div>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ width: '100%', marginTop: 16 }}>
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        {isLogin ? (
          <span>Don't have an account? <button onClick={() => setIsLogin(false)} disabled={loading}>Register</button></span>
        ) : (
          <span>Already have an account? <button onClick={() => setIsLogin(true)} disabled={loading}>Login</button></span>
        )}
      </div>
    </div>
  );
};

export default AuthPage; 