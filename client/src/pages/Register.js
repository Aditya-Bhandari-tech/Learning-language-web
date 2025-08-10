import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    nativeLanguage: 'English',
    learningLanguage: 'Spanish',
    level: 'beginner'
  });
  const [formErrors, setFormErrors] = useState({});
  const { register, addLearningLanguage, error, clearError } = useAuth();
  const navigate = useNavigate();

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 
    'Portuguese', 'Japanese', 'Chinese', 'Korean', 'Russian', 'Arabic'
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner (A1)' },
    { value: 'elementary', label: 'Elementary (A2)' },
    { value: 'intermediate', label: 'Intermediate (B1)' },
    { value: 'upperintermediate', label: 'Upper-Intermediate (B2)' },
    { value: 'advanced', label: 'Advanced (C1)' },
    { value: 'proficient', label: 'Proficient (C2)' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.nativeLanguage === formData.learningLanguage) {
      errors.learningLanguage = 'Learning language must be different from native language';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    const userData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      password: formData.password,
      nativeLanguage: formData.nativeLanguage
    };

    const { success } = await register(userData);
    
    if (success) {
      // Add learning language after successful registration
      try {
        await addLearningLanguage(formData.learningLanguage, formData.level);
      } catch (error) {
        console.warn('Failed to add learning language during registration:', error);
        // Continue to dashboard even if adding language fails
      }
      navigate('/dashboard');
    }
  };

  return (
    <div className="register-page">
      <div className="container">
        <div className="register-form-container">
          <h1 className="form-title">Join LinguaLearn</h1>
          <p className="form-description">Start your language learning journey today!</p>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName"
                  className={`form-control ${formErrors.firstName ? 'error' : ''}`}
                  value={formData.firstName} 
                  onChange={handleInputChange} 
                  required 
                />
                {formErrors.firstName && <span className="form-error">{formErrors.firstName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName"
                  className={`form-control ${formErrors.lastName ? 'error' : ''}`}
                  value={formData.lastName} 
                  onChange={handleInputChange} 
                  required 
                />
                {formErrors.lastName && <span className="form-error">{formErrors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                className={`form-control ${formErrors.email ? 'error' : ''}`}
                value={formData.email} 
                onChange={handleInputChange} 
                required 
              />
              {formErrors.email && <span className="form-error">{formErrors.email}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  className={`form-control ${formErrors.password ? 'error' : ''}`}
                  value={formData.password} 
                  onChange={handleInputChange} 
                  required 
                />
                {formErrors.password && <span className="form-error">{formErrors.password}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword"
                  className={`form-control ${formErrors.confirmPassword ? 'error' : ''}`}
                  value={formData.confirmPassword} 
                  onChange={handleInputChange} 
                  required 
                />
                {formErrors.confirmPassword && <span className="form-error">{formErrors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="nativeLanguage" className="form-label">Native Language</label>
              <select 
                id="nativeLanguage" 
                name="nativeLanguage"
                className="form-control"
                value={formData.nativeLanguage} 
                onChange={handleInputChange}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="learningLanguage" className="form-label">Language to Learn</label>
                <select 
                  id="learningLanguage" 
                  name="learningLanguage"
                  className={`form-control ${formErrors.learningLanguage ? 'error' : ''}`}
                  value={formData.learningLanguage} 
                  onChange={handleInputChange}
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                {formErrors.learningLanguage && <span className="form-error">{formErrors.learningLanguage}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="level" className="form-label">Current Level</label>
                <select 
                  id="level" 
                  name="level"
                  className="form-control"
                  value={formData.level} 
                  onChange={handleInputChange}
                >
                  {levels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">Create Account</button>
          </form>
          
          <div className="form-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .register-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 80px);
          padding: var(--spacing-8) 0;
        }

        .register-form-container {
          max-width: 600px;
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-4);
        }

        .form-control.error {
          border-color: var(--error-color);
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

        .form-footer a {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
        }

        .form-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
