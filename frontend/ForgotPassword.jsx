import React, { useState } from 'react';
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
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identifier, 
          type: contactType 
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsError(false);
        setMessage(data.message);
        setIdentifier('');
      } else {
        setIsError(true);
        setMessage(data.message);
      }
    } catch (error) {
      setIsError(true);
      setMessage('An error occurred. Please try again later.');
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
      </div>
    </div>
  );
}

export default ForgotPassword;
