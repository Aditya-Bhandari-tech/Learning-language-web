import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    nativeLanguage: 'English',
    learningLanguages: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 
    'Portuguese', 'Russian', 'Japanese', 'Chinese', 'Korean'
  ];

  useEffect(() => {
    // Load user data
    setTimeout(() => {
      setProfileData({
        firstName: user?.firstName || 'John',
        lastName: user?.lastName || 'Doe',
        email: user?.email || 'john.doe@example.com',
        nativeLanguage: user?.nativeLanguage || 'English',
        learningLanguages: user?.learningLanguages || ['Spanish']
      });
      setLoading(false);
    }, 500);
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLanguageToggle = (language) => {
    setProfileData(prev => ({
      ...prev,
      learningLanguages: prev.learningLanguages.includes(language)
        ? prev.learningLanguages.filter(lang => lang !== language)
        : [...prev.learningLanguages, language]
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser(profileData);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    setProfileData({
      firstName: user?.firstName || 'John',
      lastName: user?.lastName || 'Doe',
      email: user?.email || 'john.doe@example.com',
      nativeLanguage: user?.nativeLanguage || 'English',
      learningLanguages: user?.learningLanguages || ['Spanish']
    });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
        <div className="header-actions">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                onClick={handleSave}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="profile-content">
        {/* Personal Information */}
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="avatar-section">
            <div className="avatar-container">
              <div className="avatar">
                <span>{profileData.firstName[0]}{profileData.lastName[0]}</span>
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="profile-section">
          <h3>Language Settings</h3>
          
          <div className="form-group">
            <label>Native Language</label>
            <select
              value={profileData.nativeLanguage}
              onChange={(e) => handleInputChange('nativeLanguage', e.target.value)}
              disabled={!isEditing}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Learning Languages</label>
            <div className="language-grid">
              {languages.map(language => (
                <button
                  key={language}
                  type="button"
                  className={`language-option ${profileData.learningLanguages.includes(language) ? 'selected' : ''}`}
                  onClick={() => isEditing && handleLanguageToggle(language)}
                  disabled={!isEditing}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="profile-section">
          <h3>Account Actions</h3>
          <div className="account-actions">
            <button className="btn btn-secondary">Change Password</button>
            <button className="btn btn-danger">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 