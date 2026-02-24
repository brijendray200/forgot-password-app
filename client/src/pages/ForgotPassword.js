import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';

function ForgotPassword() {
  const [contactType, setContactType] = useState('email');
  const [identifier, setIdentifier] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post('/api/forgot-password', {
        identifier,
        type: contactType
      });
      
      if (response.data.success) {
        setIsError(false);
        setMessage(response.data.message);
        setIdentifier('');
      }
    } catch (error) {
      setIsError(true);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Reset Password</h2>
        <p className="subtitle">Enter your email or phone number to receive a new password</p>
        
        <form onSubmit={handleSubmit}>
          <div className="contact-type-selector">
            <label>
              <input
                type="radio"
                value="email"
                checked={contactType === 'email'}
                onChange={(e) => setContactType(e.target.value)}
              />
              Email
            </label>
            <label>
              <input
                type="radio"
                value="phone"
                checked={contactType === 'phone'}
                onChange={(e) => setContactType(e.target.value)}
              />
              Phone Number
            </label>
          </div>

          <input
            type={contactType === 'email' ? 'email' : 'tel'}
            placeholder={contactType === 'email' ? 'Enter your email' : 'Enter your phone number'}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="input-field"
          />

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>

        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="links">
          <Link to="/login">Back to Login</Link>
          <Link to="/register">Create Account</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
