import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    const { success } = await login(email, password);
    
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-form-container">
          <h1 className="form-title">Welcome Back!</h1>
          <p className="form-description">Sign in to continue your language learning journey</p>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" 
                id="email" 
                className="form-control" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                type="password" 
                id="password" 
                className="form-control" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Login</button>
          </form>
          
          <div className="form-footer">
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .login-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 80px);
          padding: var(--spacing-8) 0;
        }

        .login-form-container {
          max-width: 450px;
          width: 100%;
          margin: 0 auto;
          padding: var(--spacing-8);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          background-color: var(--bg-primary);
        }

        .form-title {
          font-size: var(--text-2xl);
          font-weight: 700;
          text-align: center;
          margin-bottom: var(--spacing-4);
        }

        .form-description {
          text-align: center;
          margin-bottom: var(--spacing-6);
          color: var(--text-secondary);
        }

        .btn-block {
          width: 100%;
          padding: var(--spacing-4);
          font-size: var(--text-lg);
        }

        .form-footer {
          margin-top: var(--spacing-6);
          text-align: center;
          font-size: var(--text-sm);
        }

        .form-footer p {
          margin-bottom: var(--spacing-2);
        }

        .form-footer a {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
        }

        .form-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login;
