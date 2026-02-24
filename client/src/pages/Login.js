import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post('/api/auth/login', {
        identifier,
        password
      });
      
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (error) {
      setIsError(true);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <p className="subtitle">Welcome back! Please login to your account</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email or Phone Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="input-field"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/register">Create Account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
